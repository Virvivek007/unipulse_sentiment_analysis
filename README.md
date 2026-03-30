# 🎓 UniPulse AI — IIT Sentiment Analysis Platform

<div align="center">

![UniPulse AI](https://img.shields.io/badge/UniPulse-AI%20Powered-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-23%20IITs-FF6B6B?style=for-the-badge)
![Data Source](https://img.shields.io/badge/Data%20Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![NLP](https://img.shields.io/badge/NLP-Advanced-4CAF50?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A comprehensive sentiment analysis platform aggregating and analyzing student sentiments across all 23 Indian Institutes of Technology.**

[🚀 Live Demo](#) · [📖 Documentation](#documentation) · [🐛 Report Bug](https://github.com/Virvivek007/unipulse_sentiment_analysis/issues) · [✨ Request Feature](https://github.com/Virvivek007/unipulse_sentiment_analysis/issues)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Sentiment Categories](#-sentiment-categories)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About the Project

**UniPulse AI** is a comprehensive sentiment analysis platform designed to aggregate and analyze student sentiments across **23 Indian Institute of Technology (IIT)** communities. The platform leverages **Reddit** as a primary data source, employing advanced **Natural Language Processing (NLP)** and **Machine Learning (ML)** techniques to provide actionable insights into student experiences, concerns, and feedback.

Whether it's academics, placements, hostel life, or campus culture — UniPulse AI gives administrators, researchers, and students a real-time pulse on what matters most across India's premier engineering institutions.

> 💡 *"Data-driven decisions for a better campus experience."*

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Multi-IIT Aggregation** | Covers all 23 IITs — from IIT Bombay to IIT Dharwad |
| 📊 **Real-time Sentiment Dashboard** | Visual analytics with charts, heatmaps, and trend graphs |
| 🤖 **ML-Powered Analysis** | Advanced NLP models for context-aware sentiment classification |
| 💬 **Reddit Data Integration** | Automated scraping and processing of IIT subreddit communities |
| 📁 **Category-wise Breakdown** | Sentiments segmented across Academics, Placements, Hostel, Culture & more |
| 🕒 **Trend Tracking** | Track sentiment changes over time with historical data |
| 🌙 **Light/Dark Theme** | Beautiful, responsive UI with theme toggle support |
| 📱 **Mobile Responsive** | Fully optimized for all devices |

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

### Backend / AI
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![NLP](https://img.shields.io/badge/NLP-BERT%20%7C%20VADER-orange?style=flat-square)

### Data Source
![Reddit](https://img.shields.io/badge/Reddit%20API-FF4500?style=flat-square&logo=reddit&logoColor=white)
![PRAW](https://img.shields.io/badge/PRAW-Reddit%20Scraper-red?style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     UniPulse AI                         │
├──────────────┬──────────────────────┬───────────────────┤
│  Data Layer  │   Processing Layer   │  Presentation     │
│              │                      │  Layer            │
│  Reddit API  │  ┌────────────────┐  │                   │
│  (PRAW)      │  │ Text Cleaning  │  │  React Dashboard  │
│              │  │ Tokenization   │  │                   │
│  23 IIT      │  │ Sentiment Model│  │  Charts &         │
│  Subreddits  │  │ (BERT/VADER)   │  │  Analytics        │
│              │  │ Category       │  │                   │
│  Historical  │  │ Classification │  │  Theme Toggle     │
│  Data Store  │  └────────────────┘  │  Mobile View      │
└──────────────┴──────────────────────┴───────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **Python** 3.9 or higher
- **npm** or **yarn**
- A **Reddit Developer Account** with API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Virvivek007/unipulse_sentiment_analysis.git
   cd unipulse_sentiment_analysis
   ```

2. **Install frontend dependencies**
   ```bash
   cd unipulse-ai
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Reddit API Credentials
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=UniPulseAI/1.0

# App Config
VITE_API_BASE_URL=http://localhost:5000
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## 📖 Usage

1. Open the app in your browser at `http://localhost:5173`
2. Select one or multiple IITs from the sidebar or dropdown
3. Choose a sentiment **category** (Academics, Placements, etc.)
4. View the real-time **sentiment dashboard** with charts and insights
5. Toggle between **Light** and **Dark** theme using the theme switcher

---

## 📂 Sentiment Categories

UniPulse AI analyzes student sentiments across the following key areas:

| Category | Description |
|---|---|
| 📚 **Academics** | Course difficulty, professors, curriculum quality |
| 💼 **Placements** | Internships, job offers, company visits, preparation |
| 🏠 **Hostel & Facilities** | Dorms, mess food, cleanliness, infrastructure |
| 🎭 **Campus Culture** | Fests, clubs, social life, student activities |
| 🏥 **Health & Wellness** | Mental health, medical facilities, support services |
| 🌐 **Administration** | Policies, bureaucracy, faculty responsiveness |

---

## 📁 Project Structure

```
unipulse_sentiment_analysis/
├── unipulse-ai/               # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level views
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper utilities
│   │   └── styles/            # CSS stylesheets
│   └── package.json
│
├── .gitignore
├── PRD.md                     # Product Requirements Document
├── README.md                  # You are here!
├── THEME_IMPLEMENTATION_SUMMARY.md
├── UI_IMPROVEMENTS_SUMMARY.md
├── vercel.json                # Vercel deployment config
└── package-lock.json
```

---

## ☁️ Deployment

The project is deployed on **Vercel**. To deploy your own instance:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Add your environment variables in the **Vercel Dashboard** under *Project Settings → Environment Variables*.

Alternatively, connect your GitHub repository directly to Vercel for **automatic deployments** on every push to `main`.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

1. **Fork** the project
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

Please make sure your code follows the existing style and all tests pass before submitting.

---

## 🐛 Known Issues / Roadmap

- [ ] Add support for Twitter/X data as a secondary source
- [ ] Implement user authentication for personalized dashboards
- [ ] Add email/Slack alerts for sudden sentiment drops
- [ ] Expand to NITs and other premier institutions
- [ ] Multilingual sentiment analysis (Hindi support)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Virvivek007**

[![GitHub](https://img.shields.io/badge/GitHub-Virvivek007-181717?style=flat-square&logo=github)](https://github.com/Virvivek007)

---

<div align="center">

Made with ❤️ for the IIT Community

⭐ **Star this repo** if you found it useful!

</div>
