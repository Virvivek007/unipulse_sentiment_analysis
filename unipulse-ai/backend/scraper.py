import sqlite3
from sentiment import analyze_sentiment
import requests
import os
from dotenv import load_dotenv
from datetime import datetime
from time import sleep
import sqlite3

load_dotenv()

IIT_SUBREDDITS = {
    "IITBHU":         "IITBHU",
    "IITBhubaneswar": "IITBhubaneswar",
    "IITBombay":      "iitbombay",
    "IITDelhi":       "IITDelhi",
    "IITISM":         "IITISM",
    "IITGandhinagar": "IITGandhinagar",
    "IITGoa":         "IITGoa",
    "IITGuwahati":    "IITGuwahati",
    "IITHyderabad":   "IITHyderabad",
    "IITIndore":      "IITIndore",
    "IITJammu":       "IITJammu",
    "IITJodhpur":     "IITJodhpur",
    "IITK":           "IITK",
    "IITKgp":         "iitkgp",
    "IITMadras":      "iitmadras",
    "IITMandi":       "IITMandi",
    "IITPalakkad":    "IITPalakkad",
    "IITPatna":       "IITPatna",
    "IITRoorkee":     "IITRoorkee",
    "IITRopar":       "IITRopar",
    "IITTirupati":    "IITTirupati",
    "IITBhilai":      "IITBhilai",
    "IITDharwad":     "IITDharwad",
}

# Case-insensitive canonical mapping for incoming API keys.
CANONICAL_IIT_KEYS = {key.lower(): key for key in IIT_SUBREDDITS.keys()}

CATEGORY_KEYWORDS = {
    "Academics":      ["exam", "professor", "course", "grade", "cgpa", "study", "lecture", "assignment", "quiz", "test"],
    "Placements":     ["placement", "internship", "package", "company", "offer", "recruit", "job", "salary", "jnf"],
    "Hostel Life":    ["hostel", "mess", "food", "room", "warden", "dorm", "canteen", "accommodations"],
    "Fests & Culture":["fest", "cultural", "techfest", "mood indigo", "spring fest", "event", "competition"],
    "Mental Health":  ["stress", "anxiety", "depression", "counseling", "mental", "burnout", "vent", "support"],
    "Infrastructure": ["lab", "library", "wifi", "facility", "building", "campus", "gym", "resources"],
    "Administration": ["admin", "dean", "rule", "policy", "fee", "bureaucracy", "portal", "registrar"],
}

def categorize_post(text):
    text_lower = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return "General"

def scrape_iit(iit_key, limit=100):
    """Fetch hot posts from Reddit API endpoint"""
    normalized_key = str(iit_key).strip().lower()
    canonical_key = CANONICAL_IIT_KEYS.get(normalized_key)
    if not canonical_key:
        return []

    sub_name = IIT_SUBREDDITS.get(canonical_key)
    if not sub_name:
        return []

    posts = []
    url = f"https://www.reddit.com/r/{sub_name}/hot.json"
    
    user_agents = [
        "UniPulse-AI/1.0 (Educational Project)",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    ]

    for attempt in range(2):
        headers = {
            "User-Agent": user_agents[min(attempt, len(user_agents) - 1)]
        }

        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            if "data" in data and "children" in data["data"]:
                for item in data["data"]["children"][:limit]:
                    post = item.get("data", {})
                    posts.append({
                        "iit":       canonical_key,
                        "post_id":   post.get("id", ""),
                        "title":     post.get("title", ""),
                        "body":      post.get("selftext", "")[:500],
                        "score":     post.get("score", 0),
                        "comments":  post.get("num_comments", 0),
                        "created":   post.get("created_utc", 0),
                        "category":  categorize_post(post.get("title", "") + " " + post.get("selftext", "")),
                        "subreddit": sub_name,
                        "url":       post.get("url", ""),
                    })

            if posts:
                break
        except requests.exceptions.RequestException as e:
            print(f"Error scraping {canonical_key} ({sub_name}) attempt {attempt + 1}: {e}")
            if attempt == 0:
                sleep(0.4)
        except Exception as e:
            print(f"Error processing {canonical_key} data: {e}")
            break
    
    return posts
def get_db():
    return sqlite3.connect("unipulse.db")
def save_post(post):
    conn = get_db()
    cursor = conn.cursor()

    text = post["title"] + " " + post["body"]

    sentiment_data = analyze_sentiment(text)
    sentiment = sentiment_data["label"]
    score = sentiment_data["compound"]

    cursor.execute("""
        INSERT INTO sentiments (iit, text, sentiment, score, category)
        VALUES (?, ?, ?, ?, ?)
    """, (
        post["iit"],
        text,
        sentiment,
        score,
        post["category"]
    ))

    conn.commit()
    conn.close()

def clear_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sentiments")
    conn.commit()
    conn.close()
    
def run_scraper():
    print("🚀 Starting UniPulse scraping...")

    clear_db()
    
    for iit in IIT_SUBREDDITS.keys():
        print(f"🔍 Scraping {iit}")

        posts = scrape_iit(iit)

        for post in posts:
            save_post(post)

    print("✅ All data stored in DB!")
if __name__ == "__main__":
    run_scraper()