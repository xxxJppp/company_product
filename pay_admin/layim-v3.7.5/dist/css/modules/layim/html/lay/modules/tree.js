/** layui-v2.2.45 MIT License By http://www.layui.com */layui.define("jquery",function(m){var f=layui.$,n=layui.hint(),b=function(a){this.options=a},k=["\x26#xe623;","\x26#xe625;"],p=["\x26#xe626;","\x26#xe627;"],q=["\x26#xe62b;","\x26#xe62a;"],l=["\x26#xe622;","\x26#xe624;"];b.prototype.init=function(a){a.addClass("layui-box layui-tree");this.options.skin&&a.addClass("layui-tree-skin-"+this.options.skin);this.tree(a);this.on(a)};b.prototype.tree=function(a,d){var c=this,g=c.options;layui.each(d||g.nodes,function(d,e){d=e.children&&0<e.children.length;var h=f('\x3cul class\x3d"'+(e.spread?"layui-show":"")+'"\x3e\x3c/ul\x3e'),b=f(["\x3cli "+(e.spread?'data-spread\x3d"'+e.spread+'"':"")+"\x3e",d?'\x3ci class\x3d"layui-icon layui-tree-spread"\x3e'+(e.spread?k[1]:k[0])+"\x3c/i\x3e":"",g.check?'\x3ci class\x3d"layui-icon layui-tree-check"\x3e'+("checkbox"===g.check?p[0]:"radio"===g.check?q[0]:"")+"\x3c/i\x3e":"",'\x3ca href\x3d"'+(e.href||"javascript:;")+'" '+(g.target&&e.href?'target\x3d"'+g.target+'"':"")+"\x3e"+('\x3ci class\x3d"layui-icon layui-tree-'+(d?"branch":"leaf")+'"\x3e'+(d?e.spread?l[1]:l[0]:"\x26#xe621;")+"\x3c/i\x3e")+("\x3ccite\x3e"+(e.name||"\u672a\u547d\u540d")+"\x3c/cite\x3e\x3c/a\x3e"),"\x3c/li\x3e"].join(""));d&&(b.append(h),c.tree(h,e.children));a.append(b);"function"==typeof g.click&&c.click(b,e);c.spread(b,e);g.drag&&c.drag(b,e)})};b.prototype.click=function(a,d){var c=this.options;a.children("a").on("click",function(a){layui.stope(a);c.click(d)})};b.prototype.spread=function(a,d){var c=(this.options,a.children(".layui-tree-spread")),g=a.children("ul"),b=a.children("a");d=function(){a.data("spread")?(a.data("spread",null),g.removeClass("layui-show"),c.html(k[0]),b.find(".layui-icon").html(l[0])):(a.data("spread",!0),g.addClass("layui-show"),c.html(k[1]),b.find(".layui-icon").html(l[1]))};g[0]&&(c.on("click",d),b.on("dblclick",d))};b.prototype.on=function(a){var d=this,c=d.options;a.find("i").on("selectstart",function(a){return!1});c.drag&&f(document).on("mousemove",function(a){var c=d.move;if(c.from){var e=(c.to,f('\x3cdiv class\x3d"layui-box layui-tree-drag"\x3e\x3c/div\x3e'));a.preventDefault();f(".layui-tree-drag")[0]||f("body").append(e);e=f(".layui-tree-drag")[0]?f(".layui-tree-drag"):e;e.addClass("layui-show").html(c.from.elem.children("a").html());e.css({left:a.pageX+10,top:a.pageY+10})}}).on("mouseup",function(){var a=d.move;a.from&&(a.from.elem.children("a").removeClass("layui-tree-enter"),a.to&&a.to.elem.children("a").removeClass("layui-tree-enter"),d.move={},f(".layui-tree-drag").remove())})};b.prototype.move={};b.prototype.drag=function(a,d){var c=this,b=(c.options,a.children("a")),h=function(){var e=f(this),b=c.move;b.from&&(b.to={item:d,elem:a},e.addClass("layui-tree-enter"))};b.on("mousedown",function(){c.move.from={item:d,elem:a}});b.on("mouseenter",h).on("mousemove",h).on("mouseleave",function(){var a=f(this),b=c.move;b.from&&(delete b.to,a.removeClass("layui-tree-enter"))})};m("tree",function(a){var d=new b(a=a||{}),c=f(a.elem);return c[0]?void d.init(c):n.error("layui.tree \u6ca1\u6709\u627e\u5230"+a.elem+"\u5143\u7d20")})});