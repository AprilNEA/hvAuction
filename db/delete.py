#!/usr/bin/python

import sqlite3

conn = sqlite3.connect(r"/data\\auction.db")
c = conn.cursor()
print("Opened db successfully")

cursor = c.execute("DROP TABLE ISK005;")
print("Delete done successfully",cursor)
conn.close()



