import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import PostFeed from "../components/PostFeed";
import { fetchIITSentiment } from "../api";

// ─── Constants ────────────────────────────────────────────────────────────────

const IIT_LIST = [
  "IITBHU", "IITBhubaneswar", "IITBombay", "IITDelhi", "IITISM",
  "IITGandhinagar", "IITGoa", "IITGuwahati", "IITHyderabad", "IITIndore",
  "IITJammu", "IITJodhpur", "IITK", "IITKgp", "IITMadras",
  "IITMandi", "IITPalakkad", "IITPatna", "IITRoorkee", "IITRopar",
  "IITTirupati", "IITBhilai", "IITDharwad",
];

const CATEGORIES = [
  "All", "Academics", "Placements", "Hostel Life",
  "Fests & Culture", "Mental Health", "Infrastructure", "Administration", "General",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSentimentLabel = (score) =>
  score >= 70 ? "POSITIVE" : score >= 55 ? "NEUTRAL" : "NEGATIVE";

const getSentimentEmoji = (score) =>
  score >= 70 ? "😊" : score >= 55 ? "😐" : "😟";

const getSentimentBorder = (score) =>
  score >= 70
    ? "1px solid rgba(0,212,255,0.55)"
    : score >= 55
    ? "1px solid rgba(255,59,122,0.55)"
    : "1px solid rgba(255,77,77,0.55)";

const getSentimentGlow = (score) =>
  score >= 70
    ? "0 0 0 1px rgba(0,212,255,0.4), inset 0 0 40px rgba(0,212,255,0.04)"
    : score >= 55
    ? "0 0 0 1px rgba(255,59,122,0.4), inset 0 0 40px rgba(255,59,122,0.04)"
    : "0 0 0 1px rgba(255,77,77,0.4), inset 0 0 40px rgba(255,77,77,0.04)";

const getEmojiRingColor = (score) =>
  score >= 70 ? "#00d4ff" : score >= 55 ? "#ff3b7a" : "#ff4d4d";

const getCategoryColor = (score) =>
  score >= 70 ? "#00d4ff" : score >= 55 ? "#f5a623" : "#ff3b7a";

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  // Main content — no page wrapper, no navbar
  main: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "28px 32px",
  },

  // IIT Selector
  selectorWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: (active) => ({
    fontSize: 13,
    fontWeight: 500,
    padding: "7px 16px",
    borderRadius: 50,
    border: active ? "1px solid transparent" : "1px solid #2a2d3e",
    background: active
      ? "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)"
      : "#1a1d2e",
    color: active ? "#fff" : "#8b91b0",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    boxShadow: active ? "0 0 16px rgba(0,180,216,0.3)" : "none",
    fontFamily: "'Inter', sans-serif",
  }),

  // Category select row
  selectRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555a78",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  select: {
    fontSize: 13,
    fontWeight: 500,
    background: "#1a1d2e",
    color: "#e8eaf6",
    border: "1px solid #2a2d3e",
    padding: "9px 36px 9px 14px",
    borderRadius: 8,
    outline: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    minWidth: 180,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238b91b0' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
  },

  // Sentiment hero card
  heroCard: (score) => ({
    background: "#1a1d2e",
    border: getSentimentBorder(score),
    borderRadius: 16,
    padding: "32px 40px",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: getSentimentGlow(score),
  }),
  heroLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#555a78",
    marginBottom: 10,
  },
  heroScore: {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    fontSize: 72,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-3px",
    color: "#f5a623",
    marginBottom: 10,
    display: "block",
  },
  heroWord: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#555a78",
  },
  emojiRing: (score) => ({
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: `2px solid ${getEmojiRingColor(score)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 54,
    flexShrink: 0,
    background: "rgba(0,0,0,0.25)",
    boxShadow: `0 0 24px ${getEmojiRingColor(score)}40`,
  }),

  // Chart card
  chartCard: {
    background: "#1a1d2e",
    border: "1px solid #1e2235",
    borderRadius: 16,
    padding: "24px 28px",
    marginBottom: 24,
  },
  chartTitle: {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: "#555a78",
    marginBottom: 20,
  },

  // Category grid
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: (score) => ({
    background: "#1a1d2e",
    border: "1px solid #1e2235",
    borderLeft: `3px solid ${getCategoryColor(score)}`,
    borderRadius: 12,
    padding: "20px 22px",
    transition: "all 0.2s ease",
    cursor: "default",
  }),
  categoryName: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#555a78",
    marginBottom: 10,
  },
  categoryScore: (score) => ({
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-1.5px",
    color: getCategoryColor(score),
    marginBottom: 6,
    display: "block",
  }),
  categoryPosts: {
    fontSize: 11,
    color: "#555a78",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  // Post feed panel
  feedCard: {
    background: "#1a1d2e",
    border: "1px solid #1e2235",
    borderRadius: 16,
    padding: "24px 28px",
  },
  feedTitle: {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 16,
  },

  // Loading / error
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: 14,
    color: "#555a78",
    letterSpacing: "0.05em",
  },
  errorState: {
    textAlign: "center",
    padding: "40px",
    fontSize: 14,
    color: "#ff4d4d",
    background: "rgba(255,77,77,0.06)",
    border: "1px solid rgba(255,77,77,0.2)",
    borderRadius: 12,
    margin: "20px 0",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selected, setSelected] = useState("IITBombay");
  const [category, setCategory] = useState("All");
  const [iitData, setIitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchIITSentiment(selected, category);
        const posts = Array.isArray(response?.data) ? response.data : [];
        const totalPosts = response?.count ?? posts.length;

        const avgScore =
          posts.reduce((sum, p) => sum + (Number(p.score) || 0), 0) /
          (posts.length || 1);
        const overall = Math.round((avgScore + 1) * 50);

        const catMap = {};
        posts.forEach((p) => {
          const cat = p.category || "General";
          if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
          catMap[cat].total += Number(p.score) || 0;
          catMap[cat].count += 1;
        });

        const categories = Object.keys(catMap).map((name) => {
          const avg = catMap[name].total / catMap[name].count;
          return {
            name,
            score: Math.round((avg + 1) * 50),
            posts: catMap[name].count,
          };
        });

        setIitData({ overall, categories, top_posts: posts.slice(0, 10), total_posts: totalPosts });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selected, category]);

  return (
    <main style={S.main}>

      {/* ── IIT Selector ── */}
      <div style={S.selectorWrap}>
        {IIT_LIST.map((iit) => (
          <button
            key={iit}
            onClick={() => setSelected(iit)}
            style={S.chip(selected === iit)}
          >
            {iit}
          </button>
        ))}
      </div>

      {/* ── Category Filter ── */}
      <div style={S.selectRow}>
        <span style={S.selectLabel}>Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={S.select}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* ── Error ── */}
      {error && <div style={S.errorState}>{error}</div>}

      {/* ── Loading ── */}
      {!error && loading && (
        <div style={S.emptyState}>Loading sentiment data...</div>
      )}

      {/* ── Data ── */}
      {!error && !loading && iitData && (
        <>
          {/* Overall Sentiment Hero */}
          <div style={S.heroCard(iitData.overall)}>
            <div>
              <div style={S.heroLabel}>Overall Sentiment</div>
              <span style={S.heroScore}>
                {iitData.overall}/100
              </span>
              <div style={S.heroWord}>{getSentimentLabel(iitData.overall)}</div>
            </div>
            <div style={S.emojiRing(iitData.overall)}>
              {getSentimentEmoji(iitData.overall)}
            </div>
          </div>

          {/* Category Sentiment Chart */}
          <div style={S.chartCard}>
            <div style={S.chartTitle}>Category Sentiment</div>
            <div style={S.chartSubtitle}>
              {category === "All" ? "All topics" : category}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={iitData.categories} barCategoryGap="35%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#555a78", fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#555a78", fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#13151f",
                    border: "1px solid #2a2d3e",
                    borderRadius: 10,
                    color: "#e8eaf6",
                    fontSize: 12,
                    fontFamily: "Inter",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="score" fill="#00d4ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Cards Grid */}
          <div style={S.categoryGrid}>
            {iitData.categories.map((cat) => (
              <div key={cat.name} style={S.categoryCard(cat.score)}>
                <div style={S.categoryName}>{cat.name}</div>
                <span style={S.categoryScore(cat.score)}>
                  {cat.score}/100
                </span>
                <div style={S.categoryPosts}>
                  📄 {cat.posts} posts
                </div>
              </div>
            ))}
          </div>

          {/* Top Posts Feed */}
          <div style={S.feedCard}>
            <div style={S.feedTitle}>Top Sentiment Posts</div>
            <PostFeed
              posts={iitData.top_posts.map((post) => ({
                title: post.text,
                label: post.sentiment,
                compound: Number(post.score) || 0,
                subreddit: post.category || "general",
                score: Math.round(((Number(post.score) || 0) + 1) * 50),
                comments: 0,
              }))}
            />
          </div>
        </>
      )}

      {/* ── No Data ── */}
      {!error && !loading && !iitData && (
        <div style={S.emptyState}>No data available.</div>
      )}
    </main>
  );
}