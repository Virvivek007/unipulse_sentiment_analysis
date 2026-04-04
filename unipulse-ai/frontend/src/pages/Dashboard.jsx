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

const IIT_INFO = {
  IITBHU:         { full: "IIT BHU",         location: "Varanasi, UP",     founded: 1919 },
  IITBhubaneswar: { full: "IIT Bhubaneswar", location: "Bhubaneswar, OD",  founded: 2008 },
  IITBombay:      { full: "IIT Bombay",       location: "Mumbai, MH",       founded: 1958 },
  IITDelhi:       { full: "IIT Delhi",        location: "New Delhi",        founded: 1961 },
  IITISM:         { full: "IIT ISM",          location: "Dhanbad, JH",      founded: 1926 },
  IITGandhinagar: { full: "IIT Gandhinagar",  location: "Gandhinagar, GJ",  founded: 2007 },
  IITGoa:         { full: "IIT Goa",          location: "Goa",              founded: 2016 },
  IITGuwahati:    { full: "IIT Guwahati",     location: "Guwahati, AS",     founded: 1994 },
  IITHyderabad:   { full: "IIT Hyderabad",    location: "Hyderabad, TG",    founded: 2008 },
  IITIndore:      { full: "IIT Indore",       location: "Indore, MP",       founded: 2009 },
  IITJammu:       { full: "IIT Jammu",        location: "Jammu, JK",        founded: 2016 },
  IITJodhpur:     { full: "IIT Jodhpur",      location: "Jodhpur, RJ",      founded: 2008 },
  IITK:           { full: "IIT Kanpur",       location: "Kanpur, UP",       founded: 1959 },
  IITKgp:         { full: "IIT Kharagpur",    location: "Kharagpur, WB",    founded: 1951 },
  IITMadras:      { full: "IIT Madras",       location: "Chennai, TN",      founded: 1959 },
  IITMandi:       { full: "IIT Mandi",        location: "Mandi, HP",        founded: 2009 },
  IITPalakkad:    { full: "IIT Palakkad",     location: "Palakkad, KL",     founded: 2015 },
  IITPatna:       { full: "IIT Patna",        location: "Patna, BR",        founded: 2008 },
  IITRoorkee:     { full: "IIT Roorkee",      location: "Roorkee, UK",      founded: 1854 },
  IITRopar:       { full: "IIT Ropar",        location: "Rupnagar, PB",     founded: 2008 },
  IITTirupati:    { full: "IIT Tirupati",     location: "Tirupati, AP",     founded: 2015 },
  IITBhilai:      { full: "IIT Bhilai",       location: "Bhilai, CG",       founded: 2016 },
  IITDharwad:     { full: "IIT Dharwad",      location: "Dharwad, KA",      founded: 2016 },
};

