from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "unipulse.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name
    return conn


@app.get("/")
def home():
    return {"message": "UniPulse API running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ── /api/sentiment/{iit} ──────────────────────────────────────────────────────

@app.get("/api/sentiment/{iit}")
def get_sentiment_by_iit(iit: str, category: str = "All"):
    conn = get_db()
    cursor = conn.cursor()

    if category == "All":
        cursor.execute("""
            SELECT iit, title AS text, label AS sentiment, compound AS score, category
            FROM posts
            WHERE LOWER(REPLACE(iit, ' ', '')) = LOWER(?)
        """, (iit,))
    else:
        cursor.execute("""
            SELECT iit, title AS text, label AS sentiment, compound AS score, category
            FROM posts
            WHERE LOWER(REPLACE(iit, ' ', '')) = LOWER(?)
            AND category = ?
        """, (iit, category))

    rows = cursor.fetchall()

    data = [{
        "iit":       row["iit"],
        "text":      row["text"],
        "sentiment": row["sentiment"],
        "score":     row["score"],
        "category":  row["category"],
    } for row in rows]

    conn.close()

    return {
        "iit":      iit,
        "category": category,
        "count":    len(data),
        "data":     data,
    }


# ── /api/iits ─────────────────────────────────────────────────────────────────

@app.get("/api/iits")
def get_all_iits():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT iit FROM posts")
    rows = cursor.fetchall()
    conn.close()
    return {"iits": [row["iit"] for row in rows]}


# ── /api/all-iits & /api/compare ─────────────────────────────────────────────

@app.get("/api/all-iits")
@app.get("/api/compare")
def get_all_iits_data(category: str = "All"):
    conn = get_db()
    cursor = conn.cursor()

    if category != "All":
        cursor.execute("""
            SELECT iit, AVG(compound), COUNT(*)
            FROM posts
            WHERE category = ?
            GROUP BY iit
        """, (category,))
    else:
        cursor.execute("""
            SELECT iit, AVG(compound), COUNT(*)
            FROM posts
            GROUP BY iit
        """)

    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        avg = row[1] if row[1] is not None else 0
        data.append({
            "iit":   row[0],
            "score": round((avg + 1) / 2 * 100),
            "posts": row[2],
        })

    return sorted(data, key=lambda x: x["score"], reverse=True)


# ── /sentiments (legacy) ──────────────────────────────────────────────────────

@app.get("/sentiments")
def get_sentiments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    return {"data": [dict(row) for row in rows]}