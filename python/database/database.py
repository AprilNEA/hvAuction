import sqlite3

db_name = r'D:\Github\hv-Auction\database\auction.db'

def add(table,key,seller,name,link,features):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"INSERT INTO {table***REMOVED***(ID,SELLER,NAME,LINK,FEATURES) VALUES ('{key***REMOVED***','{seller***REMOVED***','{name***REMOVED***','{link***REMOVED***','{features***REMOVED***')"
    c.execute(sql)
    conn.commit()
    print(f'Record {key***REMOVED***,{seller***REMOVED***,{name***REMOVED***,{features***REMOVED*** created successfully')
    conn.close()

#add('ISK001','a1','i','123','11')

def read(table):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table***REMOVED***")
    for row in cursor:
       for i in row:
           print(i)
    print ("Operation done successfully")
    conn.close()
read('ISK001')

def update(table,id,which,key):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"UPDATE {table***REMOVED*** set {which***REMOVED*** = '{key***REMOVED***' where ID= '{id***REMOVED***'"
    print(sql)
    c.execute(sql)
    conn.commit()
    print("Total number of rows updated :" + str(conn.total_changes))
    conn.close()
#update('ISK001','a1','PRICE','100')

def delete(table,id):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    print("Opened database successfully")
    sql = f"DELETE from {table***REMOVED*** where ID= '{id***REMOVED***';"
    c.execute(sql)
    conn.commit()
    print("Total number of rows deleted :", conn.total_changes)
    print("Operation done successfully")
    conn.close()
#delete('ISK001','a1')
