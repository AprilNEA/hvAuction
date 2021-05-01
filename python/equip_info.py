import requests
import csv
import sqlite3

# http://localhost:3001/hv/equip/?url=https://hentaiverse.org/equip/268325913/a916142cda

SERVER = 'http://hk.sukeycz.com:3001'



def add(table, key, seller, name, link, features):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"INSERT INTO {table}(ID,SELLER,NAME,LINK,FEATURES) VALUES ('{key}','{seller}','{name}','{link}','{features}')"
    c.execute(sql)
    conn.commit()
    print(f'Record {key},{seller},{name},{features} created successfully')
    conn.close()



