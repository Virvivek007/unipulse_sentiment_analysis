import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchIITSentiment } from "../api";
import PostFeed from "../components/PostFeed";

const IIT_LIST = [
  "IITBHU", "IITBhubaneswar", "IITBombay", "IITDelhi", "IITISM",
  "IITGandhinagar", "IITGoa", "IITGuwahati", "IITHyderabad", "IITIndore",
  "IITJammu", "IITJodhpur", "IITK", "IITKgp", "IITMadras",
  "IITMandi", "IITPalakkad", "IITPatna", "IITRoorkee", "IITRopar",
  "IITTirupati", "IITBhilai", "IITDharwad"
];

const IIT_INFO = {
  "IITBHU": { full: "IIT BHU", location: "Varanasi, UP", founded: 1919, color: "#eab308" },
  "IITBhubaneswar": { full: "IIT Bhubaneswar", location: "Bhubaneswar, OD", founded: 2008, color: "#3b82f6" },
  "IITBombay": { full: "IIT Bombay", location: "Mumbai, MH", founded: 1958, color: "#f97316" },
  "IITDelhi": { full: "IIT Delhi", location: "New Delhi", founded: 1961, color: "#10b981" },
  "IITISM": { full: "IIT ISM", location: "Dhanbad, JH", founded: 1926, color: "#ec4899" },
  "IITGandhinagar": { full: "IIT Gandhinagar", location: "Gandhinagar, GJ", founded: 2007, color: "#8b5cf6" },
  "IITGoa": { full: "IIT Goa", location: "Goa", founded: 2016, color: "#06b6d4" },
  "IITGuwahati": { full: "IIT Guwahati", location: "Guwahati, AS", founded: 1994, color: "#14b8a6" },
  "IITHyderabad": { full: "IIT Hyderabad", location: "Hyderabad, TG", founded: 2008, color: "#f59e0b" },
  "IITIndore": { full: "IIT Indore", location: "Indore, MP", founded: 2009, color: "#6366f1" },
  "IITJammu": { full: "IIT Jammu", location: "Jammu, JK", founded: 2016, color: "#dc2626" },
  "IITJodhpur": { full: "IIT Jodhpur", location: "Jodhpur, RJ", founded: 2008, color: "#f97316" },
  "IITK": { full: "IIT Kanpur", location: "Kanpur, UP", founded: 1959, color: "#0ea5e9" },
  "IITKgp": { full: "IIT Kharagpur", location: "Kharagpur, WB", founded: 1951, color: "#f43f5e" },
  "IITMadras": { full: "IIT Madras", location: "Chennai, TN", founded: 1959, color: "#0ea5e9" },
  "IITMandi": { full: "IIT Mandi", location: "Mandi, HP", founded: 2009, color: "#22c55e" },
  "IITPalakkad": { full: "IIT Palakkad", location: "Palakkad, KL", founded: 2015, color: "#a855f7" },
  "IITPatna": { full: "IIT Patna", location: "Patna, BR", founded: 2008, color: "#a855f7" },
  "IITRoorkee": { full: "IIT Roorkee", location: "Roorkee, UK", founded: 1854, color: "#14b8a6" },
  "IITRopar": { full: "IIT Ropar", location: "Rupnagar, PB", founded: 2008, color: "#f43f5e" },
  "IITTirupati": { full: "IIT Tirupati", location: "Tirupati, AP", founded: 2015, color: "#10b981" },
  "IITBhilai": { full: "IIT Bhilai", location: "Bhilai, CG", founded: 2016, color: "#f59e0b" },
  "IITDharwad": { full: "IIT Dharwad", location: "Dharwad, KA", founded: 2016, color: "#06b6d4" },
};

const getColor = (score) => score >= 70 ? "#10b981" : score >= 55 ? "#f59e0b" : "#ef4444";
const getSentimentLabel = (score) => score >= 70 ? "positive" : score >= 55 ? "neutral" : "negative";

