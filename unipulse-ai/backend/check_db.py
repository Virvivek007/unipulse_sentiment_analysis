import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM sentiments LIMIT 5")
cursor.execute("SELECT iit, category, sentiment FROM sentiments LIMIT 25")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()