const CATEGORIES = [
  "All", "Academics", "Placements", "Hostel Life",
  "Fests & Culture", "Mental Health", "Infrastructure", "Administration", "General",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSentimentColor = (score) =>
  score >= 70 ? "#00d4ff" : score >= 55 ? "#f5a623" : "#ff3b7a";

const getSentimentLabel = (score) =>
  score >= 70 ? "POSITIVE" : score >= 55 ? "NEUTRAL" : "NEGATIVE";

const getSentimentEmoji = (score) =>
  score >= 70 ? "😊" : score >= 55 ? "😐" : "😟";

const getBorderColor = (score) =>
  score >= 70
    ? "rgba(0,212,255,0.55)"
    : score >= 55
    ? "rgba(255,59,122,0.55)"
    : "rgba(255,77,77,0.55)";

const getGlow = (score) =>
  score >= 70
    ? "0 0 0 1px rgba(0,212,255,0.3), inset 0 0 40px rgba(0,212,255,0.04)"
    : score >= 55
    ? "0 0 0 1px rgba(255,59,122,0.3), inset 0 0 40px rgba(255,59,122,0.04)"
    : "0 0 0 1px rgba(255,77,77,0.3), inset 0 0 40px rgba(255,77,77,0.04)";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selected, setSelected] = useState("IITBombay");
  const [category, setCategory] = useState("All");
  const [iitData,  setIitData]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchIITSentiment(selected, category);
        const posts      = Array.isArray(response?.data) ? response.data : [];
        const totalPosts = response?.count ?? posts.length;

        // compound scores are -1 to 1 → normalize to 0-100
        const avgScore =
          posts.reduce((sum, p) => sum + (Number(p.score) || 0), 0) /
          (posts.length || 1);
        const overall = Math.round((avgScore + 1) * 50);

        // Build category breakdown
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

        setIitData({
          overall,
          categories,
          top_posts:   posts.slice(0, 10),
          total_posts: totalPosts,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selected, category]); // ✅ both deps

  const info  = IIT_INFO[selected] || {};

  return (
    <main style={{
      maxWidth: 1400,
      margin: "0 auto",
      padding: "28px 32px",
      fontFamily: "'Inter', sans-serif",
      color: "#e8eaf6",
    }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 32, fontWeight: 800,
          color: "#fff", letterSpacing: "-0.5px", marginBottom: 6,
        }}>
          {info.full || selected}
        </h1>
        <div style={{ fontSize: 13, color: "#555a78" }}>
          📍 {info.location || "India"} • Founded {info.founded} •{" "}
          <span style={{ color: "#8b91b0" }}>{iitData?.total_posts ?? 0} posts analyzed</span>
        </div>
      </div>

      {/* ── IIT Selector ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {IIT_LIST.map((iit) => {
          const active = selected === iit;
          return (
            <button
              key={iit}
              onClick={() => setSelected(iit)}
              style={{
                fontSize: 13, fontWeight: 500,
                padding: "7px 16px", borderRadius: 50,
                border: active ? "1px solid transparent" : "1px solid #2a2d3e",
                background: active
                  ? "linear-gradient(135deg, #00b4d8, #0077b6)"
                  : "#1a1d2e",
                color: active ? "#fff" : "#8b91b0",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                boxShadow: active ? "0 0 14px rgba(0,180,216,0.3)" : "none",
              }}
            >
              {iit}
            </button>
          );
        })}
      </div>

      {/* ── Category Filter ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "#555a78",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            fontSize: 13, fontWeight: 500,
            background: "#1a1d2e", color: "#e8eaf6",
            border: "1px solid #2a2d3e",
            padding: "9px 36px 9px 14px", borderRadius: 8,
            outline: "none", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            minWidth: 180, appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238b91b0' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          textAlign: "center", padding: 32, fontSize: 14, color: "#ff4d4d",
          background: "rgba(255,77,77,0.06)",
          border: "1px solid rgba(255,77,77,0.2)",
          borderRadius: 12, marginBottom: 24,
        }}>
          ⚠️ {error}
          <p style={{ marginTop: 8, fontSize: 12, color: "#8b91b0" }}>
            Run: <code>py -m uvicorn api:app --reload --port 8000</code> in backend folder
          </p>
        </div>
      )}

      {/* ── Loading ── */}
      {!error && loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 14, color: "#555a78" }}>
          Loading {selected} data...
        </div>
      )}

      {/* ── Data ── */}
      {!error && !loading && iitData && (
        <>
          {/* Overall Sentiment Hero */}
          <div style={{
            background: "#1a1d2e",
            border: `1px solid ${getBorderColor(iitData.overall)}`,
            borderRadius: 16,
            padding: "32px 40px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: getGlow(iitData.overall),
          }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#555a78", marginBottom: 10,
              }}>Overall Sentiment</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 72, fontWeight: 800, lineHeight: 1,
                letterSpacing: "-3px", color: "#f5a623", marginBottom: 10,
              }}>
                {iitData.overall}/100
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#555a78",
              }}>
                {getSentimentLabel(iitData.overall)}
              </div>
            </div>
            <div style={{
              width: 110, height: 110, borderRadius: "50%",
              border: `2px solid ${getSentimentColor(iitData.overall)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 54, background: "rgba(0,0,0,0.25)",
              boxShadow: `0 0 24px ${getSentimentColor(iitData.overall)}40`,
            }}>
              {getSentimentEmoji(iitData.overall)}
            </div>
          </div>

          {/* Category Sentiment Chart */}
          <div style={{
            background: "#1a1d2e", border: "1px solid #1e2235",
            borderRadius: 16, padding: "24px 28px", marginBottom: 24,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4,
            }}>Category Sentiment</div>
            <div style={{ fontSize: 12, color: "#555a78", marginBottom: 20 }}>
              {category === "All" ? "All topics" : category}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={iitData.categories} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#555a78", fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#555a78", fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false} tickLine={false} domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#13151f", border: "1px solid #2a2d3e",
                    borderRadius: 10, color: "#e8eaf6",
                    fontSize: 12, fontFamily: "Inter",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="score" fill="#00d4ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12, marginBottom: 24,
          }}>
            {iitData.categories.map((cat) => {
              const c = getSentimentColor(cat.score);
              return (
                <div key={cat.name} style={{
                  background: "#1a1d2e",
                  border: "1px solid #1e2235",
                  borderLeft: `3px solid ${c}`,
                  borderRadius: 12, padding: "20px 22px",
                  transition: "all 0.2s ease",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "#555a78", marginBottom: 10,
                  }}>{cat.name}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 38, fontWeight: 800, lineHeight: 1,
                    letterSpacing: "-1.5px", color: c, marginBottom: 6,
                  }}>{cat.score}/100</div>
                  <div style={{ fontSize: 11, color: "#555a78" }}>
                    📄 {cat.posts} posts
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Posts Feed */}
          <div style={{
            background: "#1a1d2e", border: "1px solid #1e2235",
            borderRadius: 16, padding: "24px 28px",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16,
            }}>Top Sentiment Posts</div>
            <PostFeed
              posts={iitData.top_posts.map((p) => ({
                ...p,
                title:     p.text      || p.title || "",   // ✅ sentiments table uses "text"
                label:     p.sentiment || p.label || "neutral", // ✅ sentiments table uses "sentiment"
                compound:  Number(p.score) || 0,
                subreddit: p.category  || selected,
                score:     Math.round((Number(p.score) + 1) * 50),
              }))}
            />
          </div>
        </>
      )}

      {/* ── No Data ── */}
      {!error && !loading && !iitData && (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 14, color: "#555a78" }}>
          No data available for {selected}.
        </div>
      )}
    </main>
  );
}