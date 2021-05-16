#!/usr/bin/python

import sqlite3

conn = sqlite3.connect(r"D:\\Github\\hvAuction\\python\\data\\auction.db")
c = conn.cursor()
print("Opened database successfully")

cursor = c.execute("DROP TABLE ISK005;")
print("Delete done successfully",cursor)
conn.close()