export default function Dashboard() {
  const [selected, setSelected] = useState("IITBombay");
  const [iitData, setIitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchIITSentiment(selected);
        setIitData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Make sure backend is running on localhost:8000");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selected]);

  if (error) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#ef4444", background: "#0d1117", minHeight: "100vh" }}>
        <h3>⚠️ {error}</h3>
        <p style={{ marginTop: 10, fontSize: 14, color: "#8b949e" }}>Run: <code>python -m uvicorn main:app --reload</code> in backend folder</p>
      </div>
    );
  }

  const info = IIT_INFO[selected] || {};
  const color = info.color || "#8b5cf6";

  return (
    <div style={{ padding: "20px", background: "#0d1117", minHeight: "100vh", color: "#c9d1d9" }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ color: "#c9d1d9", margin: "0 0 8px 0", fontSize: 32 }}>
          {info.full || selected}
        </h1>
        <div style={{ fontSize: 13, color: "#8b949e" }}>
          📍 {info.location || "India"} • Founded {info.founded} • {iitData?.total_posts || 0} posts analyzed
        </div>
      </div>

      {/* ── IIT SELECTOR ── */}
      <div style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {IIT_LIST.map(iit => (
          <button
            key={iit}
            onClick={() => setSelected(iit)}
            style={{
              background: selected === iit ? IIT_INFO[iit].color : "#161b22",
              border: `1px solid ${selected === iit ? IIT_INFO[iit].color : "#30363d"}`,
              color: selected === iit ? "#000" : "#c9d1d9",
              padding: "8px 14px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            {iit}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>
          Loading {selected} data...
        </div>
      ) : iitData ? (
        <>
          {/* ── OVERALL SENTIMENT ── */}
          <div style={{
            background: "#161b22",
            border: `2px solid ${color}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1 }}>
                  Overall Sentiment
                </div>
                <div style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: getColor(iitData.overall),
                  margin: "12px 0",
                }}>
                  {iitData.overall}/100
                </div>
                <div style={{ fontSize: 13, color: "#8b949e" }}>
                  {getSentimentLabel(iitData.overall).toUpperCase()}
                </div>
              </div>
              <div style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: `${color}20`,
                border: `2px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 64,
              }}>
                {iitData.overall >= 70 ? "😊" : iitData.overall >= 55 ? "😐" : "😞"}
              </div>
            </div>
          </div>

          {/* ── CATEGORY BREAKDOWN ── */}
          <div style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{ color: "#c9d1d9", margin: "0 0 20px 0", fontSize: 14 }}>CATEGORY SENTIMENT</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={iitData.categories || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 12 }} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#161b22", border: "1px solid #30363d", color: "#c9d1d9" }} />
                <Bar dataKey="score" fill={color} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── CATEGORY CARDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {iitData.categories?.map(cat => (
              <div key={cat.name} style={{
                background: "#161b22",
                border: `1px solid ${getColor(cat.score)}40`,
                borderLeft: `4px solid ${getColor(cat.score)}`,
                borderRadius: 10,
                padding: 16,
              }}>
                <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 8 }}>{cat.name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: getColor(cat.score), marginBottom: 8 }}>
                  {cat.score}/100
                </div>
                <div style={{ fontSize: 11, color: "#8b949e" }}>
                  {cat.posts || 0} posts
                </div>
              </div>
            ))}
          </div>

          {/* ── TOP POSTS ── */}
          <div style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: 24,
          }}>
            <h3 style={{ color: "#c9d1d9", margin: "0 0 20px 0", fontSize: 14 }}>TOP SENTIMENT POSTS</h3>
            <PostFeed posts={iitData.top_posts?.map(p => ({
              ...p,
              label: p.compound > 0.5 ? "positive" : p.compound < -0.5 ? "negative" : "neutral",
              subreddit: p.subreddit || selected,
              title: p.title,
            })) || []} />
          </div>
        </>
      ) : null}
    </div>
  );
}
