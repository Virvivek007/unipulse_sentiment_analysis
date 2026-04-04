import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { fetchAllIITs } from "../api";

const IIT_INFO = {
  IITBHU:         { full: "IIT BHU" },
  IITBhubaneswar: { full: "IIT Bhubaneswar" },
  IITBombay:      { full: "IIT Bombay" },
  IITDelhi:       { full: "IIT Delhi" },
  IITISM:         { full: "IIT ISM" },
  IITGandhinagar: { full: "IIT Gandhinagar" },
  IITGoa:         { full: "IIT Goa" },
  IITGuwahati:    { full: "IIT Guwahati" },
  IITHyderabad:   { full: "IIT Hyderabad" },
  IITIndore:      { full: "IIT Indore" },
  IITJammu:       { full: "IIT Jammu" },
  IITJodhpur:     { full: "IIT Jodhpur" },
  IITK:           { full: "IIT Kanpur" },
  IITKgp:         { full: "IIT Kharagpur" },
  IITMadras:      { full: "IIT Madras" },
  IITMandi:       { full: "IIT Mandi" },
  IITPalakkad:    { full: "IIT Palakkad" },
  IITPatna:       { full: "IIT Patna" },
  IITRoorkee:     { full: "IIT Roorkee" },
  IITRopar:       { full: "IIT Ropar" },
  IITTirupati:    { full: "IIT Tirupati" },
  IITBhilai:      { full: "IIT Bhilai" },
  IITDharwad:     { full: "IIT Dharwad" },
};

const getColor = (s) => s >= 70 ? "#00d4ff" : s >= 55 ? "#f5a623" : "#ff3b7a";
const getLabel = (s) => s >= 70 ? "Strong"   : s >= 55 ? "Mixed"   : "Weak";

const CATEGORIES = [
  "All","Academics","Placements","Hostel Life",
  "Fests & Culture","Mental Health","Infrastructure","Administration","General",
];

export default function Compare() {
  const [allIITs,  setAllIITs]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [sortBy,   setSortBy]   = useState("score");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAllIITs(category);
        setAllIITs(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  const sorted = [...allIITs].sort((a, b) =>
    sortBy === "score" ? b.score - a.score : a.iit.localeCompare(b.iit)
  );

  return (
    <main style={{
      width: "100%",
      padding: "28px 20px",
      fontFamily: "'Inter', sans-serif",
      color: "#e8eaf6",
      boxSizing: "border-box",
    }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#555a78", marginBottom: 6,
        }}>Compare</div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 30,
          fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 6,
        }}>
          Rank every IIT at a glance
        </h1>
        <p style={{ fontSize: 13, color: "#8b91b0", marginBottom: 12 }}>
          High-contrast ranking board built to separate leaders from laggards fast.
        </p>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#555a78" }}>
            <span style={{ fontWeight: 800, color: "#fff", fontSize: 18 }}>{allIITs.length}</span>
            {" "}Institutions
          </span>
          <span style={{ fontSize: 12, color: "#555a78" }}>Live sentiment rankings</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["score", "name"].map((s) => (
          <button key={s} onClick={() => setSortBy(s)} style={{
            fontSize: 13, fontWeight: 500, padding: "7px 18px", borderRadius: 8,
            cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Inter', sans-serif",
            background: sortBy === s ? "#1a1d2e" : "transparent",
            border: sortBy === s ? "1px solid #3a3d52" : "1px solid #2a2d3e",
            color: sortBy === s ? "#fff" : "#8b91b0",
          }}>
            Sort by {s === "score" ? "Score" : "Name"}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#555a78", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              fontSize: 13, fontWeight: 500, background: "#1a1d2e", color: "#e8eaf6",
              border: "1px solid #2a2d3e", padding: "8px 34px 8px 14px", borderRadius: 8,
              outline: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              minWidth: 170, appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238b91b0' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          textAlign: "center", padding: 32, fontSize: 14, color: "#ff4d4d",
          background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.2)",
          borderRadius: 12, marginBottom: 20,
        }}>⚠️ {error}</div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 14, color: "#555a78" }}>
          Loading all IIT rankings...
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Bar Chart ── */}
          <div style={{
            background: "#1a1d2e", border: "1px solid #1e2235",
            borderRadius: 16, padding: "24px 28px", marginBottom: 24,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 18,
              fontWeight: 700, color: "#fff", marginBottom: 3,
            }}>
              Sentiment Scoreboard {category !== "All" ? `— ${category}` : ""}
            </div>
            <div style={{ fontSize: 12, color: "#555a78", marginBottom: 20 }}>
              All {sorted.length} IITs ranked by sentiment score
            </div>
            <ResponsiveContainer width="100%" height={460}>
              <BarChart data={sorted} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="iit" angle={-40} textAnchor="end" height={100}
                  tick={{ fill: "#555a78", fontSize: 10, fontFamily: "Inter" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#555a78", fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false} tickLine={false} domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#13151f", border: "1px solid #2a2d3e",
                    borderRadius: 10, color: "#e8eaf6", fontSize: 12, fontFamily: "Inter",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {sorted.map((entry, idx) => (
                    <Cell key={idx} fill={getColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── 4-Column Rectangular Card Grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            width: "100%",
          }}>
            {sorted.map((iit, idx) => {
              const info  = IIT_INFO[iit.iit] || { full: iit.iit };
              const color = getColor(iit.score);

              return (
                <div
                  key={iit.iit}
                  style={{
                    background: "#1a1d2e",
                    border: `1px solid ${color}33`,
                    borderTop: `3px solid ${color}`,
                    borderRadius: 14,
                    /* Golden-ratio-ish rectangle: wider than tall */
                    padding: "20px 22px 18px",
                    height: 210,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                    cursor: "default",
                    boxSizing: "border-box",
                    minWidth: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 16px 40px ${color}22`;
                    e.currentTarget.style.background = "#1f2235";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#1a1d2e";
                  }}
                >
                  {/* ── Top: Rank + Score ── */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "clamp(20px, 2vw, 28px)",
                        fontWeight: 800, color, lineHeight: 1,
                      }}>#{idx + 1}</div>
                      <div style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                        textTransform: "uppercase", color: "#555a78", marginTop: 3,
                      }}>RANK</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "clamp(20px, 2vw, 28px)",
                        fontWeight: 800, color, lineHeight: 1,
                      }}>{iit.score}</div>
                      <div style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                        textTransform: "uppercase", color: "#555a78", marginTop: 3,
                      }}>SCORE</div>
                    </div>
                  </div>

                  {/* ── Middle: Name + Posts ── */}
                  <div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(13px, 1.1vw, 16px)",
                      fontWeight: 700, color: "#fff",
                      marginBottom: 4, lineHeight: 1.3,
                    }}>{info.full}</div>
                    <div style={{ fontSize: 11, color: "#555a78" }}>
                      {iit.posts} posts analyzed
                    </div>
                  </div>

                  {/* ── Bottom: Progress + Badge ── */}
                  <div>
                    <div style={{
                      height: 3, background: "#2a2d3e",
                      borderRadius: 2, marginBottom: 10, overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${iit.score}%`, borderRadius: 2,
                        background: `linear-gradient(90deg, ${color}, ${color}66)`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", padding: "4px 12px",
                        borderRadius: 50, color,
                        background: `${color}18`,
                        border: `1px solid ${color}44`,
                      }}>{getLabel(iit.score)}</span>
                      <span style={{ fontSize: 18 }}>
                        {iit.score >= 70 ? "😊" : iit.score >= 55 ? "😐" : "😟"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}