/** layui-v2.2.45 MIT License By http://www.layui.com */layui.define("jquery",function(p){var e=layui.$,l=(layui.hint(),layui.device()),h=function(){this.config={}};h.prototype.set=function(a){return e.extend(!0,this.config,a),this};h.prototype.on=function(a,b){return layui.onevent.call(this,"element",a,b)};h.prototype.tabAdd=function(a,b){var c=e(".layui-tab[lay-filter\x3d"+a+"]");a=c.children(".layui-tab-title");var d=a.children(".layui-tab-bar"),c=c.children(".layui-tab-content"),g='\x3cli lay-id\x3d"'+(b.id||"")+'"\x3e'+(b.title||"unnaming")+"\x3c/li\x3e";return d[0]?d.before(g):a.append(g),c.append('\x3cdiv class\x3d"layui-tab-item"\x3e'+(b.content||"")+"\x3c/div\x3e"),f.hideTabMore(!0),f.tabAuto(),this};h.prototype.tabDelete=function(a,b){a=e(".layui-tab[lay-filter\x3d"+a+"]").children(".layui-tab-title").find('\x3eli[lay-id\x3d"'+b+'"]');return f.tabDelete(null,a),this};h.prototype.tabChange=function(a,b){a=e(".layui-tab[lay-filter\x3d"+a+"]").children(".layui-tab-title").find('\x3eli[lay-id\x3d"'+b+'"]');return f.tabClick(null,null,a),this};h.prototype.tab=function(a){a=a||{};k.on("click",a.headerElem,function(b){var c=e(this).index();f.tabClick.call(this,b,c,null,a)})};h.prototype.progress=function(a,b){a=e(".layui-progress[lay-filter\x3d"+a+"]").find(".layui-progress-bar");var c=a.find(".layui-progress-text");return a.css("width",b),c.text(b),this};var f={tabClick:function(a,b,c,d){d=d||{};a=c||e(this);b=b||a.parent().children("li").index(a);c=d.headerElem?a.parent():a.parents(".layui-tab").eq(0);d=d.bodyElem?e(d.bodyElem):c.children(".layui-tab-content").children(".layui-tab-item");var g=a.find("a"),f=c.attr("lay-filter");"javascript:;"!==g.attr("href")&&"_blank"===g.attr("target")||(a.addClass("layui-this").siblings().removeClass("layui-this"),d.eq(b).addClass("layui-show").siblings().removeClass("layui-show"));layui.event.call(this,"element","tab("+f+")",{elem:c,index:b})},tabDelete:function(a,b){a=b||e(this).parent();b=a.index();var c=a.parents(".layui-tab").eq(0),d=c.children(".layui-tab-content").children(".layui-tab-item"),g=c.attr("lay-filter");a.hasClass("layui-this")&&(a.next()[0]?f.tabClick.call(a.next()[0],null,b+1):a.prev()[0]&&f.tabClick.call(a.prev()[0],null,b-1));a.remove();d.eq(b).remove();setTimeout(function(){f.tabAuto()},50);layui.event.call(this,"element","tabDelete("+g+")",{elem:c,index:b})},tabAuto:function(){var a=this;e(".layui-tab").each(function(){var b=e(this),c=b.children(".layui-tab-title"),d=(b.children(".layui-tab-content").children(".layui-tab-item"),'lay-stope\x3d"tabmore"'),d=e('\x3cspan class\x3d"layui-unselect layui-tab-bar" '+d+"\x3e\x3ci "+d+' class\x3d"layui-icon"\x3e\x26#xe61a;\x3c/i\x3e\x3c/span\x3e');(a===window&&8!=l.ie&&f.hideTabMore(!0),b.attr("lay-allowClose")&&c.find("li").each(function(){var a=e(this);if(!a.find(".layui-tab-close")[0]){var b=e('\x3ci class\x3d"layui-icon layui-unselect layui-tab-close"\x3e\x26#x1006;\x3c/i\x3e');b.on("click",f.tabDelete);a.append(b)}}),c.prop("scrollWidth")>c.outerWidth()+1)?c.find(".layui-tab-bar")[0]||(c.append(d),b.attr("overflow",""),d.on("click",function(a){c[this.title?"removeClass":"addClass"]("layui-tab-more");this.title=this.title?"":"\u6536\u7f29"})):(c.find(".layui-tab-bar").remove(),b.removeAttr("overflow"))})},hideTabMore:function(a){var b=e(".layui-tab-title");!0!==a&&"tabmore"===e(a.target).attr("lay-stope")||(b.removeClass("layui-tab-more"),b.find(".layui-tab-bar").attr("title",""))},clickThis:function(){var a=e(this),b=a.parents(".layui-nav"),c=b.attr("lay-filter"),d=a.find("a"),g="string"==typeof a.attr("lay-unselect");a.find(".layui-nav-child")[0]||("javascript:;"!==d.attr("href")&&"_blank"===d.attr("target")||g||(b.find(".layui-this").removeClass("layui-this"),a.addClass("layui-this")),layui.event.call(this,"element","nav("+c+")",a))},clickChild:function(){var a=e(this),b=a.parents(".layui-nav"),c=b.attr("lay-filter");b.find(".layui-this").removeClass("layui-this");a.addClass("layui-this");layui.event.call(this,"element","nav("+c+")",a)},showChild:function(){var a=e(this),b=a.parents(".layui-nav"),c=a.parent(),a=a.siblings(".layui-nav-child");b.hasClass("layui-nav-tree")&&(a.removeClass("layui-anim layui-anim-upbit"),c["none"===a.css("display")?"addClass":"removeClass"]("layui-nav-itemed"))},collapse:function(){var a=e(this),b=a.find(".layui-colla-icon"),c=a.siblings(".layui-colla-content"),d=a.parents(".layui-collapse").eq(0),g=d.attr("lay-filter"),f="none"===c.css("display");"string"==typeof d.attr("lay-accordion")&&(d=d.children(".layui-colla-item").children(".layui-show"),d.siblings(".layui-colla-title").children(".layui-colla-icon").html("\x26#xe602;"),d.removeClass("layui-show"));c[f?"addClass":"removeClass"]("layui-show");b.html(f?"\x26#xe61a;":"\x26#xe602;");layui.event.call(this,"element","collapse("+g+")",{title:a,content:c,show:f})}};h.prototype.init=function(a,b){var c=b?'[lay-filter\x3d"'+b+'"]':"";b={tab:function(){f.tabAuto.call({})},nav:function(){var a={},b={},h={},k=function(c,d,f){var g=e(this),m=g.find(".layui-nav-child");d.hasClass("layui-nav-tree")?c.css({top:g.position().top,height:g.children("a").height(),opacity:1}):(m.addClass("layui-anim layui-anim-upbit"),c.css({left:g.position().left+parseFloat(g.css("marginLeft")),top:g.position().top+g.height()-c.height()}),a[f]=setTimeout(function(){c.css({width:g.width(),opacity:1})},l.ie&&10>l.ie?0:200),clearTimeout(h[f]),"block"===m.css("display")&&clearTimeout(b[f]),b[f]=setTimeout(function(){m.addClass("layui-show");g.find(".layui-nav-more").addClass("layui-nav-mored")},300))};e(".layui-nav"+c).each(function(c){var d=e(this),g=e('\x3cspan class\x3d"layui-nav-bar"\x3e\x3c/span\x3e'),n=d.find(".layui-nav-item");d.find(".layui-nav-bar")[0]||(d.append(g),n.on("mouseenter",function(){k.call(this,g,d,c)}).on("mouseleave",function(){d.hasClass("layui-nav-tree")||(clearTimeout(b[c]),b[c]=setTimeout(function(){d.find(".layui-nav-child").removeClass("layui-show");d.find(".layui-nav-more").removeClass("layui-nav-mored")},300))}),d.on("mouseleave",function(){clearTimeout(a[c]);h[c]=setTimeout(function(){d.hasClass("layui-nav-tree")?g.css({height:0,top:g.position().top+g.height()/2,opacity:0}):g.css({width:0,left:g.position().left+g.width()/2,opacity:0})},200)}));n.each(function(){var a=e(this),b=a.find(".layui-nav-child");b[0]&&!a.find(".layui-nav-more")[0]&&a.children("a").append('\x3cspan class\x3d"layui-nav-more"\x3e\x3c/span\x3e');a.off("click",f.clickThis).on("click",f.clickThis);a.children("a").off("click",f.showChild).on("click",f.showChild);b.children("dd").off("click",f.clickChild).on("click",f.clickChild)})})},breadcrumb:function(){e(".layui-breadcrumb"+c).each(function(){var a=e(this),b=a.attr("lay-separator")||"/",c=a.find("a");c.next("span[lay-separator]")[0]||(c.each(function(a){a!==c.length-1&&e(this).after("\x3cspan lay-separator\x3e"+b+"\x3c/span\x3e")}),a.css("visibility","visible"))})},progress:function(){e(".layui-progress"+c).each(function(){var a=e(this),b=a.find(".layui-progress-bar"),c=b.attr("lay-percent");b.css("width",/^.+\/.+$/.test(c)?100*(new Function("return "+c))()+"%":c);a.attr("lay-showPercent")&&setTimeout(function(){b.html('\x3cspan class\x3d"layui-progress-text"\x3e'+c+"\x3c/span\x3e")},350)})},collapse:function(){e(".layui-collapse"+c).each(function(){e(this).find(".layui-colla-item").each(function(){var a=e(this),b=a.find(".layui-colla-title"),a="none"===a.find(".layui-colla-content").css("display");b.find(".layui-colla-icon").remove();b.append('\x3ci class\x3d"layui-icon layui-colla-icon"\x3e'+(a?"\x26#xe602;":"\x26#xe61a;")+"\x3c/i\x3e");b.off("click",f.collapse).on("click",f.collapse)})})}};return b[a]?b[a]():layui.each(b,function(a,b){b()})};h.prototype.render=h.prototype.init;var h=new h,k=e(document);h.render();k.on("click",".layui-tab-title li",f.tabClick);k.on("click",f.hideTabMore);e(window).on("resize",f.tabAuto);p("element",h)});