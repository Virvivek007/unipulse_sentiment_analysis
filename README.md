# 🎯 UniPulse AI
### Sentiment Analysis Platform for IIT Student Communities

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-black)

> A production-grade, end-to-end AI-powered sentiment intelligence platform that aggregates and analyzes student discussions across **all 23 IIT communities** on Reddit — turning raw social media posts into structured institutional intelligence.

🔗 **Live Demo:** [https://unipulse-sentiment-analysis.vercel.app](https://unipulse-sentiment-analysis.vercel.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Sentiment Analysis Engine](#-sentiment-analysis-engine)
- [Agent System](#-agent-system)
- [RAG Chatbot](#-rag-chatbot)
- [Dashboard Screenshots](#-dashboard-screenshots)
- [Performance Metrics](#-performance-metrics)
- [Team](#-team)
- [References](#-references)

---

## 🌟 Overview

UniPulse AI solves four core problems in the IIT ecosystem:

| Problem | Solution |
|---|---|
| Student feedback fragmented across 23 subreddits | Centralized Reddit ingestion pipeline |
| No structured sentiment labels on raw posts | Dual-model NLP engine (VADER + DistilBERT) |
| No actionable dashboard for trend analysis | Interactive React analytics dashboard |
| No automated insight generation | Multi-agent framework + RAG chatbot |

The platform covers **all 23 IITs** — from IIT Bombay (est. 1958) to newer institutions like IIT Dharwad and IIT Palakkad.

---

## ✨ Features

- ✅ **Real-time Reddit Scraping** — Continuous ingestion from 23 IIT subreddits using PRAW
- ✅ **Dual-Model Sentiment Analysis** — VADER + DistilBERT ensemble (85%+ accuracy)
- ✅ **Interactive Dashboard** — React 18 with Recharts visualizations
- ✅ **Cross-IIT Comparison** — Side-by-side sentiment benchmarking
- ✅ **Category Analysis** — 6 categories: Academics, Placements, Hostel, Campus Culture, Health, Administration
- ✅ **Multi-Agent Insights** — Automated nightly insight generation
- ✅ **RAG Chatbot** — Natural language querying over Reddit post data
- ✅ **CI/CD Pipeline** — Zero-downtime deployments via GitHub Actions + Vercel
- ✅ **Light/Dark Theme** — Full responsive design with CSS variable theming

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SOURCES                         │
│  Reddit API (PRAW) │ Post Metadata │ Rate-Limit Handler │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  NLP SENTIMENT ENGINE                   │
│   Pre-processor │ VADER (<1ms) │ DistilBERT (50-200ms)  │
│                    Ensemble Scorer (40/60 weight)       │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│               BACKEND & DATABASE                        │
│    FastAPI │ PostgreSQL │ Redis Cache │ APScheduler     │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React 18)                    │
│   React Query │ Recharts │ CSS Variables │ Vite         │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│               CI/CD & DEPLOYMENT                        │
│   GitHub Actions │ Vercel │ Neon.tech PostgreSQL        │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Core language |
| FastAPI | REST API framework |
| PostgreSQL 16 | Primary database |
| Redis | Caching layer (TTL: 15 min) |
| APScheduler | Nightly batch jobs |
| SQLAlchemy 2.0 | ORM with asyncpg driver |
| Alembic | Database migrations |

### NLP / AI
| Technology | Purpose |
|---|---|
| PRAW | Reddit API wrapper |
| VADER (vaderSentiment) | Rule-based sentiment analysis |
| DistilBERT (HuggingFace) | Transformer-based classification |
| sentence-transformers | Semantic embeddings (all-MiniLM-L6-v2) |
| FAISS | Vector similarity search |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Query (TanStack) | Server state management |
| Recharts | Data visualization |
| Vite | Build tool |
| CSS Variables | Theming system |

### DevOps
| Technology | Purpose |
|---|---|
| GitHub Actions | CI/CD pipeline |
| Vercel | Frontend + serverless deployment |
| Neon.tech | Serverless PostgreSQL |
| Docker Compose | Local development |

---

## 📁 Project Structure

```
unipulse-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── institutions.py
│   │   │       ├── sentiments.py
│   │   │       ├── trends.py
│   │   │       ├── categories.py
│   │   │       ├── agents.py
│   │   │       └── chat.py
│   │   ├── models/
│   │   │   ├── institutions.py
│   │   │   ├── posts.py
│   │   │   ├── sentiment_results.py
│   │   │   └── aggregated_metrics.py
│   │   ├── nlp/
│   │   │   ├── preprocessor.py
│   │   │   ├── vader_analyzer.py
│   │   │   ├── bert_classifier.py
│   │   │   └── ensemble.py
│   │   ├── agents/
│   │   │   ├── agent_runner.py
│   │   │   ├── sentiment_agent.py
│   │   │   ├── trend_agent.py
│   │   │   └── improvement_agent.py
│   │   ├── rag/
│   │   │   ├── embedder.py
│   │   │   ├── faiss_index.py
│   │   │   └── chatbot.py
│   │   ├── scraper/
│   │   │   ├── reddit_client.py
│   │   │   ├── pipeline.py
│   │   │   └── category_classifier.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_nlp.py
│   │   ├── test_api.py
│   │   ├── test_agents.py
│   │   └── test_rag.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IITSelector.jsx
│   │   │   ├── SentimentGauge.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── CategoryMatrix.jsx
│   │   │   ├── LeaderboardCard.jsx
│   │   │   ├── AgentDashboard.jsx
│   │   │   └── ChatbotPanel.jsx
│   │   ├── hooks/
│   │   │   └── useWindowSize.js
│   │   ├── styles/
│   │   │   └── variables.css
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/
│       ├── pr-checks.yml
│       ├── staging-deploy.yml
│       └── production-deploy.yml
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 16
- Redis
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Virvivek007/unipulse-ai.git
cd unipulse-ai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up --build

# Backend  → http://localhost:8000
# Frontend → http://localhost:5173
# Docs     → http://localhost:8000/docs
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Reddit API Credentials
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=UniPulseAI/1.0

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/unipulse

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256

# HuggingFace (for DistilBERT)
HUGGINGFACE_TOKEN=your_token_here

# Environment
ENVIRONMENT=development
```

---

## 📡 API Endpoints

Base URL: `https://unipulse-sentiment-analysis.vercel.app/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/institutions` | List all 23 IITs |
| GET | `/sentiments/{iit_id}` | Aggregate sentiment for specific IIT |
| GET | `/sentiments/compare` | Multi-IIT comparative data |
| GET | `/trends/{iit_id}` | Time-series sentiment data |
| GET | `/categories/{iit_id}` | Category-wise sentiment breakdown |
| GET | `/chat` | RAG chatbot query |
| POST | `/agents/run` | Trigger agent analysis |
| POST | `/scrape/trigger` | Manual data refresh (admin) |

### Example Response
```json
GET /api/v1/sentiments/iit-patna

{
  "data": {
    "iit_id": "iit-patna",
    "name": "IIT Patna",
    "overall_score": 71,
    "sentiment_distribution": {
      "positive": 0.58,
      "neutral": 0.27,
      "negative": 0.15
    },
    "categories": {
      "academics": 0.54,
      "placements": 0.82,
      "hostel": 0.61,
      "campus_culture": 0.73,
      "health": 0.45,
      "administration": 0.38
    },
    "total_posts_analyzed": 1250
  },
  "meta": {
    "last_updated": "2026-05-31T00:00:00Z"
  },
  "error": null
}
```

---

## 🧠 Sentiment Analysis Engine

### How It Works

```
Raw Reddit Post
      ↓
Preprocessing (Unicode normalize, URL strip, tokenize)
      ↓
    ┌─────────────────────────────┐
    │   VADER (40% weight)        │
    │   Rule-based, <1ms          │
    │   compound score: -1 to +1  │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │   DistilBERT (60% weight)   │
    │   Transformer, 50-200ms     │
    │   softmax probabilities     │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │   Ensemble Score            │
    │   Final = VADER×0.4 +       │
    │           BERT×0.6          │
    │   argmax → LABEL            │
    └─────────────────────────────┘
```

### Thresholds
```python
if compound >= 0.05:   label = "POSITIVE"
elif compound <= -0.05: label = "NEGATIVE"
else:                   label = "NEUTRAL"
```

---

## 🤖 Agent System

Three specialized agents coordinated by `AgentRunner`:

```
AgentRunner (nightly via APScheduler)
      │
      ├──→ SentimentAgent
      │    Monitors scores, fires alerts on 10-point drops
      │
      ├──→ TrendAgent
      │    Detects cyclical patterns, anomalous spikes
      │
      └──→ ImprovementAgent
           Synthesizes actionable recommendations
```

Trigger manually:
```bash
POST /api/v1/agents/run
Authorization: Bearer <token>
```

---

## 💬 RAG Chatbot

Built with **FAISS + sentence-transformers:**

```
User Question
      ↓
Embed with all-MiniLM-L6-v2 (384-dim vector)
      ↓
FAISS nearest-neighbor search (top-k=5)
      ↓
Retrieve matching Reddit posts from PostgreSQL
      ↓
Assemble context prompt
      ↓
LLM generates grounded answer with citations
```

**Model specs:** all-MiniLM-L6-v2 — 80MB, ~2000 sentences/sec on CPU

---

## 📸 Dashboard Screenshots

| View | Description |
|---|---|
| Overview | IIT sentiment score, category breakdown |
| Trends | Weekly sentiment bar chart, leaderboard |
| Categories | Radar chart, category-wise scores |
| Feed | Live Reddit posts with NLP scores |
| Compare | Cross-IIT side-by-side comparison |

---

## 📊 Performance Metrics

| Metric | Value |
|---|---|
| Sentiment Classification Accuracy | **85%+** |
| API Response Time | **< 200ms** |
| Bundle Size Reduction | **~35%** (dynamic imports) |
| RAG Embedding Speed | **~2000 sentences/sec** |
| FAISS Retrieval Time | **< 1ms** |
| Deployment | **Zero-downtime** |

---

## 👥 Team

| Name | Role | Module |
|---|---|---|
| **Vivek Kumar Tiwari** | Data Engineer | Reddit API Integration & Scraping Pipeline |
| Ashish Kr Tiwari | ML Engineer | Sentiment Analysis Engine (VADER + DistilBERT) |
| Sumit Kr Thakur | Backend Developer | FastAPI + PostgreSQL Architecture |
| Shivam Kr Tiwari | Frontend Developer | React Dashboard + Recharts Visualizations |
| Ashutosh Kr Tripathi | DevOps Engineer | CI/CD Pipeline + Vercel Deployment |

**Institution:** IIT Patna — Hybrid UG Program in Computer Science & Data Analytics
**Roll No:** 2312res743 | **Group No:** 78 | **Submission:** May 31, 2026

---

## 🔮 Future Work

- [ ] Expand data sources to Twitter/X and Quora
- [ ] Add Hindi and Hinglish NLP support
- [ ] User authentication with personalized dashboards
- [ ] Replace keyword classifier with zero-shot classification model
- [ ] Add PlannerAgent for multi-step autonomous analysis
- [ ] Extend coverage to NITs and other premier institutions

---

## 📚 References

1. Hutto & Gilbert (2014) — VADER: A Parsimonious Rule-Based Model for Sentiment Analysis
2. Sanh et al. (2019) — DistilBERT: smaller, faster, cheaper and lighter
3. Devlin et al. (2019) — BERT: Pre-training of Deep Bidirectional Transformers
4. Reimers & Gurevych (2019) — Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks
5. Lewis et al. (2020) — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
6. Johnson et al. (2019) — Billion-scale similarity search with GPUs (FAISS)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>UniPulse AI</strong> — Built with ❤️ at IIT Patna
  <br>
  <a href="https://unipulse-sentiment-analysis.vercel.app">Live Demo</a> •
  <a href="https://github.com/Virvivek007">GitHub</a>
</div>
