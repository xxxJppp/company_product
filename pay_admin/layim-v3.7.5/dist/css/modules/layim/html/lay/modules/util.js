/** layui-v2.2.45 MIT License By http://www.layui.com */layui.define("jquery",function(l){var f=layui.$;l("util",{fixbar:function(a){var d,b,c=f(document),g=f("body");a=f.extend({showHeight:200},a);a.bar1=!0===a.bar1?"\x26#xe606;":a.bar1;a.bar2=!0===a.bar2?"\x26#xe607;":a.bar2;a.bgcolor=a.bgcolor?"background-color:"+a.bgcolor:"";var e=[a.bar1,a.bar2,"\x26#xe604;"],e=f(['\x3cul class\x3d"layui-fixbar"\x3e',a.bar1?'\x3cli class\x3d"layui-icon" lay-type\x3d"bar1" style\x3d"'+a.bgcolor+'"\x3e'+e[0]+"\x3c/li\x3e":"",a.bar2?'\x3cli class\x3d"layui-icon" lay-type\x3d"bar2" style\x3d"'+a.bgcolor+'"\x3e'+e[1]+"\x3c/li\x3e":"",'\x3cli class\x3d"layui-icon layui-fixbar-top" lay-type\x3d"top" style\x3d"'+a.bgcolor+'"\x3e'+e[2]+"\x3c/li\x3e","\x3c/ul\x3e"].join("")),k=e.find(".layui-fixbar-top"),h=function(){c.scrollTop()>=a.showHeight?d||(k.show(),d=1):d&&(k.hide(),d=0)};f(".layui-fixbar")[0]||("object"==typeof a.css&&e.css(a.css),g.append(e),h(),e.find("li").on("click",function(){var b=f(this).attr("lay-type");"top"===b&&f("html,body").animate({scrollTop:0},200);a.click&&a.click.call(this,b)}),c.on("scroll",function(){clearTimeout(b);b=setTimeout(function(){h()},100)}))},countdown:function(a,d,b){var c=this,g="function"==typeof d,e=(new Date(a)).getTime(),f=(new Date(!d||g?(new Date).getTime():d)).getTime(),e=e-f,h=[Math.floor(e/864E5),Math.floor(e/36E5)%24,Math.floor(e/6E4)%60,Math.floor(e/1E3)%60];g&&(b=d);g=setTimeout(function(){c.countdown(a,f+1E3,b)},1E3);return b&&b(0<e?h:[0,0,0,0],d,g),0>=e&&clearTimeout(g),g},timeAgo:function(a,d){var b=[[],[]],c=(new Date).getTime()-(new Date(a)).getTime();return 6912E5<c?(c=new Date(a),b[0][0]=this.digit(c.getFullYear(),4),b[0][1]=this.digit(c.getMonth()+1),b[0][2]=this.digit(c.getDate()),d||(b[1][0]=this.digit(c.getHours()),b[1][1]=this.digit(c.getMinutes()),b[1][2]=this.digit(c.getSeconds())),b[0].join("-")+" "+b[1].join(":")):864E5<=c?(c/1E3/60/60/24|0)+"\u5929\u524d":36E5<=c?(c/1E3/60/60|0)+"\u5c0f\u65f6\u524d":12E4<=c?(c/1E3/60|0)+"\u5206\u949f\u524d":0>c?"\u672a\u6765":"\u521a\u521a"},digit:function(a,d){var b="";a=String(a);d=d||2;for(var c=a.length;c<d;c++)b+="0";return a<Math.pow(10,d)?b+(0|a):a},toDateString:function(a,d){var b=new Date(a||new Date);a=[this.digit(b.getFullYear(),4),this.digit(b.getMonth()+1),this.digit(b.getDate())];b=[this.digit(b.getHours()),this.digit(b.getMinutes()),this.digit(b.getSeconds())];return d=d||"yyyy-MM-dd HH:mm:ss",d.replace(/yyyy/g,a[0]).replace(/MM/g,a[1]).replace(/dd/g,a[2]).replace(/HH/g,b[0]).replace(/mm/g,b[1]).replace(/ss/g,b[2])}})});