from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import TypedDict
from concurrent.futures import ThreadPoolExecutor
from time import time
from database import get_db, engine
from scheduler import scheduler  # auto-starts on import
import models, scraper, sentiment as sa


class CategoryAggregate(TypedDict):
    scores: list[float]
    posts: int


class SentimentCacheEntry(TypedDict):
    ts: float
    data: dict[str, object]


class CompareCacheEntry(TypedDict):
    ts: float
    data: list[dict[str, int | str]]


SENTIMENT_CACHE_TTL_SECONDS = 300
COMPARE_CACHE_TTL_SECONDS = 300
COMPARE_WORKERS = 8

# Cache format: {key: {"ts": unix_time, "data": payload}}
_sentiment_cache: dict[str, SentimentCacheEntry] = {}
_compare_cache: CompareCacheEntry = {"ts": 0.0, "data": []}


def _is_cache_valid(ts: float, ttl_seconds: int) -> bool:
    return (time() - ts) < ttl_seconds


def _compute_compare_item(iit_key: str) -> dict[str, int | str] | None:
    posts = scraper.scrape_iit(iit_key, limit=30)
    analyzed = sa.analyze_posts(posts)
    if not analyzed:
        return None

    avg = sum(float(p["compound"]) for p in analyzed) / len(analyzed)
    return {
        "iit": iit_key,
        "score": round((avg + 1) / 2 * 100),
        "posts": len(analyzed),
    }

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="UniPulse AI API")

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"], allow_headers=["*"])

@app.get("/api/sentiment/{iit_key}")
def get_sentiment(iit_key: str, db: Session = Depends(get_db)):
    requested_key = iit_key.strip()
    canonical_key = scraper.CANONICAL_IIT_KEYS.get(requested_key.lower(), requested_key)

    cached = _sentiment_cache.get(canonical_key)
    if cached and _is_cache_valid(cached["ts"], SENTIMENT_CACHE_TTL_SECONDS):
        return cached["data"]

    posts_raw = scraper.scrape_iit(canonical_key, limit=80)
    if not posts_raw:
        # Retry once to handle transient Reddit/API failures.
        posts_raw = scraper.scrape_iit(canonical_key, limit=80)
    posts_analyzed = sa.analyze_posts(posts_raw)

    # Aggregate by category
    cat_data: dict[str, CategoryAggregate] = {}
    for p in posts_analyzed:
        category = str(p.get("category", "General"))
        compound = float(p.get("compound", 0.0))

        if category not in cat_data:
            cat_data[category] = {"scores": [], "posts": 0}

        cat_data[category]["scores"].append(compound)
        cat_data[category]["posts"] += 1

    categories = []
    for cat, data in cat_data.items():
        avg = sum(data["scores"]) / len(data["scores"])
        # Normalize -1..1 → 0..100
        normalized = round((avg + 1) / 2 * 100)
        categories.append({
            "name": cat, "score": normalized,
            "posts": data["posts"]
        })

    total_scores = [p["compound"] for p in posts_analyzed]
    overall = round((sum(total_scores)/len(total_scores) + 1) / 2 * 100) if total_scores else 50

    response = {
        "iit":        canonical_key,
        "overall":    overall,
        "total_posts": len(posts_analyzed),
        "categories": categories,
        "top_posts":  posts_analyzed[:5],
    }

    if posts_analyzed:
        _sentiment_cache[canonical_key] = {"ts": time(), "data": response}
    return response

@app.get("/api/compare")
def compare_all(db: Session = Depends(get_db)):
    if _is_cache_valid(_compare_cache["ts"], COMPARE_CACHE_TTL_SECONDS):
        return _compare_cache["data"]

    keys = list(scraper.IIT_SUBREDDITS.keys())
    with ThreadPoolExecutor(max_workers=COMPARE_WORKERS) as pool:
        items = list(pool.map(_compute_compare_item, keys))

    results = [item for item in items if item is not None]
    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
    _compare_cache["ts"] = time()
    _compare_cache["data"] = sorted_results
    return sorted_results
