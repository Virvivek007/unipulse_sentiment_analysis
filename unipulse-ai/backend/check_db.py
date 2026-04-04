import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

# Check what tables exist first
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables:", tables)

# Query the correct table
cursor.execute("SELECT iit, category, label, compound FROM posts LIMIT 25")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()