import sqlite3
from hvapi import HVAPI
api = HVAPI(r'http://hk.sukeycz.com:3001')

class DATABASE:
    def __init__(self, db_name):
        self.db_name = db_name

    def read(self, table, id):
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        winner = 0
        price = 0
        cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table***REMOVED*** where ID = '{id***REMOVED***'")
        for row in cursor:
            winner = row[6]
            price = row[5]
        conn.close()
        return winner, price

    def update(self, table, id, which, key):
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        sql = f"UPDATE {table***REMOVED*** set {which***REMOVED*** = '{key***REMOVED***' where ID= '{id***REMOVED***'"
        c.execute(sql)
        conn.commit()
        conn.close()

    # 根据主键搜索
    def search_byid(self, table, id):
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        winner = 0
        price = 0
        cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table***REMOVED*** where ID = '{id***REMOVED***'")
        for row in cursor:
            winner = row[6]
            price = row[5]
        conn.close()
        return winner, price

    # 形成BBCode
    def BBCode(self, table):
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,FEATURES,PRICE,WINNER,TIME,LOG from {table***REMOVED***")
        mat, one, two, sta, shd, clo, lig, hea = 0, 0, 0, 0, 0, 0, 0, 0
        out = "\n"
        for row in cursor:
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
                    #out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{row[2]***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)[b]{row[6]***REMOVED*** {price***REMOVED*** [/b]{row[8]***REMOVED***\n'
                    out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{bbcode***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)[b]{row[6]***REMOVED*** {price***REMOVED*** [/b]{row[8]***REMOVED***\n'
            else:
                if row[0].find('Mat') != -1:
                    out = out + f'[{row[0]***REMOVED***] {row[2]***REMOVED*** (seller:{row[1]***REMOVED***)\n'
                else:
                    bbcode = api.equip_allinfo(row[3])["data"]["bbcode"]
                    #out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{row[2]***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)\n'
                    out = out + f'[{row[0]***REMOVED***] [url={row[3]***REMOVED***]{bbcode***REMOVED***[/url] ({row[4]***REMOVED***) (seller:{row[1]***REMOVED***)\n'
        conn.close()

        return out