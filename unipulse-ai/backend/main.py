from typing import List, Optional, TypedDict
from time import time
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db, engine
from scheduler import scheduler  # auto-starts on import
import models, scraper, sentiment as sa
from collections import defaultdict


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
COMPARE_CACHE_TTL_SECONDS   = 300
COMPARE_WORKERS              = 8

_sentiment_cache: dict[str, SentimentCacheEntry] = {}
_compare_cache:   CompareCacheEntry = {"ts": 0.0, "data": []}


def _is_cache_valid(ts: float, ttl_seconds: int) -> bool:
    return (time() - ts) < ttl_seconds


def _compute_compare_item(iit_key: str) -> dict[str, int | str] | None:
    posts    = scraper.scrape_iit(iit_key, limit=30)
    analyzed = sa.analyze_posts(posts)
    if not analyzed:
        return None
    avg = sum(float(p["compound"]) for p in analyzed) / len(analyzed)
    return {
        "iit":   iit_key,
        "score": round((avg + 1) / 2 * 100),
        "posts": len(analyzed),
    }


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="UniPulse AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── /api/stats ────────────────────────────────────────────────────────────────

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Instant stats from database — no scraping."""
    total = db.query(models.Post).count()

    sentiment_dist = db.query(
        models.Post.label,
        func.count(models.Post.id)
    ).group_by(models.Post.label).all()

    category_dist = db.query(
        models.Post.category,
        func.count(models.Post.id)
    ).group_by(models.Post.category).all()

    iit_dist = db.query(
        models.Post.iit,
        func.count(models.Post.id)
    ).group_by(models.Post.iit).order_by(func.count(models.Post.id).desc()).all()

    iit_scores = db.query(
        models.Post.iit,
        func.avg(models.Post.compound),
        func.count(models.Post.id)
    ).group_by(models.Post.iit).all()

    iit_ranking = []
    for iit, avg_compound, count in iit_scores:
        if count > 0:
            iit_ranking.append({
                "iit":   iit,
                "score": round((avg_compound + 1) / 2 * 100),
                "posts": count,
            })
    iit_ranking.sort(key=lambda x: x["score"], reverse=True)

    return {
        "total_posts": total,
        "sentiment":   {k: v for k, v in sentiment_dist},
        "categories":  {k: v for k, v in category_dist},
        "iits":        [{"iit": k, "posts": v} for k, v in iit_dist],
        "ranking":     iit_ranking[:10],
    }


# ── /api/sentiment/{iit_key} ──────────────────────────────────────────────────

@app.get("/api/sentiment/{iit_key}")
def get_sentiment(iit_key: str, db: Session = Depends(get_db)):
    posts_raw      = scraper.scrape_iit(iit_key.upper(), limit=80)
    posts_analyzed = sa.analyze_posts(posts_raw)

    cat_data: dict = defaultdict(lambda: {"scores": [], "posts": 0})
    for p in posts_analyzed:
        cat_data[p["category"]]["scores"].append(p["compound"])
        cat_data[p["category"]]["posts"] += 1

    categories = []
    for cat, data in cat_data.items():
        avg        = sum(data["scores"]) / len(data["scores"])
        normalized = round((avg + 1) / 2 * 100)
        categories.append({"name": cat, "score": normalized, "posts": data["posts"]})

    total_scores = [p["compound"] for p in posts_analyzed]
    overall      = round((sum(total_scores) / len(total_scores) + 1) / 2 * 100) if total_scores else 50

    # Build top_posts list from analyzed posts
    top_posts = [
        {
            "text":      p.get("text", ""),
            "sentiment": p.get("label", "neutral"),
            "score":     p.get("compound", 0),
            "category":  p.get("category", "General"),
        }
        for p in posts_analyzed[:10]
    ]

    return {
        "iit":        iit_key.upper(),
        "overall":    overall,
        "total_posts": len(posts_analyzed),
        "categories": categories,
        "top_posts":  top_posts,
    }


# ── /api/compare ──────────────────────────────────────────────────────────────

@app.get("/api/compare")
def compare_all(db: Session = Depends(get_db)):
    """Compare all IITs using database data — instant load."""
    iit_scores = db.query(
        models.Post.iit,
        func.avg(models.Post.compound),
        func.count(models.Post.id)
    ).group_by(models.Post.iit).all()

    results = []
    for iit, avg_compound, count in iit_scores:
        if count > 0:
            results.append({
                "iit":   iit,
                "score": round((avg_compound + 1) / 2 * 100),
                "posts": count,
            })

    return sorted(results, key=lambda x: x["score"], reverse=True)