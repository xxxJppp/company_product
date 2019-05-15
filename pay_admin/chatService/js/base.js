(function() {
	var isAuto = false;
	if(isAuto) {
		window.Request_url=location.protocol+'//'+location.host+'/';
	} else {
		window.Request_url = 'http://192.168.0.113:8010/';
	}
		window.websocket_url = '192.168.0.113:5210';
		window.chat_url = 'http://192.168.0.113:8080/'

})(window)