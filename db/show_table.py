#!/usr/bin/python

import sqlite3

conn = sqlite3.connect(r"/data\\auction.db")
c = conn.cursor()
print("Opened db successfully")

cursor = c.execute("SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from ISK005")

for row in cursor:
   print(row)

print("Operation done successfully")
conn.close()
