/**
 * 全局方法
 */
class base_methods {
	constructor(data, Vue) {
		this.data = data;
		this.Vue = Vue;

		this.init();
	}

	
	
	init() {
		/**
		 * 点击打开layer图层
		 */
		$('body').on('click', '.layui-layim-photos', (e) => {
			let imgSrc = $(e.currentTarget).attr('layer-src');
			
			let img = new Image();
			img.src = imgSrc;
			new Promise((resolve) => {
				img.onload = function() {
					img = null;
					resolve(true)
				}
				img.onerror = function() {
					img = null;
					resolve(false)
				}
			}).then(data => {
				if (!data) {
					layer.msg('当前图片地址异常', {icon: 2, time: 1500});
				} else {
					layer.photos({
						photos: {
							"title": "图片", //相册标题
							"id": 123, //相册id
							"start": 0, //初始显示的图片序号，默认0
							"data": [   //相册包含的图片，数组格式
								{
									"alt": "图片",
									"pid": 666, //图片id
									"src": imgSrc, //原图地址
									"thumb": imgSrc //缩略图地址
								}
							]
						} //格式见API文档手册页
					});
				}
			})
		})
	}

	/**
	 * 生成随机码
	 * a-z|A-z|0-9
	 * number: 随机密码个数
	 */
	getRandomPass(number) {
		const ARR = [1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','s','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','S','Y','Z'];

		let pass = '';

		while(pass.length < number) {
			let r = Math.floor(Math.random() * ARR.length);
			let index = r <= 0 ? r : r - 1;
			pass += ARR[index];
		}

		return pass;
	}

	/**
	 * 检测数据类型
	 */
	check_type(data) {
		return Object.prototype.toString.call(data).slice(8,-1)
	}

	/**
	 * 范围时间代码
	 */
	getRangeTime(count) {
		// 拼接时间
		let time1 = new Date()
		time1.setTime(time1.getTime())
		let Y1 = time1.getFullYear()
		let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
		let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
		let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
		let time2 = new Date()
		time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
		let Y2 = time2.getFullYear()
		let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
		let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
		let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
		return {
			t1: timer1,
			t2: timer2
		}
	}

	/**
	 * 获取字符串长度
	 */
	getStringLength(str) {
		if (str === null || str === undefined || str.length <= 0) {
			return 0;
		}

		let length = 0;

		for(let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255) {
				length += 1;
			} else {
				length += 0.5;
			}
		}

		return length;
	}

	/**
	 * 获取前n个月的第一天和最后一天
	 * n: 获取n个月前
	 * range: 范围
	 */
	getPastMonth(n, range = 'day') {
		let nowdays = new Date(),
			year = nowdays.getFullYear(),	// 现在的年份
			month = nowdays.getMonth();		// 现在的月份
		
		if (n > 1) {
			month -= (n - 1);
		}

		(function judgeMonth() {
			if (month <= 0) {
				month = 12 + (month < 0 ? month : 0);
				year = year - 1;
				if(month <= 0) {
					judgeMonth()
				}
			}
		}())

		if (month < 10) {
			month = '0' + month;
		}
		let myDate = new Date(year,month,0);

		switch (range) {
			case 'month':
				return `${year}年${month}月`; //上个月月份
			break;
			case 'day':
				return {
					start: `${year}-${month}-01`, //上个月第一天
					end: `${year}-${month}-${myDate.getDate()}` //上个月最后一天
				}
			break;
		}
		
	}

	/** 
	 * 提示框
	 */
	hint_layer(text, icon) {
		layer.msg(text, { icon, time: 1500 });
	}


	/**
	 * 转换时间
	 */
	toggle_time(that, key='form') {
		if(that[key].date && this.check_type(that[key].date) === 'Array' && that[key].date.length >= 2) {
			that[key].start_time = that[key].date[0];
			that[key].end_time = that[key].date[1];
		} else {
			that[key].start_time = '';
			that[key].end_time = '';
		}
	}

	/**
	 * 通用信息编辑弹框
	 */
	e_layer({type = 1,title, id = '', content, btn = ['确认', '取消'], btn1, btn2, area = ['800px', '600px'], success = ()=>{}}) {
		layer.open({
			type,
			btn,
			btn1,
			btn2,
			title,
			area,
			shadeClose: true, //点击遮罩关闭
			content: `
				<style>
					body .layui-layer-btn {
						position: absolute;
						bottom: 6px;
						right: 0;
					}
					.s_container{
						width: 100px;
						height: 40px;
						border: 1px solid #ccc;
						border-radius: 5px;
						position: relative;
					}
					.c_select{
						border: none;
						outline: none;
						width: 100%;
						border-radius: 5px;
						height: 38px;
						line-height: 38px;
						appearance: none;
						padding-left: 10px;
					}
					.e_layer_container {
						padding: 30px;
						height: 470px;
					}
					.e_layer_container span.l_title {
						display: inline-block;
						width: 50px;
						font-weight: bold;
					}
					.e_layer_container span.l_title_big {
						display: inline-block;
						width: 100px;
						font-weight: bold;
					}
					.e_layer_container input.l_p {
						display: inline-block;
						padding: 0 15px;
						width: 250px;
						height: 40px;
						line-height: 40px;
						border: 1px solid #dcdfe6;
						border-radius: 4px;
						color: #606266;
					}
					.e_layer_container input.l_p::-webkit-inner-spin-button {
						-webkit-appearance: none !important;
						margin: 0;
					}
					.e_layer_container input.l_sort {
						width: 100px;
					}
					.e_layer_container input.l_sort_big {
						width: 300px;
					}
					.e_layer_container label {
						position: relative;
						width: 100%;
						margin-bottom: 20px;
					}
					.e_layer_container textarea {
						border: 1px solid #dcdfe6;
						padding: 6px 10px;
						border-radius: 4px;
						color: #606266;
					}
					.e_layer_container .l_t {
						width: 90%;
					}
					.e_layer_container .s_l_t {
						width: 86%;
					}
					.e_layer_container .auto {
						width: auto;
					}
					.e_layer_container .sub_msg {
						position: absolute;
						top: 100%;
						left: 105px;
						color: red;
						font-size: 12px;
					}
				</style>
				<div class="e_layer_container">
					${content}
				</div>
			`,
			success: success
		});
	}

