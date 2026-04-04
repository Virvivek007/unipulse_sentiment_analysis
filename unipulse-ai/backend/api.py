from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import sqlite3

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return sqlite3.connect("unipulse.db")

@app.get("/")
def home():
    return {"message": "UniPulse API running"}

@app.get("/sentiments")
def get_sentiments():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM sentiments LIMIT 100")
    data = cursor.fetchall()
    
    conn.close()
    
    return {"data": data}
@app.get("/api/sentiment/{iit}")
def get_sentiment_by_iit(iit: str, category: str = "All"):
    conn = get_db()
    cursor = conn.cursor()

    if category == "All":
        cursor.execute("""
            SELECT iit, text, sentiment, score, category
            FROM sentiments
            WHERE LOWER(REPLACE(iit, ' ', '')) = LOWER(?)
        """, (iit,))
    else:
        cursor.execute("""
            SELECT iit, text, sentiment, score, category
            FROM sentiments
            WHERE LOWER(REPLACE(iit, ' ', '')) = LOWER(?)
            AND category = ?
        """, (iit, category))

    rows = cursor.fetchall()

    data = [{
        "iit": row[0],
        "text": row[1],
        "sentiment": row[2],
        "score": row[3],
        "category": row[4]
    } for row in rows]

    conn.close()

    return {
        "iit": iit,
        "category": category,
        "count": len(data),
        "data": data
    }


@app.get("/api/iits")
def get_all_iits():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT iit FROM sentiments")
    rows = cursor.fetchall()

    data = [row[0] for row in rows]

    conn.close()

    return {"iits": data}
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/all-iits")
def get_all_iits_data(category: str = "All"):
    conn = get_db()
    cursor = conn.cursor()

    if category != "All":
        cursor.execute("""
            SELECT iit, AVG(score), COUNT(*)
            FROM sentiments
            WHERE category = ?
            GROUP BY iit
        """, (category,))
    else:
        cursor.execute("""
            SELECT iit, AVG(score), COUNT(*)
            FROM sentiments
            GROUP BY iit
        """)

    rows = cursor.fetchall()
    conn.close()

    data = []

    for row in rows:
        avg_score = row[1] if row[1] is not None else 0
        data.append({
            "iit": row[0],
            "score": round((avg_score + 1) / 2 * 100),
            "posts": row[2]
        })

    return data


@app.get("/api/compare")
def compare_alias(category: str = "All"):
    return get_all_iits_data(category=category)