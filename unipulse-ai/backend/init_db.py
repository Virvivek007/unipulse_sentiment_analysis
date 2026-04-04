import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sentiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    iit TEXT,
    text TEXT,
    sentiment TEXT,
    score REAL,
    category TEXT
)
""")

# Insert sample data
cursor.execute("""
INSERT INTO sentiments (iit, text, sentiment, score,)
VALUES 
('IIT Bombay', 'Placements are tough this year', 'negative', -0.6),
('IIT Bombay', 'Campus life is amazing', 'positive', 0.8),
('IIT Delhi', 'Academics are stressful', 'negative', -0.5)
""")

conn.commit()
conn.close()

print("✅ Database initialized with sample data")