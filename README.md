# UniPulse AI — IIT Sentiment Analysis Platform

![UniPulse AI](https://img.shields.io/badge/UniPulse-AI%20Powered-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-23%20IITs-FF6B6B?style=for-the-badge)
![Data Source](https://img.shields.io/badge/Data%20Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A comprehensive sentiment analysis platform aggregating and analyzing student sentiments across all 23 Indian Institutes of Technology.**

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Sentiment Scoring](#sentiment-scoring)
- [Sentiment Categories](#sentiment-categories)
- [IITs Covered](#iits-covered)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## About the Project

**UniPulse AI** is a full-stack sentiment analysis platform that scrapes Reddit posts from IIT subreddits, analyzes sentiment using NLP, and displays real-time insights through an interactive dark-themed web interface.

Whether it's academics, placements, hostel life, or campus culture — UniPulse AI gives administrators, researchers, and students a real-time pulse on what matters most across India's premier engineering institutions.

> "Data-driven decisions for a better campus experience."

---

## Key Features

| Feature | Description |
| --- | --- |
| Multi-IIT Aggregation | Covers all 23 IITs — from IIT Bombay to IIT Dharwad |
| Live Sentiment Dashboard | Visual analytics with charts, scores, and category breakdowns |
| VADER NLP Analysis | Sentiment scoring using VADER (Valence Aware Dictionary and sEntiment Reasoner) |
| Reddit Data Integration | Automated scraping and processing of IIT subreddit communities |
| Category-wise Breakdown | Sentiments across Academics, Placements, Hostel Life, Mental Health and more |
| Compare Page | Rank all 23 IITs side-by-side with bar charts and progress bars |
| Auto Scraper + Scheduler | Fetches fresh posts automatically |
| Dark UI | Built with Inter + Space Grotesk fonts, cyan/amber accents |

---

## Tech Stack

### Backend

| Tool | Purpose |
| --- | --- |
| FastAPI | REST API framework |
| SQLite + SQLAlchemy | Database and ORM |
| VADER (NLTK) | Sentiment analysis |
| Requests | Reddit scraping |
| python-dotenv | Environment variables |

### Frontend

| Tool | Purpose |
| --- | --- |
| React 18 | UI framework |
| Vite | Build tool |
| Recharts | Charts and graphs |
| Axios | HTTP client |
| React Router | Client-side routing |

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     UniPulse AI                         │
├──────────────┬──────────────────────┬───────────────────┤
│  Data Layer  │   Processing Layer   │  Presentation     │
│              │                      │  Layer            │
│  Reddit API  │  ┌────────────────┐  │                   │
│  (PRAW)      │  │ Text Cleaning  │  │  React Dashboard  │
│              │  │ Tokenization   │  │                   │
│  23 IIT      │  │ Sentiment Model│  │  Charts and       │
│  Subreddits  │  │ (VADER)        │  │  Analytics        │
│              │  │ Category       │  │                   │
│  SQLite DB   │  │ Classification │  │  Compare Page     │
│              │  └────────────────┘  │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- A Reddit Developer Account (optional, for higher rate limits)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Virvivek007/unipulse_sentiment_analysis.git
cd unipulse_sentiment_analysis
```

#### 2. Backend Setup

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

- Backend runs at: `http://localhost:8000`
- API docs at: `http://localhost:8000/docs`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

- Frontend runs at: `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=sqlite:///./unipulse.db

# Reddit OAuth (optional, for higher rate limits)
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=UniPulseBot/1.0
```

> **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/sentiment/{iit}` | Get sentiment data for a specific IIT |
| GET | `/api/sentiment/{iit}?category=Academics` | Filter by category |
| GET | `/api/compare` | Get all IITs ranked by sentiment score |
| GET | `/api/iits` | List all available IITs |
| GET | `/health` | Health check |
| GET | `/docs` | Interactive API documentation |

---

## Sentiment Scoring

Scores are calculated using **VADER (Valence Aware Dictionary and sEntiment Reasoner)**:

| Score Range | Label | Color |
| --- | --- | --- |
| 70 to 100 | Positive / Strong | Cyan |
| 55 to 69 | Neutral / Mixed | Amber |
| 0 to 54 | Negative / Weak | Pink |

Raw compound scores (-1 to 1) are normalized to 0–100:

```text
score = round((compound + 1) / 2 * 100)
```

---

## Sentiment Categories

| Category | Description |
| --- | --- |
| Academics | Course difficulty, professors, curriculum quality |
| Placements | Internships, job offers, company visits, preparation |
| Hostel Life | Dorms, mess food, cleanliness, infrastructure |
| Fests and Culture | Events, clubs, social life, student activities |
| Mental Health | Wellness, medical facilities, support services |
| Administration | Policies, bureaucracy, faculty responsiveness |
| Infrastructure | Campus facilities, labs, internet, transport |
| General | Miscellaneous student discussions |

---

## IITs Covered

| Key | Full Name | Subreddit |
| --- | --- | --- |
| IITBombay | IIT Bombay | r/iitbombay |
| IITDelhi | IIT Delhi | r/IITDelhi |
| IITMadras | IIT Madras | r/iitmadras |
| IITK | IIT Kanpur | r/IITK |
| IITKgp | IIT Kharagpur | r/iitkgp |
| IITRoorkee | IIT Roorkee | r/IITRoorkee |
| IITBHU | IIT BHU Varanasi | r/IITBHU |
| IITGuwahati | IIT Guwahati | r/iitg |
| IITHyderabad | IIT Hyderabad | r/IITHyderabad |
| IITIndore | IIT Indore | r/IITIndore |
| + 13 more | All remaining IITs | various |

---

## Project Structure

```text
unipulse-ai/
├── backend/
│   ├── api.py              # FastAPI routes
│   ├── scraper.py          # Reddit scraper
│   ├── sentiment.py        # VADER sentiment analysis
│   ├── database.py         # SQLAlchemy setup
│   ├── models.py           # DB models
│   ├── main.py             # App entry point
│   ├── init_db.py          # DB initializer
│   ├── scheduler.py        # Auto-scrape scheduler
│   └── unipulse.db         # SQLite database
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx       # Main dashboard page
        │   └── Compare.jsx         # IIT comparison page
        ├── components/
        │   ├── Navbar.jsx          # Top navigation
        │   ├── PostFeed.jsx        # Reddit post cards
        │   ├── SentimentChart.jsx
        │   └── CategoryBars.jsx
        ├── api.js                  # Axios API calls
        ├── App.jsx                 # Router setup
        ├── App.css                 # Component styles
        └── index.css               # Global styles
```

---

## Re-scraping Data

To refresh Reddit data for all IITs:

```bash
cd backend
py scraper.py
```

This scrapes ~25 posts per IIT (~575 total posts) and saves them to `unipulse.db`.

---

## Deployment

The project is configured for deployment on **Vercel**.

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:

   ```bash
   vercel --prod
   ```

3. Add environment variables in the **Vercel Dashboard** under Project Settings > Environment Variables.

Alternatively, connect your GitHub repository to Vercel for **automatic deployments** on every push to `main`.

---

## Contributing

Contributions are welcome!

1. Fork the repo

2. Create a feature branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m "add: AmazingFeature"
   ```

4. Push:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a **Pull Request**

---

## Roadmap

- [ ] Add Twitter/X as a secondary data source
- [ ] User authentication for personalized dashboards
- [ ] Email/Slack alerts for sudden sentiment drops
- [ ] Expand coverage to NITs and other institutions
- [ ] Multilingual sentiment analysis (Hindi support)

---

## License

This project is licensed under the **MIT License** — free to use for educational purposes.

---

## Author

**Vivek** — [@Virvivek007](https://github.com/Virvivek007)

---

Made with love for the IIT Community. Star this repo if you found it useful!