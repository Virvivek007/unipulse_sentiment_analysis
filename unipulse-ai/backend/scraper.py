import sqlite3
from sentiment import analyze_sentiment
import requests
import os
import time
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
    "IITISM":         "IndianInstituteofTechnologyISM",
    "IITGandhinagar": "IITGandhinagar",
    "IITGoa":         "IITGoa",
    "IITGuwahati":    "iitg",
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
    sub_name = IIT_SUBREDDITS.get(iit_key)
    if not sub_name:
        return []

    posts = []
    url = f"https://www.reddit.com/r/{sub_name}/hot.json"
    
    headers = {
        'User-Agent': 'UniPulse-AI/1.0 (Educational Project)'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if "data" in data and "children" in data["data"]:
            for item in data["data"]["children"][:limit]:
                post = item.get("data", {})
                posts.append({
                    "iit":       iit_key,
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
    except requests.exceptions.RequestException as e:
        print(f"Error scraping {iit_key} ({sub_name}): {e}")
    except Exception as e:
        print(f"Error processing {iit_key} data: {e}")
    
    return posts

def scrape_and_save_all():
    """Scrape all IITs and save to database"""
    conn = sqlite3.connect("unipulse.db")
    cursor = conn.cursor()
    
    # Create table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            iit TEXT,
            title TEXT,
            body TEXT,
            category TEXT,
            compound REAL,
            label TEXT,
            score INTEGER,
            comments INTEGER,
            subreddit TEXT,
            scraped_at TEXT
        )
    """)
    conn.commit()

    for iit_key in IIT_SUBREDDITS.keys():
        print(f"Scraping {iit_key}...")
        posts = scrape_iit(iit_key, limit=25)
        
        for post in posts:
            text = post["title"] + " " + post["body"]
            sentiment = analyze_sentiment(text)
            
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO posts 
                    (id, iit, title, body, category, compound, label, score, comments, subreddit, scraped_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    post["post_id"],
                    post["iit"],
                    post["title"],
                    post["body"],
                    post["category"],
                    sentiment["compound"],
                    sentiment["label"],
                    post["score"],
                    post["comments"],
                    post["subreddit"],
                    datetime.utcnow().isoformat()
                ))
            except Exception as e:
                print(f"  Error saving post: {e}")
        
        conn.commit()
        print(f"  ✓ Saved {len(posts)} posts for {iit_key}")
        sleep(1)  # be polite to Reddit
    
    conn.close()
    print("\n✅ All IITs scraped and saved!")

if __name__ == "__main__":
    scrape_and_save_all()