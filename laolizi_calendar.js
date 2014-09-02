/*
 * 
 * 依赖于 Zepto/JQuery
*/
(function ($) {
    var holiday = {
                    "2014-02-14": "元宵节",
                    "2014-03-08": "妇女节", 
                    "2014-04-01": "愚人节", 
                    "2014-04-05": "清明节", 
                    "2014-05-11": "母亲节", 
                    "2014-05-01": "劳动节", 
                    "2014-06-01": "儿童节", 
                    "2014-08-01": "建军节", 
                    "2014-08-02": "七夕节", 
                    "2014-09-10": "教师节", 
                    "2014-09-08": "中秋节", 
                    "2014-10-01": "国庆节", 
                    "2014-10-02": "重阳节", 
                    "2014-12-24": "圣诞节"
                };
    var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    function Today() {
        this.now = new Date();
        this.year = this.now.getFullYear();
        this.month = this.now.getMonth();
        this.day = this.now.getDate();
    }
    var today = new Today();
    function bindClickPrice(){
        $(".calTable a").off();
        $(".calTable a").click(function() {
            var id = $(this).attr("id");
            var dataPrice = $(this).find("span.font_dol").attr("data-price");
            var dataCanbook = $(this).find("span.font_dol").attr("data-canbook");
            if (dataCanbook) {
                $.fn.calendar.options.clickCallback(id,dataPrice);
            };
            
        });
    }
    $.fn.calendar = function (options) {
        options = $.fn.calendar.options = $.extend($.fn.calendar.defaults, options);
        var me = $(this);
        var nowDate = new Date();
        initView();
        bindClickPrice();
        function initView(){
            
            // me.append("<p>"+options.title+"</p>");
            for (var i = 0; i < 5; i++) {
                var year = nowDate.getFullYear();
                var month = nowDate.getMonth() + i;
                if (month >= 12) {
                    month = month%12 ;
                    year = year + 1;
                }
                fillMonth(year,month);
            };
            getTasks();
            
            return me;
        }
        function fillMonth(year,month){
            var dateHtml = '<div class="month-title">'+year+"年"+'<span class="month"> '+(month+1)+"月</span>"+"</div>";
            g = 0;
            for (var k = 0; k < 6; k++) {
                dateHtml += "<tr>";
                for (var p = 0; p < 7; p++) {
                    if (p == 0) {
                        dateHtml += '<td class="calBox sun" id="calBox' +year+"_"+(month+1)+"_"+ g + '"></td>';
                    } else {
                        if (p == 6) {
                            dateHtml += '<td class="calBox sat" id="calBox' +year+"_"+(month+1)+"_"+ g + '"></td>';
                        } else {
                            dateHtml += '<td class="calBox" id="calBox' +year+"_"+(month+1)+"_"+ g + '"></td>';
                        }
                    }
                    g++;
                }
                dateHtml += "</tr>";
            }
            var monthHtml = '<table class="calTable"><tr><th class="week_day">周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th class="week_day">周六</th></tr>' + dateHtml + "</table>";
            me.append(monthHtml);
            var t = 1;
            var a = new Date(year, month, 1);//获取此月第一天为星期几
            var m = a.getDay();
            var b = m + getDays(a.getMonth(), a.getFullYear()) - 1;
            var q = -1;
            if (today.year == year && today.month == month) {
                q = today.day;
            }
            var l = "";
            for (var k = m; k <= b; k++) {
                var f = month,
                r = t;
                f = f < 9 ? "0" + (f+1): (f+1);
                r = r < 10 ? "0" + r: r;
                if (holiday[year + "-" + f + "-" + r]) {
                    l += "<span class='holiday'>"+(month+1)+"月"+t+"日&nbsp;"+holiday[year + "-" + f + "-" + r]+"</span>";
                }
                if (t == q) {
                    $("#calBox" +year+"_"+(month+1)+"_"+ k).html("<div class='everyday today'><a href='javascript:;' id='" + year + "-" + f + "-" + r + "'><span class='sp_time'>" + "今天" + "</span></a></div>");
                } else {
                    var u = today.year,
                    e = today.month ,
                    o = today.day;
                    e = e < 10 ? "0" + e: e;
                    if (t < q || !timeContrast(u + "-" + e + "-" + o, year + "-" + f + "-" + r)) {
                        $("#calBox"+year+"_"+(month+1)+"_"+ k).html("<div class='everyday last_day'><span class='sp_time passed-day'>" + t + "</span></div>");
                    } else {
                        $("#calBox"+year+"_"+(month+1)+"_" + k).html("<div class='everyday'><a href='javascript:;' class='last_day' id='" + year + "-" + f + "-" + r + "'><span class='sp_time futrue-day'>" + t + "</span></a></div>");
                    }
                }
                t++;
            }
            me.append(l);
        }
        function getTasks() {
            $(".sp_pice").remove();
            for (var key in options.priceCanlendar) {
                buildTask(key, options.priceCanlendar[key].retail_price);
            };
        }
        function buildTask(key, price) {
            $("#" + key).append("<div class='sp_pice'><span class='font_dol' data-canbook=1 data-price="+price+"  >" + (price > 0 ? "&yen;" + price: "") + "</span></div>");
        }
        function getDays(b, a) {
            if (1 == b) {
                if (((0 == a % 4) && (0 != (a % 100))) || (0 == a % 400)) {
                    return 29;
                } else {
                    return 28;
                }
            } else {
                return daysInMonth[b];
            }
        }
        function timeContrast(f, d) {
            var c = f.split("-");
            var j = new Date(c[0], c[1], c[2]);
            var k = j.getTime();
            var g = d.split("-");
            var h = new Date(g[0], g[1], g[2]);
            var e = h.getTime();
            if (k > e) {
                return false;
            } else {
                return true;
            }
        }
        function getTimes(e, k) {
            var g = e.split("-");
            var l = g[0],
            h = g[1] - 1,
            o = g[2];
            var c = new Date(l, h, o);
            var p = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var b = p[c.getDay()];
            if (k == 1) {
                var g = new Date();
                var n = g.getFullYear();
                var f = g.getMonth() + 1;
                var j = g.getDate();
                f = f < 10 ? "0" + f: f;
                j = j < 10 ? "0" + j: j;
                var a = n + "-" + f + "-" + j;
                if (getTimeDiff(a, e) == 0) {
                    b = "今天";
                }
                if (getTimeDiff(a, e) == 1) {
                    b = "明天";
                }
                if (getTimeDiff(a, e) == 2) {
                    b = "后天";
                }
            }
            return b;
        }
        function getTimeDiff(f, c) {
            var e = f.split("-");
            var d = c.split("-");
            var j = new Date(e[0], Number(e[1]) - 1, e[2]);
            var h = new Date(d[0], Number(d[1]) - 1, d[2]);
            var a = parseInt(Math.abs(h - j) / 1000 / 60 / 60 / 24);
            return a;
        }
    };
    $.fn.reloadData = function(priceCanlendar){
        $(".sp_pice").remove();
        for (var key in priceCanlendar) {
            buildTask(key, priceCanlendar[key].retail_price);
        };
        function buildTask(key, price) {
            $("#" + key).append("<div class='sp_pice'><span class='font_dol' data-canbook=1 data-price="+price+"  >" + (price > 0 ? "&yen;" + price: "") + "</span></div>");
        }
        bindClickPrice();
    }
    $.fn.calendar.defaults = {
        title:'选择日期',
        text: '1133f',
        clickCallback:function(){
            alert("Oh!!click");
        }
    };

})(Zepto||JQuery);