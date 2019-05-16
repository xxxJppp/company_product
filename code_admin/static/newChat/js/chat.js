let faces = function(key) {
	var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"];
	return `img/face/${alt.indexOf(key)}.gif`;

}
/**
 * 输入框文字改变
 */
let textChange= function(StringText) {
	let content = StringText;
	var html = function(end) {
		return new RegExp('\\n*\\[' + (end || '') + '(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
	};
	content = (content || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
		.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
		.replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
		.replace(/face\[([^\s\[\]]+?)\]/g, function(face) { //转义表情
			var alt = face.replace(/^face/g, '');
			return '<img alt="' + alt + '" title="' + alt + '" src="' + faces(alt) + '">';
		})
		.replace(/img\[([^\s]+?)\]/g, function(img) { //转义图片
			let imgUrl = img.replace(/(^img\[)|(\]$)/g, '');
			return '<img class="layui-layim-photos" src="' + imgUrl + '" layer-src="' + imgUrl + '">';
		})
		.replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str) { //转义链接
			var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
			var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
			if(!href) return str;
			return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
		}).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
		.replace(/\n/g, '<br>') //转义换行 
	return content;

}

layui.use('layer', () => {
	var layer = layui.layer;
	var chat = null;
	var newDate = (+new Date());
	var charGroupInfo = {};
	var isTourist = null;
	// XMPP连接
	var connection = null;
	// 当前状态是否连接
	window.top.xmpp_connected = false;
	// 当前状态提示状态层
	window.top.BOSH_SERVICE_INDEX = null;
	// 当前登录的JID
	var jname = "";
	var jid = "";
	var javatar = "";
	var jpwd = "";
	var lastSendDate = 0;
	var errmsglayer = null;
	var thisFirst = 1;
	let x2js = new X2JS();
	// 连接状态改变的事件
	function onConnect(status) {
		connection.xmlInput = function(data) {
			if($.nodeName(data, 'iq') && $(data).children().length == 1) {
				if($.nodeName($(data).children().eq(0)[0], 'body') && $(data).children().eq(0)[0].getAttribute('xmlns') == 'lottery') {
					let html = JSON.parse($(data).children().eq(0).text());
					if(html.type == 1) { //分组信息
						charGroupInfo = html;
						initClass();
					} else if(html.type == 2) { //上下线
						chat.changeStatus(html)
					}
				}
			}
		};
		if(status == Strophe.Status.ERROR) {
			console.log('出现错误')
		} else if(status == Strophe.Status.CONNECTING) { //1
			console.log('正在链接')
		} else if(status == Strophe.Status.CONNFAIL) { //2
			console.log('连接尝试失败')
		} else if(status == Strophe.Status.DISCONNECTING) { //7
			console.log('当前正在终止连接')
		} else if(status == Strophe.Status.DISCONNECTED) { //6
			window.top.xmpp_connected = false;
			LoginXmpp({
				username: jname,
				userId: jid,
				avatar: javatar,
				plainpassword: jpwd
			})
			console.log('连接已终止')
		} else if(status == Strophe.Status.AUTHFAIL) {
			console.log('身份验证失败');
			window.top.layer.close(window.top.BOSH_SERVICE_INDEX);
			layer.msg(`身份验证失败`, {
				icon: 2,
				time: 1500
			});
		} else if(status == Strophe.Status.CONNECTED) { //5
			window.top.xmpp_connected = true;

			if(isTourist) {
				setTimeout(() => {
					parent.layer.close(window.top.BOSH_SERVICE_INDEX);
					$('#p_myIframe', parent.document).show(() => {
						layer.msg('恭喜你,链接成功', {
							icon: 1,
							time: 1500
						})
					}).find('#myIframe').addClass('layui-anim-up layui-anim');
				}, 3000)
			}
			thisFirst++;
			connection.addHandler(onMessage, null, 'message', null, null, null);
			connection.send($pres().tree());
		}
	}

	function onMessage(msg) {
		var elems = msg.getElementsByTagName('body');
		if(elems.length != 0) {
			var from = msg.getAttribute('from').split('@')[0];
			var to = msg.getAttribute('to').split('@')[0];
			var from_Avatar = elems[0].getAttribute('from_Avatar');
			var to_Avatar = elems[0].getAttribute('to_Avatar');
			var userTemlteEl = elems[0].getAttribute('userTemlteEl');
			var msgId = elems[0].getAttribute('msgId');
			let msgObj = {
				"me": {
					"username": to,
					"content": "",
					"Avatar": to_Avatar
				},
				"to": {
					"username": from,
					"content": $(elems[0]).text(),
					"Avatar": from_Avatar
				},
				"from": "to",
				"userTemlteEl": userTemlteEl,
				msgId
			}
			chat.msgControlCenter(msgObj, undefined, undefined, false, userTemlteEl, true);
			if($('#p_myIframe', parent.document).css('display') == "none") {
				let msg = $(elems[0]).text();
				if(/face\[([^\s\[\]]+?)\]/g.test(msg)) { //转义表情
					msg = msg.replace(/face/g, '表情')
				}
				if(/img\[([^\s]+?)\]/g.test(msg)) { //验证是不是图片
					msg = '您有新的图片消息，请注意查看！';
				}
				$('#notification', parent.document).show().text(msg).attr('data-class', msgObj.userTemlteEl);
				$('#ChatMsgPrompt', parent.document).addClass('layui-anim-scaleSpring chat-anim layui-anim-loop layui-anim');
			}
		}
		return true;
	}

	/*登录用户*/
	window.LoginXmpp = function(data) {
		if(isNaN(data.avatar)) {
			console.log('没有头像');
		}
		$('.headImg>img').attr('src', `img/peoples/people${data.avatar}.png`);
		$('.user_title_name').text(data.name);
		return new Promise((resolve) => {
			jname = data.username;
			jid = data.userId;
			javatar = data.avatar;
			jpwd = data.plainpassword;
			connection = new Strophe.Connection(window.top.BOSH_SERVICE);
			connection.connect(data.username + window.suffixPath + '/web' + newDate, data.plainpassword, onConnect);
			resolve();
		})
	}

	class Chat {
		constructor(wc) {
			this.bandEv();
			this.mouse = 0;
			this.x2js = new X2JS();
		}
		getContextPath() {
			return `${location.protocol}//${location.host}/`;
		}
		/**
		 * 获取cook中指定参数的值
		 */
		static getCookieValue(name) {
			var strCookie = document.cookie;
			var arrCookie = strCookie.split(";");
			for(var i = 0; i < arrCookie.length; i++) {
				var c = arrCookie[i].split("=");
				if(c[0].replace(/(^\s*)|(\s*$)/g, "") == name) {
					return c[1];
				}
			}
			return "";
		}
		/**
		 * 获取光标位置
		 */
		getPosition(element) {
			let cursorPos = 0;
			if(document.selection) { //IE
				var selectRange = document.selection.createRange();
				selectRange.moveStart('character', -element.value.length);
				cursorPos = selectRange.text.length;
			} else if(element.selectionStart || element.selectionStart == '0') {
				cursorPos = element.selectionStart;
			}
			this.mouse = cursorPos;
			return cursorPos;
		}
		/**
		 * 写入聊天记录到本地储存中
		 */
		WriteAndReadChatHistory(history) {
			//判断当前是否支持本地储存，不支持则不写入
			if(window.localStorage) {
				let hhyangHistory = localStorage.getItem('hhyangHistory');
				if(hhyangHistory === null) { //当前还没有存储数据， 必须重新存储
					hhyangHistory = {
						root: {}
					};
				} else {
					hhyangHistory = JSON.parse(hhyangHistory);
				}
				if(history == undefined) { //直接读取数据
					return hhyangHistory;
				}
				let key = history.userTemlteEl; //聊天模板class 作为key
				let templateData = hhyangHistory.root[key]; //获取当前数据是否存在
				if(templateData == undefined) { //这是一个空的聊天模板，没有任何聊天数据
					hhyangHistory.root[key] = [];
				}
				/**
				 * 2018年12月16日18:46:43 新增防止多页面开发聊天页面时带来的聊天记录重复问题
				 */
				for(let i = 0; i < hhyangHistory.root[key].length; i++) {
					let item = hhyangHistory.root[key][i];
					if(item.msgId == history.msgId) { //这条消息已经存在了
						return false; //不需要存起来
					}
				}
				hhyangHistory.root[key].push(history);
				localStorage.setItem('hhyangHistory', JSON.stringify(hhyangHistory));
			}
		}
		/**
		 * 接发消息控制中心
		 */
		msgControlCenter(msgObj, from, content, auto = false, userTemlteEl, isHistory) {
			let str = `<li class="clearfix">`;
			if(msgObj == undefined) { //发送消息
				let el = $('#conLeft .bg');
				msgObj = {
					"me": {
						"username": jname,
						"userId": jid,
						"content": "",
						"Avatar": javatar
					},
					"to": {
						"username": $.trim(el.find('.intername').attr('data-name')),
						"userId": el.attr('data-userid'),
						"content": "",
						"Avatar": el.attr('data-avatar')
					},
					from,
					msgId: +new Date()
				}
				msgObj[from].content = content;

			}
			if(msgObj.from == "me") {
				str += `<img src="img/peoples/people${msgObj['me'].Avatar}.png" class="answers_head"><div class="answers">`;
			} else {
				str += `<img src="img/peoples/people${msgObj['to'].Avatar}.png" class="news_head"><div class="news">`;
			}
			let msgKey = msgObj.from; //获取需要显示的key;
			str += `${textChange((msgObj[msgKey].content)+"")}</div></li>`;
			$('.' + userTemlteEl).append(str);
			let height = $('.' + userTemlteEl)[0].scrollHeight;
			msgObj.userTemlteEl = userTemlteEl;
			if(isHistory) {
				this.WriteAndReadChatHistory(msgObj); //写入本地储存
			}
			if(from != undefined) {
				var msg = $msg({
					to: `${msgObj.to.username}${window.suffixPath}`,
					from: `${msgObj.me.username}${window.suffixPath}`,
					type: 'chat'
				}).c("body", {
					'from_Avatar': msgObj.me.Avatar,
					'to_Avatar': msgObj.to.Avatar,
					'userTemlteEl': `hhyangUser${jname}`,
					'toUserId': jid, //此参数为客服专用
					'msgId': msgObj.msgId //此参数为客服专用,用于存储客服聊天记录的
				}, content)
				connection.send(msg.tree());
			} else {
				if(!auto) {
					this.unreadMsgNotice(userTemlteEl); //设置消息提示及未读显示
				}
			}
			$('#RightCont').scrollTop(height);
			return true;
		}
		/**
		 *消息通知及未读消息 
		 */
		unreadMsgNotice(textEl) {
			let el = $(`.user[data-class=${textEl}]`);
			if(!el.hasClass('bg')) { //判断当前用户是不是在和自己处于聊天的，必须是在隐藏的情况下显示消息盒子小红点
				el.find('.liLeft').addClass('moreMsg');
				let pel = el.parents('dd');
				if(!pel.hasClass('active')) {
					pel.addClass('tab-cont active layui-anim-upbit layui-anim');
					pel.prev().find('.tab-title').addClass('active');
					$('#conLeft').scrollTop(el.offset().top - 220);
				}
			}
			$('#pAudio').html(`<audio autoplay id="audio" src="${this.getContextPath()}newChat/mp3/default.mp3"></audio>`)
		}
		/**
		 * 生成聊天模板
		 */
		createTemplte(data) {
			let columns = {
				cs: {
					name: "在线客服",
				},
				sub: {
					name: "我的下级"
				},
				super: {
					name: "我的上级"
				},
			}
			charGroupInfo.status = {};
			let RightContHtml = '',
				conLeftHtml = '';
			for(let item in data) {
				if(data[item].length == 0) {
					continue;
				}
				data[item].name = columns[item].name; //后台不按照我规定的格式返回，我只能自己造了
				data[item].online = 0;
				data[item].Total = data[item].length;
				for(let j = 0; j < data[item].length; j++) {
					if(item == 'cs') { //客服，我们来伪造名字，哈哈哈
						let index = parseInt(Math.random() * window.csInfoNames.length);
						data[item][j].fakeName = window.csInfoNames[index];
						window.csInfoNames.splice(index, 1);
					}
					if(data[item][j].status == "on") { //排序一下 让在线的排在最前面
						let currentItem = data[item][j];
						data[item].splice(j, 1);
						data[item].unshift(currentItem);

						data[item].online++
					}
					//重构数据，方便下次更新用户状态
					let status = [];
					status.push(item); //所在分组
					status.push(j); //索引
					charGroupInfo.status[`${data[item][j].id}`] = status
				}

				let RightCont = ''; //右侧聊天模板；
				let html = `<div class="tab-div"><dl><dt><div class="tab-title"><span class="tabicon"></span>`;
				html += `<span class="tabName">${data[item].name}</span>`;
				if(item == 'cs') { //客服不显示在线状态
					html += `<span class="tabpop" style="display:none">`;
				} else {
					html += `<span class="tabpop">`;
				}
				html += `<span class="online">${data[item].online}</span>/<span class="leave">${data[item].Total}</span>`;
				html += `</span></div></dt><dd class="tab-cont"><ul>`;
				for(let i = 0; i < data[item].length; i++) {
					let userItem = data[item][i];
					let userName = userItem.name;
					let titleName = userName;
					if(item == 'cs') {
						userName = userItem.fakeName;
					}
					RightCont += `<ul class="newsList hhyangUser${titleName}"></ul>`;
					html += `<li  class="user" data-class="hhyangUser${titleName}" data-avatar="${userItem.avatar}" data-userid="${userItem.id}">`;
					html += `<div class="liLeft ${userItem.status}"><img src="img/peoples/people${userItem.avatar}.png"></div>`;
					html += `<div class="liRight"><span class="intername" data-name="${titleName}">${userName}</span>`;
					html += `<span class="infor"></span></div></li>`
				}
				html += `</ul></dd></dl></div>`;
				RightContHtml += RightCont;
				conLeftHtml += html;
			}
			$('#RightCont').html(RightContHtml)
			$('#conLeft').html(conLeftHtml);
			this.showTemplte();
		}
		/**
		 * 显示指定聊天模板
		 */
		showTemplte(group = '.tab-title:eq(0)', user) {
			if(user == undefined) {
				let p_el = $(group).addClass('active').parents('.tab-div');
				p_el.find('.tab-cont').addClass('active layui-anim-upbit layui-anim'); //tab头部
				let chatTemplte = p_el.find('.user').eq(0).addClass('bg').attr('data-class'); //用户并获取需要显示的聊天板块
				$('#RightCont .newsList').removeClass('active layui-anim-upbit layui-anim');
				$(`#RightCont .${chatTemplte}`).addClass('active').html('');
				this.showHistory(chatTemplte);
			}
		}
		/**
		 * 更新指定用户的在线信息
		 */
		changeStatus(status) {
			try {
				let key = status.user.id
				let val = charGroupInfo.status[key];
				charGroupInfo.list[val[0]].splice(val[1], 1, status.user) //更新原有的数据
				let name = status.user.name;
				let el = $(`.user[data-class="hhyangUser${name}"]`);
				el.find('.liLeft').removeClass('off on').addClass(status.user.status);
				let cloneHtml = el.clone();
				el.parent().prepend(cloneHtml);
				let titleEl = el.parents('.tab-div');
				el.remove();
				//更新栏目在线人数
				titleEl.find('.online').text(titleEl.find('.on').length);
			} catch(e) {
				//TODO handle the exception
			}
		}
		/**
		 * 显示聊天记录并滚动到底部
		 */
		showHistory(chatTemplte) {
			//显示当前模板下面的已知聊天记录
			let history = this.WriteAndReadChatHistory().root[chatTemplte]; //获取到已知的聊天记录
			if(history == undefined) {
				return
			}
			for(let i = 0; i < history.length; i++) {
				this.msgControlCenter(history[i], undefined, undefined, true, chatTemplte, false);
			}
			let height = $(`#RightCont .${chatTemplte}`)[0].scrollHeight;
			$('#RightCont').scrollTop(height);
		}
		/**
		 * 上传图片
		 */
		uploadImage(FormData) {
			$.ajax({
				type: "post",
				url: `${window.location_url}Login/upload_images`,
				async: true,
				processData: false,
				contentType: false,
				data: FormData,
				success: (data) => {
					let ResourcePath = window.top.getContextPath();
					this.msgControlCenter(undefined, 'me', `img[${Request_url}${data.dataList}]`, false, $('.bg').attr('data-class'), true);
					layer.closeAll();
				},
				error: (data) => {
					layer.closeAll();
					console.log('上传图片失败')
				}
			});
		}
		/**
		 * 发送频率限制
		 */
		sendFreqlimit() {
			let nowDate = +new Date();
			if(lastSendDate != 0) {
				if(nowDate - lastSendDate < 3000) {
					errmsglayer = layer.msg('您发送的频率太快了', {
						icon: 7,
						time: 1500
					})
					return false
				}
			}
			layer.close(errmsglayer);
			lastSendDate = nowDate;
			return true;
		}
		bandEv() {
			//图片显示层
			$('html').on('click', '.layui-layim-photos', (e) => {
				let indexEl = $(e.currentTarget).parents('.newsList');
				let currentSrc = $(e.currentTarget).attr('src');
				let photos = {
					"title": "",
					"id": 123,
					"start": 0,
					"data": []
				}
				indexEl.find('.layui-layim-photos').each((index, item) => {
					let src = $(item).attr('src');
					if(src == currentSrc) {
						photos.start.index;
					}
					photos.data.push({
						"alt": "",
						"pid": index,
						"src": src,
						"thumb": ""
					});
				})
				window.top.$hhyangUtil.showPhotos(photos);
			})
			//左侧导航栏tab显示及隐藏
			$('html').on('click', '.tab-title', (e) => {
				$(e.currentTarget).toggleClass('active');
				$(e.currentTarget).parents('.tab-div').find('.tab-cont').toggleClass('active layui-anim-upbit layui-anim');
			})
			//表情添加到输入框内
			$('#layim-face li').on('click', (e) => {
				let face = `face${$(e.currentTarget).attr('title')}`;
				let text = $('#dope').val().split('');
				text.splice(this.mouse, 0, face);
				$('#dope').val(text.join('')).click();
				e.stopPropagation();
			})
			//获取鼠标坐标位置
			$('#dope').on('input', (e) => {
				this.getPosition(e.currentTarget);
			})
			//获取鼠标坐标位置
			$('#dope').on('click', (e) => {
				this.getPosition(e.currentTarget);
			})
			//获取当前指定用户的聊天模板
			$('html').on('click', '.user', (e) => {
				$(e.currentTarget).find('.liLeft').removeClass('moreMsg');
				$('.user').removeClass('bg');
				let chatTemplte = $(e.currentTarget).addClass('bg').attr('data-class');
				$('#RightCont .newsList').removeClass('active');
				$(`#RightCont .${chatTemplte}`).addClass('active').html('');
				this.showHistory(chatTemplte); //显示聊天记录
			})
			//发送按钮
			$('html').on('click', '#sendBtn', () => {
				let news = $.trim($('#dope').val());
				if(news == '') {
					return false;
				}
				if(!this.sendFreqlimit()) {
					return false;
				}
				let key = $('.bg').attr('data-class');
				this.msgControlCenter(undefined, 'me', $('#dope').val(), false, key, true);
				$('#dope').val('');
			})
			//回车按钮发送
			$('html').keydown((e) => {
				if(e.keyCode == 13) {
					let news = $.trim($('#dope').val());
					if(news != '') {
						$('#sendBtn').trigger('click');
						e.stopPropagation();
						e.preventDefault();
					}

				}
			})
			//图片上传按钮
			$('html').on('change', '#files', (e) => {
				layer.msg('正在处理,请稍后', {
					icon: 16,
					time: false,
					shade: [0.1, 'transparent']
				})
				let formData = new FormData();
				formData.append('upload', $(e.currentTarget)[0].files[0]);
				$(e.currentTarget).remove();
				$('#files_li').append(`<input type="file" id="files" name="files" accept="image/png,image/jpeg,image/gif"/>`)
				if(!this.sendFreqlimit()) {
					return false;
				}
				this.uploadImage(formData);
			})
			//点击表情显示表情
			$('#face').click((e) => {
				$('#emjon').show().addClass('layui-anim-scale layui-anim');
				setTimeout(() => {
					$('#emjon').removeClass('layui-anim-scale layui-anim');
				}, 300)
				e.stopPropagation();
			})
			//
			$('body').on('click', (e) => {
				if($('#emjon').css('display') == "block") {
					$('#emjon').hide();
				}
			})
		}
	}

	let initChat = window.top.initChat = function(Tourist = false) {
		return new Promise((resolve) => {
			if(Tourist) { //游客
				isTourist = true;
				getTouristInfo().then(() => {
					resolve();
				})
			} else {
				isTourist = false;
				LoginXmpp({
					username: Chat.getCookieValue('userName'),
					name: Chat.getCookieValue('show_Name'),
					plainpassword: Chat.getCookieValue('chat_pwd'),
					userId: Chat.getCookieValue('userId'),
					avatar: Chat.getCookieValue('avatar')
				}).then(() => {
					resolve();
				})
			}
		})
	}
	let initClass = function() {
		if(chat === null) {
			chat = new Chat(window);
			chat.createTemplte(charGroupInfo.list);
		}
	}

	/**
	 * 获取游客信息
	 */
	function getTouristInfo() {
		return new Promise((resolve) => {
			$.ajax({
				type: "post",
				url: `${window.location_url}Login/visitor`,
				async: true,
				success: (data) => {
					data.dataList.avatar = data.dataList.picture;
					data.dataList.userId = data.dataList.username;
					delete data.dataList.picture;
					LoginXmpp(data.dataList).then(() => {
						resolve();
					})
				}
			});
		})
	}
	if(Chat.getCookieValue('code_token') != '') { //不好意思，我是游戏的主人 我有账号，请给我直接接入聊天
		initChat();
	}
	//关闭按钮
	$('html').on('click', '#close', (e) => {
		$('#p_myIframe', window.parent.document).hide();
	})
	//聊天提示点击显示聊天窗口并指定到当前用户
	$('body', parent.document).on('click', '#notification', (e) => {
		let userClass = $(e.currentTarget).hide().attr('data-class');
		let currentEl = $(`.user[data-class=${userClass}]`);
		let pEl = currentEl.parents('.tab-div');
		$('#p_myIframe', window.parent.document).show();
		$('#ChatMsgPrompt', parent.document).removeClass('layui-anim-scaleSpring chat-anim layui-anim-loop layui-anim');
		currentEl.click();
		pEl.click();
		let pOtherEls = pEl.siblings();
		pOtherEls.find('.tab-title.active').removeClass('active');
		pOtherEls.find('.tab-cont.active.layui-anim-upbit.layui-anim').removeClass('active layui-anim-upbit layui-anim');
	})
	//显示聊天
	$('body', parent.document).on('click', '.showChat', () => {
		$('#ChatMsgPrompt', parent.document).removeClass('layui-anim-scaleSpring chat-anim layui-anim-loop layui-anim');

		window.top.BOSH_SERVICE_INDEX = parent.layer.msg('正在为您接入客服,请稍后...', {
			icon: 16,
			time: false,
			shade: [0.6, '#000'],
		})
		if(!window.top.xmpp_connected) { //未链接聊天
			if(Chat.getCookieValue('code_token') == '') { //未登录，需要获取游客账号
				initChat(true);
			}
		} else { //已经接入了聊天直接显示
			// setTimeout(() => {
			// 	parent.layer.close(window.top.BOSH_SERVICE_INDEX);
			// 	$('#p_myIframe', window.parent.document).show();
			// 	layer.msg('客服接入成功!', {
			// 		icon: 1,
			// 		time: 1500
			// 	})
			// }, 3000)
							parent.layer.close(window.top.BOSH_SERVICE_INDEX);
							$('#p_myIframe', window.parent.document).show();
							layer.msg('客服接入成功!', {
								icon: 1,
								time: 1500
							})
		}
	});
})