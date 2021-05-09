import sqlite3

conn = sqlite3.connect(r'D:\Github\hvAuction\python\data\auction.db')

print("Opened package successfully")
c = conn.cursor()
c.execute('''
CREATE TABLE ISK005
       (ID TEXT PRIMARY KEY     NOT NULL,
       SELLER           TEXT    NOT NULL,
       NAME            TEXT     NOT NULL,
       LINK            TEXT     NOT NULL,
       FEATURES        TEXT,
       PRICE         TEXT,
       WINNER        TEXT,
       TIME        TEXT,
       LOG        TEXT);''')
print("Table created successfully")
conn.commit()
conn.close()
