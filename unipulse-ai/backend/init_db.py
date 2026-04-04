import sqlite3

conn = sqlite3.connect("unipulse.db")
cursor = conn.cursor()

# Clear old data
cursor.execute("DELETE FROM sentiments")

# Insert with correct IIT key format (no spaces)
cursor.execute("""
INSERT INTO sentiments (iit, text, sentiment, score, category) VALUES 
('IITBombay', 'Placements are tough this year', 'negative', -0.6, 'Placements'),
('IITBombay', 'Campus life is amazing', 'positive', 0.8, 'General'),
('IITBombay', 'Professors are very helpful', 'positive', 0.7, 'Academics'),
('IITDelhi', 'Academics are stressful', 'negative', -0.5, 'Academics'),
('IITDelhi', 'Great placement season this year', 'positive', 0.9, 'Placements'),
('IITK', 'Hostel food needs improvement', 'negative', -0.4, 'Hostel Life'),
('IITK', 'Research facilities are world class', 'positive', 0.85, 'Infrastructure'),
('IITMadras', 'Campus is beautiful', 'positive', 0.75, 'General'),
('IITMadras', 'Mental health support is lacking', 'negative', -0.6, 'Mental Health'),
('IITKgp', 'Spring fest was amazing this year', 'positive', 0.9, 'Fests & Culture')
""")

conn.commit()
conn.close()
print("✅ Database updated with correct IIT keys!")