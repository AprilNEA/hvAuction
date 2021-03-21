***REMOVED***
import csv
import sqlite3

# http://localhost:3001/hv/equip/?url=https://hentaiverse.org/equip/268325913/a916142cda

SERVER = 'http://hk.sukeycz.com:3001'
db_name = r'D:\Github\hv-Auction\database\auction.db'


def equip_allinfo(link):
    url = f'{SERVER***REMOVED***/hv/equip/?url={link***REMOVED***'
    response = requests.get(url)
    return response.json()


def database_update(table, id, which, key):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"UPDATE {table***REMOVED*** set {which***REMOVED*** = '{key***REMOVED***' where ID= '{id***REMOVED***'"
    print(sql)
    c.execute(sql)
    conn.commit()
    print("Total number of rows updated :" + str(conn.total_changes))
    conn.close()
    return 0


def equip_info(link):
    info = equip_allinfo(link)  # info 装备信息
    features = str(info['data']['level'])  # features(前置等级) 准备输出精简属性
    percentiles = info['data']['percentile']
    forging = info['data']['forging']
    name = info['data']['name']
    number = 0
    useful_pers = ['ADB', 'Parry', 'BLK', 'MDB', 'EDB', 'Divine EDB', 'Forb EDB', 'Elec EDB', 'Wind EDB', 'Cold EDB',
                   'Fire EDB', 'Elem Prof']
    # if name.find('')
    for useful_per in useful_pers:
        if number < 2:
            if useful_per in percentiles:
                features = ''.join([features, ", " + useful_per + " " + str(percentiles[useful_per]) + "%"])
                number = number + 1
            if useful_per in forging:
                features = ''.join([features, ", " + useful_per + " " + str(forging[useful_per]['forgeLevel']) + "%"])
                number = number + 1
        else:
            break
    return features


def equip_form():
    equipdate = csv.reader(open('equip_info/2.csv', 'r', encoding='utf-8-sig'))
    csv_writer = csv.writer(open('equip_info/2_info3.csv', 'w', encoding='utf-8-sig', newline=''))
    for i in equipdate:
        # equip_all.append(i)
        if i[3] != '' and i[3] != 'link' and i[3] != 'mat':
            csv_writer.writerow([i[0], i[1], i[2], i[3], equip_info(i[3])])
        if i[3] == 'mat':
            csv_writer.writerow([i[0], i[1], i[2], '', ''])


def add(table, key, seller, name, link, features):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"INSERT INTO {table***REMOVED***(ID,SELLER,NAME,LINK,FEATURES) VALUES ('{key***REMOVED***','{seller***REMOVED***','{name***REMOVED***','{link***REMOVED***','{features***REMOVED***')"
    c.execute(sql)
    conn.commit()
    print(f'Record {key***REMOVED***,{seller***REMOVED***,{name***REMOVED***,{features***REMOVED*** created successfully')
    conn.close()


def database():
    equipdate = csv.reader(open('equip_info/2_info3.csv', 'r', encoding='utf-8-sig'))
    for i in equipdate:
        # def add(table,key,seller,name,link,features):
        if i[3] != '' and i[3] != 'link' and i[3] != 'mat':
            print(i[1] + i[0] + i[2] + i[3] + i[4])
            add('ISK002', i[1], i[0], i[2], i[3], i[4])
        if i[3] == '':
            print(i[1] + i[0] + i[2])
            add('ISK002', i[1], i[0], i[2], '0', '0')


#equip_form()
database()
