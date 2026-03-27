import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchAllIITs } from "../api";

const IIT_INFO = {
  "IITBHU": { full: "IIT BHU", color: "#eab308" },
  "IITBhubaneswar": { full: "IIT Bhubaneswar", color: "#3b82f6" },
  "IITBombay": { full: "IIT Bombay", color: "#f97316" },
  "IITDelhi": { full: "IIT Delhi", color: "#10b981" },
  "IITISM": { full: "IIT ISM", color: "#ec4899" },
  "IITGandhinagar": { full: "IIT Gandhinagar", color: "#8b5cf6" },
  "IITGoa": { full: "IIT Goa", color: "#06b6d4" },
  "IITGuwahati": { full: "IIT Guwahati", color: "#14b8a6" },
  "IITHyderabad": { full: "IIT Hyderabad", color: "#f59e0b" },
  "IITIndore": { full: "IIT Indore", color: "#6366f1" },
  "IITJammu": { full: "IIT Jammu", color: "#dc2626" },
  "IITJodhpur": { full: "IIT Jodhpur", color: "#f97316" },
  "IITK": { full: "IIT Kanpur", color: "#0ea5e9" },
  "IITKgp": { full: "IIT Kharagpur", color: "#f43f5e" },
  "IITMadras": { full: "IIT Madras", color: "#0ea5e9" },
  "IITMandi": { full: "IIT Mandi", color: "#22c55e" },
  "IITPalakkad": { full: "IIT Palakkad", color: "#a855f7" },
  "IITPatna": { full: "IIT Patna", color: "#a855f7" },
  "IITRoorkee": { full: "IIT Roorkee", color: "#14b8a6" },
  "IITRopar": { full: "IIT Ropar", color: "#f43f5e" },
  "IITTirupati": { full: "IIT Tirupati", color: "#10b981" },
  "IITBhilai": { full: "IIT Bhilai", color: "#f59e0b" },
  "IITDharwad": { full: "IIT Dharwad", color: "#06b6d4" },
};

const getColor = (score) => score >= 70 ? "#10b981" : score >= 55 ? "#f59e0b" : "#ef4444";

export default function Compare() {
  const [allIITs, setAllIITs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllIITs();
        setAllIITs(data);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sorted = [...allIITs].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    return a.iit.localeCompare(b.iit);
  });

  if (error) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#ef4444", background: "#0d1117", minHeight: "100vh" }}>
        <h3>⚠️ {error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#0d1117", minHeight: "100vh", color: "#c9d1d9" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ color: "#c9d1d9", margin: "0 0 8px 0", fontSize: 32 }}>
          Compare All IITs
        </h1>
        <div style={{ fontSize: 13, color: "#8b949e" }}>
          🏆 Reddit Sentiment Analysis across all {allIITs.length} IIT institutions
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>
          Loading all IIT data...
        </div>
      ) : (
        <>
          {/* Sort Controls */}
          <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
            <button
              onClick={() => setSortBy("score")}
              style={{
                background: sortBy === "score" ? "#58a6ff" : "#161b22",
                color: sortBy === "score" ? "#000" : "#c9d1d9",
                border: `1px solid ${sortBy === "score" ? "#58a6ff" : "#30363d"}`,
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Sort by Score
            </button>
            <button
              onClick={() => setSortBy("name")}
              style={{
                background: sortBy === "name" ? "#58a6ff" : "#161b22",
                color: sortBy === "name" ? "#000" : "#c9d1d9",
                border: `1px solid ${sortBy === "name" ? "#58a6ff" : "#30363d"}`,
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Sort by Name
            </button>
          </div>

          {/* Chart */}
          <div style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{ color: "#c9d1d9", margin: "0 0 20px 0", fontSize: 14 }}>SENTIMENT SCORES</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sorted}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="iit" angle={-45} textAnchor="end" height={100} tick={{ fill: "#8b949e", fontSize: 10 }} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#161b22", border: "1px solid #30363d", color: "#c9d1d9" }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {sorted.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={getColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
            {sorted.map((iit, idx) => {
              const info = IIT_INFO[iit.iit] || { full: iit.iit };
              const color = getColor(iit.score);
              return (
                <div key={iit.iit} style={{
                  background: "#161b22",
                  border: `1px solid ${color}40`,
                  borderTop: `4px solid ${color}`,
                  borderRadius: 10,
                  padding: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9" }}>
                        #{idx + 1}
                      </div>
                      <div style={{ fontSize: 12, color: "#8b949e" }}>RANK</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color }}>
                        {iit.score}
                      </div>
                      <div style={{ fontSize: 10, color: "#8b949e" }}>SCORE</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #21262d" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#c9d1d9", marginBottom: 4 }}>
                      {info.full}
                    </div>
                    <div style={{ fontSize: 11, color: "#8b949e" }}>
                      {iit.posts} posts analyzed
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ flex: 1, height: 4, background: "#21262d", borderRadius: 2, marginRight: 8 }}>
                      <div style={{
                        height: "100%",
                        width: `${iit.score}%`,
                        background: color,
                        borderRadius: 2,
                      }} />
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: iit.score >= 70 ? "#10b981" : iit.score >= 55 ? "#f59e0b" : "#ef4444",
                    }}>
                      {iit.score >= 70 ? "✅" : iit.score >= 55 ? "😐" : "⚠️"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
