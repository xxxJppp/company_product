/**
 * 获取项目路径
 */
function getContextPath() {
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var result = pathName.substr(0, index + 1);
	switch(result) {
		case '/components':
		case '/chatService':
			return "";
		default:
			return result;
	}

}

var $Res = {
	httpRoot: `${location.protocol}//${location.host}${getContextPath()}`,
	luchat_url: chat_url,
	luchat_wsUrl: websocket_url,
	getCookieValue: function(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split(";");
		for(var i = 0; i < arrCookie.length; i++) {
			var c = arrCookie[i].split("=");
			if(c[0].replace(/(^\s*)|(\s*$)/g, "") == name) {
				return c[1];
			}
		}
		return "";
	},
	getQueryString:function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
}

window.onload=function login() {
	$.ajax({
		url: `${chat_url}user/login`,
		data: {
			username: ,
			pwd: $('#password').val()
		},
		dataType: 'json',
		type: 'post',
		cache: false,
		success: (data) => {
			$.cookie('userId', data.id, {
				path: '/',
			});
			$.cookie("userName", $('#name').val(), {
				path: "/"
			});
			$('#myIframe').load(`${chat_url}user/chat1`)
		},
		error: (data) => {
			new Error('聊天系统接入失败！');
		}
	})
}