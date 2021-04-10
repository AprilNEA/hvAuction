// ==UserScript==
// @name     [ISK]Tower
// @version  1.5
// @grant    none
// @include  /^https?:\/\/(alt|www)?\.?hentaiverse\.org.*$
// ==/UserScript==

const weaken = 1;
const imp = 1;
const sleep = 0;
const slow = 0;
const wait = 0;
const absorb = 1;
const blind = 1;
const life_scroll = 0;
const haste_scroll = 0;

function fight() {
    var a = document.getElementById("btcp");
    if (!a) {

        if (document.querySelector('#pane_vitals > #dvbh >* > img[src$="/isekai/y/bar_dgreen.png"]')) {
            var hp = parseInt(document.querySelector('#pane_vitals > #dvbh >*> img[src$="/isekai/y/bar_dgreen.png"]').getAttribute("style").split(":")[1]) / 414;
        }
        if (document.querySelector('#pane_vitals > #dvbh >* > img[src$="/isekai/y/bar_bgreen.png"]')) {
            var hp = parseInt(document.querySelector('#pane_vitals > #dvbh >*> img[src$="/isekai/y/bar_bgreen.png"]').getAttribute("style").split(":")[1]) / 414;
        }

        var mp = parseInt(document.querySelector('#pane_vitals > #dvbm >*> img[src$="/isekai/y/bar_blue.png"]').getAttribute("style").split(":")[1]) / 414;
        var sp = parseInt(document.querySelector('#pane_vitals > #dvbs >*> img[src$="/isekai/y/bar_red.png"]').getAttribute("style").split(":")[1]) / 414;
        var op = parseInt(document.querySelector('#pane_vitals > #dvbc >*> img[src$="/isekai/y/bar_orange.png"]').getAttribute("style").split(":")[1]) / 414;

        if (hp < 0.89 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/healthpot.png"]')) {
            var health_d = document.getElementById("ikey_1");
            if (health_d) health_d.click();
        }

        if (mp < 1 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/manapot.png"]')) {
            var mana_d = document.getElementById("ikey_3");
            if (mana_d) mana_d.click();
        }
        var mana_ex = document.getElementById("ikey_10");
        var mana_p = document.getElementById("ikey_4");
        if (mp < 0.3) {
            if (mana_ex) mana_ex.click();
            if (!mana_ex && !mana_p) return 0;
        }
        if (mp < 0.47 && mana_p) {
            mana_p.click();
        }

        if (sp < 0.95 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/spiritpot.png"]')) {
            var sp_d = document.getElementById("ikey_5");
            if (sp_d) sp_d.click();
        }
        var sp_p = document.getElementById("ikey_6");
        var sp_ex = document.getElementById("ikey_11");
        if (sp < 0.38) {
            if (sp_ex) sp_ex.click();
            if (!sp_ex && !sp_p) {
                var cd0 = document.getElementById("ikey_s5");
                if (cd0) cd0.click();
                var cd1 = document.getElementById("ikey_s4");
                if (cd1) cd1.click();
                var cd2 = document.getElementById("ikey_s2");
                if (cd2) cd2.click();
                var cd3 = document.getElementById("ikey_s1");
                if (cd3) cd3.click();
                var cd4 = document.getElementById("ikey_s3");
                if (cd4) cd4.click();
                var cd5 = document.getElementById("ikey_1");
                if (cd5) cd5.click();
                var cd6 = document.getElementById("ikey_2");
                if (cd6) cd6.click();
                var cd7 = document.getElementById("ikey_3");
                if (cd7) cd7.click();
                var cd8 = document.getElementById("ikey_5");
                if (cd8) cd8.click();
                var cd9 = document.getElementById("ikey_n2");
                if (cd9) cd9.click();
                var cd10 = document.getElementById("ikey_15");
                if (cd10) cd10.click();
                var cd11 = document.getElementById("ikey_s6");
                if (cd11) cd11.click();
                var cd12 = document.getElementById("ikey_9");
                if (cd12) cd12.click();
                var cd13 = document.getElementById("ikey_n1");
                if (cd13) cd13.click();
                var cd14 = document.getElementById("ikey_n3");
                if (cd14) cd14.click();
                var cd15 = document.getElementById("ikey_n4");
                if (cd15) cd15.click();
                var cd16 = document.getElementById("ikey_n5");
                if (cd16) cd16.click();
                var cd17 = document.getElementById("ikey_n6");
                if (cd17) cd17.click();
                var cd18 = document.getElementById('ikey_p');
                if (cd18) cd18.click();
                return 0;
            }
        }
        if (sp < 0.51 && sp_p) {
            sp_p.click();
        }

        var gem = document.getElementById('ikey_p');
        if (gem) gem.click();

        var health_p = document.getElementById("ikey_2");
        if (hp < 0.1 && health_p) {
            health_p.click();
        }
        if (hp < 0.48) {
            var cure = document.getElementById("qb16");
            if (cure) cure.click();
            if (!cure) {
                var fcure = document.getElementById("qb15");
                if (fcure) fcure.click();
                if (!fcure) {
                    if (document.querySelector('#pane_vitals > #dvbh >* > img[src$="/isekai/y/bar_bgreen.png"]') && !health_p) return 0;
                    if (health_p) health_p.click();
                    if (!health_p) {
                        var health_ex = document.getElementById("ikey_9");
                        if (health_ex) health_ex.click();
                        if (!health_ex) return 0;
                    }
                }
            }
        }

        if (op > 0.99 && document.querySelector('#pane_action >*> img[src$="/isekai/y/battle/spirit_n.png"]')) {
            var op_on = document.getElementById("ckey_spirit");
            if (op_on) op_on.click();
        }

        if (mp > 0.33 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/regen.png"]')) {
            var regen = document.getElementById("qb2");
            if (regen) regen.click();
        }
        if ((mp > 0.42 || document.querySelector('#pane_effects > img[src$="/isekai/y/e/Channeling.png"]'))
            && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/heartseeker.png"]')) {
            var heartseeker = document.getElementById("qb5");
            if (heartseeker) heartseeker.click();
        }

        var c1 = document.getElementById("mkey_1");
        if (c1) {
            var d1 = c1.getAttribute("onclick");
            var bg1 = document.querySelector('#mkey_1>.btm2').getAttribute("style");
            var wkn1 = document.querySelector('#mkey_1>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp1 = document.querySelector('#mkey_1>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp1 = document.querySelector('#mkey_1>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow1 = document.querySelector('#mkey_1>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind1 = document.querySelector('#mkey_1>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c2 = document.getElementById("mkey_2");
        if (c2) {
            var d2 = c2.getAttribute("onclick");
            var bg2 = document.querySelector('#mkey_2>.btm2').getAttribute("style");
            var wkn2 = document.querySelector('#mkey_2>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp2 = document.querySelector('#mkey_2>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp2 = document.querySelector('#mkey_2>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow2 = document.querySelector('#mkey_2>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind2 = document.querySelector('#mkey_2>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c3 = document.getElementById("mkey_3");
        if (c3) {
            var d3 = c3.getAttribute("onclick");
            var bg3 = document.querySelector('#mkey_3>.btm2').getAttribute("style");
            var wkn3 = document.querySelector('#mkey_3>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp3 = document.querySelector('#mkey_3>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp3 = document.querySelector('#mkey_3>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow3 = document.querySelector('#mkey_3>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind3 = document.querySelector('#mkey_3>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c4 = document.getElementById("mkey_4");
        if (c4) {
            var d4 = c4.getAttribute("onclick");
            var bg4 = document.querySelector('#mkey_4>.btm2').getAttribute("style");
            var wkn4 = document.querySelector('#mkey_4>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp4 = document.querySelector('#mkey_4>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp4 = document.querySelector('#mkey_4>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow4 = document.querySelector('#mkey_4>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind4 = document.querySelector('#mkey_4>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c5 = document.getElementById("mkey_5");
        if (c5) {
            var d5 = c5.getAttribute("onclick");
            var bg5 = document.querySelector('#mkey_5>.btm2').getAttribute("style");
            var wkn5 = document.querySelector('#mkey_5>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp5 = document.querySelector('#mkey_5>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp5 = document.querySelector('#mkey_5>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow5 = document.querySelector('#mkey_5>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind5 = document.querySelector('#mkey_5>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c6 = document.getElementById("mkey_6");
        if (c6) {
            var d6 = c6.getAttribute("onclick");
            var bg6 = document.querySelector('#mkey_6>.btm2').getAttribute("style");
            var wkn6 = document.querySelector('#mkey_6>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp6 = document.querySelector('#mkey_6>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp6 = document.querySelector('#mkey_6>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow6 = document.querySelector('#mkey_6>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind6 = document.querySelector('#mkey_6>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c7 = document.getElementById("mkey_7");
        if (c7) {
            var d7 = c7.getAttribute("onclick");
            var bg7 = document.querySelector('#mkey_7>.btm2').getAttribute("style");
            var wkn7 = document.querySelector('#mkey_7>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp7 = document.querySelector('#mkey_7>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp7 = document.querySelector('#mkey_7>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow7 = document.querySelector('#mkey_7>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind7 = document.querySelector('#mkey_7>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c8 = document.getElementById("mkey_8");
        if (c8) {
            var d8 = c8.getAttribute("onclick");
            var bg8 = document.querySelector('#mkey_8>.btm2').getAttribute("style");
            var wkn8 = document.querySelector('#mkey_8>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp8 = document.querySelector('#mkey_8>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp8 = document.querySelector('#mkey_8>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow8 = document.querySelector('#mkey_8>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind8 = document.querySelector('#mkey_8>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c9 = document.getElementById("mkey_9");
        if (c9) {
            var d9 = c9.getAttribute("onclick");
            var bg9 = document.querySelector('#mkey_9>.btm2').getAttribute("style");
            var wkn9 = document.querySelector('#mkey_9>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp9 = document.querySelector('#mkey_9>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp9 = document.querySelector('#mkey_9>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow9 = document.querySelector('#mkey_9>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind9 = document.querySelector('#mkey_9>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var c0 = document.getElementById("mkey_0");
        if (c0) {
            var d0 = c0.getAttribute("onclick");
            var bg0 = document.querySelector('#mkey_0>.btm2').getAttribute("style");
            var wkn0 = document.querySelector('#mkey_0>.btm6 > img[src$="/isekai/y/e/weaken.png"]');
            var imp0 = document.querySelector('#mkey_0>.btm6 > img[src$="/isekai/y/e/imperil.png"]');
            var slp0 = document.querySelector('#mkey_0>.btm6 > img[src$="/isekai/y/e/sleep.png"]');
            var slow0 = document.querySelector('#mkey_0>.btm6 > img[src$="/isekai/y/e/slow.png"]');
            var blind0 = document.querySelector('#mkey_0>.btm6 > img[src$="/isekai/y/e/blind.png"]');
        }
        var i = 0;
        var slp = 0;
        if (d1) i = i + 1;
        if (d2) i = i + 1;
        if (d3) i = i + 1;
        if (d4) i = i + 1;
        if (d5) i = i + 1;
        if (d6) i = i + 1;
        if (d7) i = i + 1;
        if (d8) i = i + 1;
        if (d9) i = i + 1;
        if (d0) i = i + 1;

        if (slp1) slp = slp + 1;
        if (slp2) slp = slp + 1;
        if (slp3) slp = slp + 1;
        if (slp4) slp = slp + 1;
        if (slp5) slp = slp + 1;
        if (slp6) slp = slp + 1;
        if (slp7) slp = slp + 1;
        if (slp8) slp = slp + 1;

        if (life_scroll == 1 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/sparklife_scroll.png"]') && i > 3) {
            var ikey_s4 = document.getElementById("ikey_s4");
            var ikey_15 = document.getElementById("ikey_15");
            if (ikey_s4) ikey_s4.click();
            if (!ikey_s4 && ikey_15) ikey_15.click();
        }

        if (haste_scroll == 1 && !document.querySelector('#pane_effects > img[src$="/isekai/y/e/haste_scroll.png"]') && i > 2) {
            var ikey_s2 = document.getElementById("ikey_s2");
            var ikey_s6 = document.getElementById("ikey_s6");
            if (ikey_s2) ikey_s2.click();
            if (!ikey_s2 && ikey_s6) ikey_s6.click();
        }

        var qb9 = document.getElementById("qb9");
        if (wait == 1 && sleep == 1 && (!sp_p || !sp_ex) && i == 1) {
            if (d1 && !slp1 && qb9) {
                qb9.click();
                c1.click();
            }
        }
        if (absorb == 1 && i == 1 && !document.querySelector('#pane_action >*> img[src$="/isekai/y/battle/absorb.png"]') &&
            !document.querySelector('#pane_action >*> img[src$="/isekai/y/battle/absorb_scroll.png"]')) {
            var qb4 = document.getElementById("qb4");
            if (qb4) qb4.click();
        }
        if (wait == 1 && i == 1 && (!sp_p || !sp_ex)) {
            var qb6 = document.getElementById("qb6");
            qb6.click();
            c1.click();
        }
        if (sleep == 1 && i > 3) {
            if (qb9 && d1 && !slp1) {
                qb9.click();
                c1.click();
            }
            if (qb9 && d5 && !slp5 && i > 6) {
                qb9.click();
                c5.click();
            }
            if (qb9 && d3 && !slp3 && i > 6 && slp < 4) {
                qb9.click();
                c3.click();
            }
        }

        if (weaken == 1) {
            var qb7 = document.getElementById("qb7");
            if (d1 && !wkn1 && !slp1) {
                qb7.click();
                c1.click();
            }
            if (d5 && !wkn5 && !slp5) {
                qb7.click();
                c5.click();
            }
            if (d8 && !wkn8) {
                qb7.click();
                c8.click();
            }
            if (d2 && !wkn2 && !slp2) {
                qb7.click();
                c2.click();
            }
            if (d3 && !wkn3 && !slp3) {
                qb7.click();
                c3.click();
            }
            if (d4 && !wkn4 && !slp4) {
                qb7.click();
                c4.click();
            }
            if (d6 && !wkn6 && !slp6) {
                qb7.click();
                c6.click();
            }
            if (d7 && !wkn7 && !slp7) {
                qb7.click();
                c7.click();
            }
            if (d9 && !wkn9 && !slp9) {
                qb7.click();
                c9.click();
            }
        }

        if (slow == 1) {
            var qb8 = document.getElementById("qb8");
            if (qb8 && d1 && !slow1 && i < 4 && !slp1) {
                qb8.click();
                c1.click();
            }
            if (qb8 && d8 && !slow8) {
                qb8.click();
                c8.click();
            }
            if (qb8 && d5 && !slow5 && !slp5) {
                qb8.click();
                c5.click();
            }
        }

        if (blind == 1) {
            var qb12 = document.getElementById("qb12");
            if (qb12 && d1 && !blind1 && i < 4) {
                qb12.click();
                c1.click();
            }
            if (qb12 && d8 && !blind8 && !slp8) {
                qb12.click();
                c8.click();
            }
            if (qb12 && d5 && !blind5 && !slp5) {
                qb12.click();
                c5.click();
            }
        }

        var qb10 = document.getElementById("qb10");
        if (imp == 9) {
            if (d1 && !imp1) {
                qb10.click();
                c1.click();
            }
            if (d5 && !imp5) {
                qb10.click();
                c5.click();
            }
            if (d8 && !imp8) {
                qb10.click();
                c8.click();
            }
        }

        if (d0 && !bg0) {
            if (imp == 1 && !imp0) {
                qb10.click();
                c0.click();
            }
            c0.click();
        }
        if (d9 && !bg9) {
            if (imp == 1 && !imp9) {
                qb10.click();
                c9.click();
            }
            c9.click();
        }
        if (d8 && !bg8) {
            if (imp == 1 && !imp8) {
                qb10.click();
                c8.click();
            }
            c8.click();
        }
        if (d7 && !bg7) {
            if (imp == 1 && !imp7) {
                qb10.click();
                c7.click();
            }
            c7.click();
        }
        if (d6 && !bg6) {
            if (imp == 1 && !imp6) {
                qb10.click();
                c6.click();
            }
            c6.click();
        }
        if (d5 && !bg5) {
            if (imp == 1 && !imp5) {
                qb10.click();
                c5.click();
            }
            c5.click();
        }
        if (d4 && !bg4) {
            if (imp == 1 && !imp4) {
                qb10.click();
                c4.click();
            }
            c4.click();
        }
        if (d3 && !bg3) {
            if (imp == 1 && !imp3) {
                qb10.click();
                c3.click();
            }
            c3.click();
        }
        if (d2 && !bg2) {
            if (imp == 1 && !imp2) {
                qb10.click();
                c2.click();
            }
            c2.click();
        }
        if (d1 && !bg1) {
            if (imp == 1 && !imp1) {
                qb10.click();
                c1.click();
            }
            c1.click();
        }

        var t3 = document.getElementById("2203");
        if (t3.getAttribute("onclick")) t3.click();
        var t2 = document.getElementById("2202");
        if (t2.getAttribute("onclick")) t2.click();
        var t1 = document.getElementById("2201");
        if (t1.getAttribute("onclick")) t1.click();

        if (d1 && bg1) {
            if (imp == 1 && !imp1) {
                qb10.click();
                c1.click();
            }
            c1.click();
        }
        if (d2 && bg2) {
            if (imp == 1 && !imp2) {
                qb10.click();
                c2.click();
            }
            c2.click();
        }
        if (d3 && bg3) {
            if (imp == 1 && !imp3) {
                qb10.click();
                c3.click();
            }
            c3.click();
        }
        if (d4 && bg4) {
            if (imp == 1 && !imp4) {
                qb10.click();
                c4.click();
            }
            c4.click();
        }
        if (d5 && bg5) {
            if (imp == 1 && !imp5) {
                qb10.click();
                c5.click();
            }
            c5.click();
        }
        if (d6 && bg6) {
            if (imp == 1 && !imp6) {
                qb10.click();
                c6.click();
            }
            c6.click();
        }
        if (d7 && bg7) {
            if (imp == 1 && !imp7) {
                qb10.click();
                c7.click();
            }
            c7.click();
        }
        if (d8 && bg8) {
            if (imp == 1 && !imp8) {
                qb10.click();
                c8.click();
            }
            c8.click();
        }
        if (d9 && bg9) {
            if (imp == 1 && !imp9) {
                qb10.click();
                c9.click();
            }
            c9.click();
        }
        if (d0 && bg0) {
            if (imp == 1 && !imp0) {
                qb10.click();
                c0.click();
            }
            c0.click();
        }
    }
    if (a) {
        a.click();
        return 0;
    }

}

fight();

var targetNode = document.getElementById('pane_log');
var mutationObserverInitConfig = {attributes: true, childList: true, subtree: true};
var observer = new MutationObserver(fight);
observer.observe(targetNode, mutationObserverInitConfig);
