import requests
import os
from dotenv import load_dotenv
from datetime import datetime

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