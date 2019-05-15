function login() {
	$.ajax({
		url: `${chat_url}user/login`,
		data: {
			username: $('#name').val(),
			pwd: $('#password').val()
		},
		timeout: 30000,
		dataType: 'json',
		type: 'post',
		cache: false,
		success: (data) => {
			$.cookie('userId', data.me, {
				path: '/',
			});
			$.cookie("userName", $('#name').val(), {
				path: "/"
			});
			alert('登录成功,正在转跳');
			setTimeout(function() {
				window.location.href = 'index.html';
			}, 500);

		},
		error: (data) => {
			new Error('聊天系统接入失败！');
		}
	})

	//	const chatInfo = new Promise((resolve, reject) => { //聊天系统登录
	//		$.ajax({
	//			url: `${chat_url}user/login`,
	//			data: {
	//				username: $('#name').val(),
	//				pwd: $('#password').val()
	//			},
	//			timeout: 30000,
	//			dataType: 'json',
	//			type: 'post',
	//			cache: false,
	//			success: (data) => {
	//				resolve({
	//					login: true
	//				});
	//			},
	//			error: (data) => {
	//				new Error('聊天系统接入失败！');
	//				resolve({
	//					login: false
	//				});
	//			},
	//			complete: (XMLHttpRequest, status) => {
	//				if(status === "timeout") {
	//					resolve({
	//						login: false
	//					});
	//				}
	//			}
	//		})
	//	})
	//	const userInfo = new Promise((resolve, reject) => { //用户登录
	//		$.ajax({
	//			url: `${Request_url}Login/loginAPI`,
	//			data: {
	//				"Username": $('#name').val(),
	//				"Password": $('#password').val()
	//			},
	//			processData: true,
	//			contentType: "application/x-www-form-urlencoded",
	//			dataType: 'json',
	//			type: 'post',
	//			cache: false,
	//			success: (data) => {
	//				let json = data;
	//				chatInfo.then(result => {
	//					resolve($.extend(true, json, result))
	//				}, error => {
	//					resolve($.extend(true, json, result))
	//				});
	//			},
	//			error: (data) => {
	//				reject(data);
	//			},
	//			complete: (XMLHttpRequest, status) => {
	//				if(status === "timeout") {
	//					alert("连接超时，请联系管理员或检查网络设置！")
	//					//console.log(`连接超时，请联系管理员或检查网络设置！`)
	//					reject(data);
	//				}
	//			}
	//		})
	//	})
	//	userInfo.then((data) => {
	//		if(!data.login) {
	//			new Error('聊天系统连接失败');
	//		}
	//		if(data.status == "OK") {
	//			$.cookie("userName", data.dataList.username, {
	//				expires: 2,
	//				path: "/"
	//			});
	//			let date = new Date();
	//			date.setTime(date.getTime() + (300000));
	//			$.cookie('user_token', data.dataList.user_token, {
	//				path: '/',
	//				expires: date
	//			});
	//			$.cookie('userId', data.dataList.me, {
	//				path: '/',
	//			});
	//			alert('登录成功,正在转跳');
	//			setTimeout(function() {
	//				window.location.href = 'index.html';
	//			}, 500);
	//		} else {
	//			if(data.status == "ERROR") {
	//				alert(data.errMessage)
	//				return false;
	//			}
	//		}
	//	}, (data) => {
	//		alert(`系统错误，请联系管理员!`);
	//	})

}

$('#button').click(function() {
	login()
})