	/**
	 * 查看二维码
	 */
	lookQrcode({url, money, nickname}) {
		this.Vue.prototype.$axios.post(`Code_provider/qrcode_images`, {
			url: url
		})
		.then(data => {
			const JSON = {
				data: [
					{
						alt: false,
						src: data.url, //原图地址
						thumb: data.url //缩略图地址
					}
				]
			};

			layer.photos({
				title: [`￥${money} ${nickname == '' ? '' : `(${nickname})`}`, 'font-size:20px; font-weight: bold; text-align: center; padding: 0'],
				area: ['300px', '350px'],
				photos: JSON,
				shade: 0.5,
				anim: 5
			});

		});
	}

	/**
	 * 日工资、分红备注弹框
	 */
	textarea_layer(requestUrl, {remark, mustArgs, callBack, limit=100}) {
		layer.open({
			type: 1,
			btn: ['确认'],
			title: '备注',
			area: ['400px', '280px'],
			content: `
				<div class="textarea-layer">
					<span>提示：备注最长为 ${limit} 个字符</span>
					<textarea class="t_content">${remark == '' ? '' : remark}</textarea>
				</div>
			`,
			success: () => {
				$('.textarea-layer .t_content').on('input', function() {
					let val = $(this).val();
					if(val.length > limit) {
						$(this).val(val.slice(0, limit));
					}
				})
			},
			btn1: (index) => {
				const reqData = Object.assign({
					remark: $('.textarea-layer .t_content').val()
				}, mustArgs)

				this.Vue.prototype.$axios.post(requestUrl, reqData).then(res => {
					if (!res) {
						layer.close(index)
						setTimeout(() => {callBack();}, 1500)
					}
				})
			}
		});
	}

	/**
	 * 权限管理按钮
	 */
	auth_btn() {
		if (!window.__firstRender) {
			$('.common_tbody').css('visibility', 'hidden');
		}

		
		let timeId = setInterval(() => {
			let pid = $('#left_nav .router-link-active').parent().data('id');
			if (window.$btn_list && pid) {
				clearInterval(timeId);
				let arr = window.$btn_list.filter(item => {
					return item.pid == pid
				})
				let flag = false;
				// console.log(arr)

				$(arr).each((index, item) => {
					if (item.status == 1) {
						$(`.${item.class}`).show();
						flag = true;
					} else {
						$(`.${item.class}`).remove();
					}
				})
				if(!flag) {
					$('.control_C, .control_T, .control_W').remove();
					$('.admin-biaogelist').show();
					setTimeout(() => {layer.closeAll('loading')}, 10)
					$('.common_tbody').css('visibility', 'visible');
				} else {
					$('.control_C, .control_T, .control_W').show();
					$('.admin-biaogelist').show();
					setTimeout(() => {layer.closeAll('loading')}, 10)
					$('.common_tbody').css('visibility', 'visible');
				}

				if ($('.control_C .nl').length > 0) {
					$('.control_C').each((index, item) => {
						$(item).find('.nl').each((subindex, subitem) => {
							if (subindex !== $(item).find('.nl').length - 1) {
								if (!$(subitem).text().includes('|')) {
									$(subitem).text($(subitem).text() + ' |')
								}
							}
						})
					})
				}
			}
		}, 10)

		window.__firstRender = true;
	}

	/**
	 * 防抖
	 * @param {String} layerId layer窗口的id
	 */
	shakeInit({layerId}) {
		return (bool) => {
			let can_click = true;

			if (!can_click) {
				layer.msg('请勿重复点击', {icon: 2, time: 1500});
				throw Error('请勿重复点击');
			}

			if (bool) {
				$(`#${layerId}`).parents('.layui-layer').find('.layui-layer-btn .layui-layer-btn0').removeClass('disabled-style');
			} else {
				$(`#${layerId}`).parents('.layui-layer').find('.layui-layer-btn .layui-layer-btn0').addClass('disabled-style');
			}
			this.can_click = bool;
		}
	}
}


export default {
	base_methods
};

