from datetime import datetime
import time
import sqlite3
***REMOVED***
import urllib
import json
from databasesq3 import DATABASE
from hvapi import HVAPI
api = HVAPI(r'http://hk.sukeycz.com:3001')
print(api.equip_allinfo('https://hentaiverse.org/equip/268325913/a916142cda'))
bbcode = '''
[size=4][b]Materials/Special[/b][/size]

[Mat01] 10 x Flower Vase (seller:OnceForAll)
[Mat02] 10 x Bubble-Gum (seller:OnceForAll)
[Mat03] 10 x Crystallized Phazon (seller:OnceForAll)
[Mat04] 10 x Repurposed Actuator (seller:OnceForAll)[b]paramount111 100.0k [/b]#10
[Mat05] 20 x Crystallized Phazon (seller:unikwind)
[Mat06] 100 x High-Grade Cloth (seller:unikwind)
[Mat07] 45 x High-Grade Cloth (seller:OnceForAll)

[size=4][b]One-Handed[/b][/size]

[One01] [url=https://hentaiverse.org/isekai/equip/415464/7d29a3b5f2][b][color=#f00]P[/color][color=#f90]e[/color][color=#fc0]e[/color][color=#0c0]r[/color][color=#09f]l[/color][color=#00c]e[/color][color=#c0f]s[/color][color=#f00]s[/color][/b] [b][color=#f00]Ethereal[/color][/b] [b]Wakizashi[/b] of the Nimble[/url] (358, ADB 100%, Parry 100%) (seller:司徒雨停)[b]youshi1 30.0m [/b]#3
[One02] [url=https://hentaiverse.org/isekai/equip/252066/f0f7c2979a ]Legendary Demonic [b]Wakizashi[/b] of the Nimble[/url] (313, ADB 52%, Parry 31%) (seller:drgoku)[b]Grandmasters 50.0k [/b]#7
[One03] [url=https://hentaiverse.org/isekai/equip/70573/5cde3043b3]Legendary [b][color=#f00]Ethereal[/color][/b] [b]Axe[/b] of [b][color=#f00]Slaughter[/color][/b][/url] (289, ADB 10%) (seller:Grandmasters)
[One04] [url=https://hentaiverse.org/isekai/equip/35732/b1f4c13bc0]Legendary [b][color=#f00]Ethereal[/color][/b] [b]Axe[/b] of [b][color=#f00]Slaughter[/color][/b][/url] (263, ADB 66%) (seller:Grandmasters)
[One05] [url=https://hentaiverse.org/isekai/equip/390461/28374cd1a3]Magnificent Ethereal Wakizashi of Swiftness[/url] (314, ADB 52%, Parry 4%) (seller:Maharid)
[One06] [url=https://hentaiverse.org/isekai/equip/123748/df2ab7ee2e]Magnificent Rapier of Slaughter[/url] (300, ADB 43%, Parry 29%) (seller:Maharid)

[size=4][b]Shield[/b][/size]

[Shd01] [url=https://hentaiverse.org/isekai/equip/363575/e556460095 ]Legendary Mithril Buckler of Protection[/url] (336, BLK 24%) (seller:drgoku)
[Shd02] [url=https://hentaiverse.org/isekai/equip/330742/af7ec860b7 ]Legendary Agile Buckler of Warding[/url] (329, BLK 81%) (seller:drgoku)
[Shd03] [url=https://hentaiverse.org/isekai/equip/403042/3fcb50f0cd]Legendary Agile Kite of Warding[/url] (362, BLK 89%) (seller:unikwind)
[Shd04] [url=https://hentaiverse.org/isekai/equip/264066/8dadc0402a]Magnificent Mithril Buckler of the Nimble[/url] (282, BLK 60%) (seller:Maharid)

[size=4][b]Staff[/b][/size]

[Sta01] [url=https://hentaiverse.org/isekai/equip/352510/6b376eb9a7 ]Magnificent [b]Fiery[/b] [b]Redwood Staff[/b] of Surtr[/url] (332, MDB 10%, Fire EDB 134%) (seller:drgoku)

[size=4][b]Cloth[/b][/size]

[Clo01] [url=https://hentaiverse.org/isekai/equip/352871/ee822818d5 ]Magnificent [b][color=#f90]Frugal[/color][/b] [b]Phase[/b] Pants of Mjolnir[/url] (333, Elec EDB 61%) (seller:drgoku)[b]sabregimp 50.0k [/b]#9

[size=4][b]Light[/b][/size]

[Lig01] [url=https://hentaiverse.org/isekai/equip/376290/eee2670cc8]Legendary [b][color=#f00]Savage[/color][/b] [b]Shade[/b] Breastplate of Fleet[/url] (358, ADB 8%) (seller:unikwind)[b]sabregimp 50.0k [/b]#9
[Lig02] [url=https://hentaiverse.org/isekai/equip/389576/7124e17975]Legendary [b][color=#f00]Savage[/color][/b] [b]Shade[/b] Boots of Negation[/url] (333, ADB 17%) (seller:SleepDealer)

[size=4][b]Heavy[/b][/size]

[Hea01] [url=https://hentaiverse.org/isekai/equip/274856/aacddffb28]Legendary Jade [b][color=#f00]Power[/color][/b] Helmet of [b][color=#f00]Slaughter[/color][/b][/url] (344, ADB 42%) (seller:Pretty anon)[b]-The Dashing Dash- 500.0k [/b]#8
[Hea02] [url=https://hentaiverse.org/isekai/equip/394853/44798ffb9c]Legendary Amber [b][color=#f00]Power[/color][/b] Gauntlets of Warding[/url] (315, ADB 46%) (seller:Maharid)[b]SleepDealer 200.0k [/b]#5
[Hea03] [url=https://hentaiverse.org/isekai/equip/394893/8a8bbb8970]Legendary Cobalt Plate Helmet of [b]Protection[/b][/url] (315) (seller:Maharid)
[Hea04] [url=https://hentaiverse.org/isekai/equip/415768/e139d8525c]Legendary Ruby Plate Sabatons of Warding[/url] (319) (seller:Maharid)
[Hea05] [url=https://hentaiverse.org/isekai/equip/254257/ed8a15de39 ]Legendary Onyx Plate Greaves of Warding[/url] (315) (seller:drgoku)
[Hea06] [url=https://hentaiverse.org/isekai/equip/21818/4f04729b7a ]Legendary Mithril Plate Sabatons of Warding[/url] (210) (seller:drgoku)
[Hea07] [url=https://hentaiverse.org/isekai/equip/415418/76ebf8c39c]Magnificent [b][color=#f00]Power[/color][/b] Gauntlets of [b][color=#f00]Slaughter[/color][/b][/url] (364, ADB 24%) (seller:chjj30)[b]zero1018101 50.0k [/b]#11
[Hea08] [url=https://hentaiverse.org/isekai/equip/379853/4a1a1eae87]Magnificent Cobalt [b][color=#f00]Power[/color][/b] Leggings of Protection[/url] (363, ADB 30%) (seller:Ming28561)
[Hea09] [url=https://hentaiverse.org/isekai/equip/378322/ed0e3a0787]Magnificent Zircon [b][color=#f00]Power[/color][/b] Helmet of Protection[/url] (311, ADB 2%) (seller:Maharid)
[Hea10] [url=https://hentaiverse.org/isekai/equip/22389/a117e0d2f0 ]Magnificent Jade [b][color=#f00]Power[/color][/b] Gauntlets of Protection[/url] (213, ADB 28%) (seller:drgoku)
[Hea11] [url=https://hentaiverse.org/isekai/equip/382930/6da44f57ed ]Magnificent [b][color=#f00]Power[/color][/b] Leggings of Warding[/url] (336, ADB 83%) (seller:drgoku)
[Hea12] [url=https://hentaiverse.org/isekai/equip/324171/ed06d9abb7 ]Magnificent [b][color=#f00]Power[/color][/b] Gauntlets of Protection[/url] (327, ADB 90%) (seller:drgoku)
[Hea13] [url=https://hentaiverse.org/isekai/equip/394890/ca833ae0d8]Magnificent Mithril [b][color=#f00]Power[/color][/b] Armor of Protection[/url] (315, ADB 28%) (seller:Maharid)
'''
#print(api.auto_edit(90, 246614, 5879663, bbcode))
#print(bbcode)