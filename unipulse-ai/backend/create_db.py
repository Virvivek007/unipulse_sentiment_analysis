import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

# Check tables first
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables:", cursor.fetchall())

# Query correct table
cursor.execute("SELECT iit, category, label FROM posts LIMIT 25")
for row in cursor.fetchall():
    print(row)

conn.close()
print("✅ Done!")