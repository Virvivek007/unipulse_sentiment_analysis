export default function PostFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#555a78",
        fontSize: 14,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📭</div>
        No posts available
      </div>
    );
  }

  const getColor = (label) => {
    switch (label?.toLowerCase()) {
      case "positive": return "#00e676";
      case "negative": return "#ff3b7a";
      default:         return "#f5a623";
    }
  };

  const getEmoji = (label) => {
    switch (label?.toLowerCase()) {
      case "positive": return "😊";
      case "negative": return "😞";
      default:         return "😐";
    }
  };

  const getBg = (label) => {
    switch (label?.toLowerCase()) {
      case "positive": return "rgba(0,230,118,0.1)";
      case "negative": return "rgba(255,59,122,0.1)";
      default:         return "rgba(245,166,35,0.1)";
    }
  };

  const getBorder = (label) => {
    switch (label?.toLowerCase()) {
      case "positive": return "rgba(0,230,118,0.3)";
      case "negative": return "rgba(255,59,122,0.3)";
      default:         return "rgba(245,166,35,0.3)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {posts.map((post, index) => {
        const color  = getColor(post.label);
        const border = getBorder(post.label);
        const bg     = getBg(post.label);

        return (
          <div
            key={post.id || index}
            onClick={() => post.url && window.open(post.url, "_blank")}
            style={{
              background: "#13151f",
              border: "1px solid #2a2d3e",
              borderLeft: `3px solid ${color}`,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              cursor: post.url ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#1a1d2e";
              e.currentTarget.style.borderColor = "#3a3d52";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#13151f";
              e.currentTarget.style.borderColor = "#2a2d3e";
            }}
          >
            {/* Emoji avatar */}
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: bg, border: `1px solid ${border}`,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}>
              {getEmoji(post.label)}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Title + badge */}
              <div style={{
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", gap: 12, marginBottom: 6,
              }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: "#e8eaf6",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {post.title || post.text || "Untitled"}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "3px 10px", borderRadius: 50,
                  color, background: bg, border: `1px solid ${border}`,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {post.label || "neutral"}
                </span>
              </div>

              {/* Body preview */}
              {post.body && (
                <div style={{
                  fontSize: 12, color: "#8b91b0",
                  marginBottom: 10, lineHeight: 1.5,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {post.body}
                </div>
              )}

              {/* Meta row */}
              <div style={{
                display: "flex", alignItems: "center",
                gap: 14, fontSize: 11, color: "#555a78", flexWrap: "wrap",
              }}>
                {post.score !== undefined && (
                  <span>⬆️ {post.score}</span>
                )}
                {post.comments !== undefined && (
                  <span>💬 {post.comments}</span>
                )}
                {post.subreddit && (
                  <span style={{
                    padding: "2px 8px", borderRadius: 6,
                    background: "#1a1d2e", border: "1px solid #2a2d3e",
                    fontSize: 10,
                  }}>
                    r/{post.subreddit}
                  </span>
                )}
                {post.category && (
                  <span style={{ color: "#00d4ff", fontSize: 10 }}>
                    {post.category}
                  </span>
                )}
                {post.compound !== undefined && (
                  <span style={{ marginLeft: "auto", fontWeight: 700, color }}>
                    {(post.compound * 100).toFixed(0)}% sentiment
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}