import sqlite3
import mysql.connector
from hvapi import HVAPI

api = HVAPI(r'http://hk.sukeycz.com:3001')


class DATABASE:

    def __init__(self):
        self.db = mysql.connector.connect(
            host="152.136.112.146",
            user="testauction",
            passwd="t6DwLGwsRGxnfcHc",
            database="auction"
        )

    # 根据主键搜索
    def search_byid(self, id):
        db = self.db.cursor()
        search = db.execute(
            f"SELECT id,aid,start,features,link,seller,winner,win_price,win_time,win_post,end_time FROM equipment WHERE id = f{id***REMOVED***")
        winner = search[6]
        price = search[7]
        db.close()
        return winner, price

    # info = [(id,aid,start,features,link,seller,end_time),(..),(..)]
    def insert_newequip(self, info):
        db = self.db.cursor()
        sql = "INSERT INTO equipment (id,aid,start,features,link,seller) VALUES (%s, %s, %s, %s, %s, %s)"
        db.executemany(sql, info)
        db.commit()  # 数据表更新
        return db.rowcount

    def update_win_price(self, id, winner, winner_price):
        db = self.db.cursor()
        sql1 = "UPDATE equipment SET winner = %s WHERE id = %s"
        sql2 = "UPDATE equipment SET winner_price = %s WHERE id = %s"
        val1 = (winner, id)
        val2 = (winner_price, id)
        db.execute(sql1, val1)
        db.execute(sql2, val2)
        db.commit()
        return db.rowcount

    # 形成BBCode
    def BBCode(self, table):
        db = self.db.cursor()


        #cursor = db.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table***REMOVED***")
        #for id in range(1, 10):

        id_row = self.search_byid(0)

        '''
        mat, one, two, sta, shd, clo, lig, hea = 0, 0, 0, 0, 0, 0, 0, 0
        out = "\n"
        
        for row in search:
            if row[0].find('Mat') != -1 and mat != 1:
                out = out + '[size=4][b]Materials/Special[/b][/size]\n\n'
                mat = mat + 1
            elif row[0].find('One') != -1 and one != 1:
                out = out + '\n[size=4][b]One-Handed[/b][/size]\n\n'
                one = one + 1
            elif row[0].find('Two') != -1 and two != 1:
                out = out + '\n[size=4][b]Two-Handed[/b][/size]\n\n'
                two = two + 1
            elif row[0].find('Sta') != -1 and sta != 1:
                out = out + '\n[size=4][b]Staff[/b][/size]\n\n'
                sta = sta + 1
            elif row[0].find('Shd') != -1 and shd != 1:
                out = out + '\n[size=4][b]Shield[/b][/size]\n\n'
                shd = shd + 1
            elif row[0].find('Clo') != -1 and clo != 1:
                out = out + '\n[size=4][b]Cloth[/b][/size]\n\n'
                clo = clo + 1
            elif row[0].find('Lig') != -1 and lig != 1:
                out = out + '\n[size=4][b]Light[/b][/size]\n\n'
                lig = lig + 1
            elif row[0].find('Hea') != -1 and hea != 1:
                out = out + '\n[size=4][b]Heavy[/b][/size]\n\n'
                hea = hea + 1
            if row[5]:
                
                price = float(row[5])
                if price >= 1000000:
                    price = str(round(price / 1000000, 2)) + "m"
                elif price >= 10000:
                    price = str(round(price / 1000, 2)) + "k"
                if row[0].find('Mat') != -1:
                    out = out + f'[{row[0]***REMOVED***] {row[2]***REMOVED*** (seller:{row[1]***REMOVED***)[b]{row[6]***REMOVED*** {price***REMOVED*** [/b]{row[8]***REMOVED***\n'
                else:
                    bbcode = api.equip_allinfo(row[3])["data"]["bbcode"]
                    # out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{row[2]***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)[b]{row[6]***REMOVED*** {price***REMOVED*** [/b]{row[8]***REMOVED***\n'
                    out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{bbcode***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)[b]{row[6]***REMOVED*** {price***REMOVED*** [/b]{row[8]***REMOVED***\n'
            else:
                if row[0].find('Mat') != -1:
                    out = out + f'[{row[0]***REMOVED***] {row[2]***REMOVED*** (seller:{row[1]***REMOVED***)\n'
                else:
                    bbcode = api.equip_allinfo(row[3])["data"]["bbcode"]
                    # out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{row[2]***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)\n'
                    out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{bbcode***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)\n'
        '''
        conn.close()

        return out

