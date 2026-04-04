# ⚡ UniPulse AI

> **Live Reddit Sentiment Intelligence across all 23 IITs**

UniPulse AI is a full-stack sentiment analysis dashboard that scrapes Reddit posts from IIT subreddits, analyzes their sentiment using NLP, and displays real-time insights through an interactive dark-themed web interface.

![UniPulse Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.11+-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)

---

## 🖥️ Screenshots

### Dashboard
- Live sentiment score per IIT (0–100)
- Category breakdown (Academics, Placements, Hostel Life, etc.)
- Top Reddit posts with sentiment labels

### Compare
- All 23 IITs ranked side by side
- Bar chart scoreboard
- 4-column card grid with progress bars

---

## 🧠 Features

- 📊 **Live Sentiment Scoring** — Reddit posts analyzed using VADER NLP
- 🏫 **23 IITs Covered** — All major IITs with their subreddits
- 📂 **8 Categories** — Academics, Placements, Hostel Life, Fests & Culture, Mental Health, Infrastructure, Administration, General
- 🔄 **Auto Scraper** — Fetches fresh posts from Reddit public API
- 📈 **Compare Page** — Rank all IITs by sentiment score
- 🌙 **Dark UI** — Built with Inter + Space Grotesk fonts, cyan/amber accents

---

## 🗂️ Project Structure

```
unipulse-ai/
├── backend/
│   ├── api.py            # FastAPI routes
│   ├── scraper.py        # Reddit scraper
│   ├── sentiment.py      # VADER sentiment analysis
│   ├── database.py       # SQLAlchemy setup
│   ├── models.py         # DB models
│   ├── main.py           # App entry (SQLAlchemy version)
│   ├── init_db.py        # DB initializer
│   ├── scheduler.py      # Auto-scrape scheduler
│   └── unipulse.db       # SQLite database
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx   # Main dashboard page
        │   └── Compare.jsx     # IIT comparison page
        ├── components/
        │   ├── Navbar.jsx      # Top navigation
        │   ├── PostFeed.jsx    # Reddit post cards
        │   ├── SentimentChart.jsx
        │   └── CategoryBars.jsx
        ├── api.js              # Axios API calls
        ├── App.jsx             # Router setup
        ├── App.css             # Component styles
        └── index.css           # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Virvivek007/unipulse_sentiment_analysis.git
cd unipulse_sentiment_analysis
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Initialize database
py init_db.py

# Scrape Reddit data (run once to populate DB)
py scraper.py

# Start backend server
py -m uvicorn api:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sentiment/{iit}` | Get sentiment data for a specific IIT |
| GET | `/api/sentiment/{iit}?category=Academics` | Filter by category |
| GET | `/api/compare` | Get all IITs ranked by sentiment score |
| GET | `/api/iits` | List all available IITs |
| GET | `/health` | Health check |
| GET | `/docs` | Interactive API documentation |

---

## 📦 Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| FastAPI | REST API framework |
| SQLite | Database |
| VADER (NLTK) | Sentiment analysis |
| Requests | Reddit scraping |
| SQLAlchemy | ORM |
| python-dotenv | Environment variables |

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Recharts | Charts & graphs |
| Axios | HTTP client |
| React Router | Client-side routing |

---

## 🏫 IITs Covered

| Key | Full Name | Subreddit |
|-----|-----------|-----------|
| IITBHU | IIT BHU Varanasi | r/IITBHU |
| IITBombay | IIT Bombay | r/iitbombay |
| IITDelhi | IIT Delhi | r/IITDelhi |
| IITK | IIT Kanpur | r/IITK |
| IITKgp | IIT Kharagpur | r/iitkgp |
| IITMadras | IIT Madras | r/iitmadras |
| IITRoorkee | IIT Roorkee | r/IITRoorkee |
| IITGuwahati | IIT Guwahati | r/iitg |
| IITHyderabad | IIT Hyderabad | r/IITHyderabad |
| IITIndore | IIT Indore | r/IITIndore |
| + 13 more | ... | ... |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=sqlite:///./unipulse.db
```

For Reddit OAuth (optional, for higher rate limits):
```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=UniPulseBot/1.0
```

---

## 🔄 Re-scraping Data

To refresh Reddit data for all IITs:

```bash
cd backend
py scraper.py
```

This scrapes 25 posts per IIT (~575 total posts) and saves them to `unipulse.db`.

---

## 📊 Sentiment Scoring

Scores are calculated using **VADER (Valence Aware Dictionary and sEntiment Reasoner)**:

| Score Range | Label | Color |
|-------------|-------|-------|
| 70 – 100 | Positive / Strong | 🔵 Cyan |
| 55 – 69 | Neutral / Mixed | 🟡 Amber |
| 0 – 54 | Negative / Weak | 🔴 Pink |

Raw compound scores (-1 to 1) are normalized to 0–100:
```
score = round((compound + 1) / 2 * 100)
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "add: your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for educational purposes.

---

## 👨‍💻 Author

**Vivek** — [@Virvivek007](https://github.com/Virvivek007)

---

*Built with ⚡ for the IIT community*
