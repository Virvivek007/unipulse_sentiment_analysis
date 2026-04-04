export default function CategoryBars({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="card" style={{
        textAlign: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          opacity: 0.5,
        }}>
          📊
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          No category data available
        </div>
      </div>
    );
  }

  const getColor = (score) => {
    if (score >= 70) return "var(--accent-success)";
    if (score >= 50) return "var(--accent-warning)";
    return "var(--accent-danger)";
  };

  const getBadge = (score) => {
    if (score >= 70) return "badge-success";
    if (score >= 50) return "badge-warning";
    return "badge-danger";
  };

  const getLabel = (score) => {
    if (score >= 70) return "Positive";
    if (score >= 50) return "Neutral";
    return "Negative";
  };

  return (
    <div className="card">
      <div style={{
        fontSize: 11,
        color: "var(--text-muted)",
        letterSpacing: "2px",
        marginBottom: 20,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        fontWeight: 600,
      }}>
        Category Breakdown
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {categories.map((cat, index) => (
          <div 
            key={cat.name}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  {cat.name}
                </span>
                <span className={`badge ${getBadge(cat.score)}`}>
                  {getLabel(cat.score)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <span>📝</span>
                  <span>{cat.posts} posts</span>
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: getColor(cat.score),
                  minWidth: 60,
                  textAlign: "right",
                }}>
                  {cat.score}%
                </div>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{
                  width: `${cat.score}%`,
                  background: `linear-gradient(90deg, ${getColor(cat.score)}, ${getColor(cat.score)}dd)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}