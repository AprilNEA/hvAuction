import sqlite3

db_name = r'D:\Github\hv-Auction\database\auction.db'

def add(table,key,seller,name,link,features):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"INSERT INTO {table}(ID,SELLER,NAME,LINK,FEATURES) VALUES ('{key}','{seller}','{name}','{link}','{features}')"
    c.execute(sql)
    conn.commit()
    print(f'Record {key},{seller},{name},{features} created successfully')
    conn.close()

#add('ISK001','a1','i','123','11')

def read(table):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table}")
    for row in cursor:
       for i in row:
           print(i)
    print ("Operation done successfully")
    conn.close()
read('ISK001')

def update(table,id,which,key):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"UPDATE {table} set {which} = '{key}' where ID= '{id}'"
    print(sql)
    c.execute(sql)
    conn.commit()
    print("Total number of rows updated :" + str(conn.total_changes))
    conn.close()
#update('ISK001','a1','PRICE','100')

def delete(table,id):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    print("Opened db successfully")
    sql = f"DELETE from {table} where ID= '{id}';"
    c.execute(sql)
    conn.commit()
    print("Total number of rows deleted :", conn.total_changes)
    print("Operation done successfully")
    conn.close()
#delete('ISK001','a1')
