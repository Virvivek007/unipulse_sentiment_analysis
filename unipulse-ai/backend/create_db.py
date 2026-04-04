import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

cursor.execute("SELECT iit, category, sentiment FROM sentiments LIMIT 25")

for row in cursor.fetchall():
    print(row)

conn.close()

print("✅ Fresh DB created!")