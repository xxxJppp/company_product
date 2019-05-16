import axios from 'axios';

export default class Methods {
	constructor(Vue) {
		this.Vue = Vue;
	}

	/**
	 * 计算字符长度(英文数字占0.5个字符，中文汉字占1个字符)
	 * @param {String} str 字符串
	 * @return {Number} 字符串长度 
	 */
	gblen(str) {
		let len = 0;    
	    for (let i = 0; i < str.length; i++) {    
	        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {    
	            len++;
	        } else {
	            len += 0.5;
	        }    
	    }
		return len;
	}

	/**
	 * 请求外部url
	 * @param {String} base 图片的base64格式
	 * @param {Boolean} prompt 是否显示提示框
	 */
	requestOuterUrl({requestUrl, base, prompt = false, pay_mode, qrcode_url, layerId}) {
	
		return new Promise(res => {
			axios.post(requestUrl, {
				base64: base,
				qrcode_url,
				pay_mode,
				prompt,
			}).then(data => {
				if (data.status === 'error') {
					throw new Error('外部上传地址异常');
				};
				res(data.dataList);
			}).catch((e) => {
				layer.close(layerId)
			})
		})
	}

	/**
	 * 范围时间代码
	 * count：获取几天前
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
	 * 消息框
	 */
	msg_layer(text) {
		layer.open({
			type: 1,
			area: ['450px', '300px'],
			btn: ['确定'],
			content: `
				<div class="msg_layer">
					${text}
				</div>
			`
		})
	}

	/** 
	 * 提示框
	 */
	hint_layer(text, icon) {
		layer.msg(text, { icon, time: 1500 });
	}

	/**
	 * 获取返点
	 * @param {Object} requestObj 请求的数据对象
	 * @returns {Promise}
	 */
	getRebate(rebate) {
		rebate = Number.parseFloat(rebate) * 10;
		let i = 0,
			rebateArr = [];
		while(i <= rebate) {
			rebateArr.push({
				name: `千分之${i}`,
				value: i
			});
			i++;
		}
		return rebateArr
	}

	/**
	 * 获取上级返点
	 */
	getTopRebate(cp_top_account) {
		return new Promise(res => {
			axios.post("Code_provider/cp_rebate", {
				prompt: true,
				cp_top_account,
			}).then(data => {
				if (data.status === "error") return;
				res(data.dataList)
			});
		})
	}

	/**
	 * 备注弹框
	 * @param {String} requestUrl 请求地址 
	 * @param {Object}
	 */
	remarkLayer(requestUrl, { remark, mustArgs, limit = 100 , disabled = false, callback = () => {}}) {
		layer.open({
			type: 1,
			btn: ["确认"],
			title: "备注",
			area: ["400px", "280px"],
			content: `
				<div class="textarea-layer">
					<span>提示：备注最长为 ${limit} 个字符</span>
					<textarea class="t_content" ${disabled ? 'disabled' : ''}>${remark == "" ? "" : remark}</textarea>
				</div>
			`,
			success: () => {
				$(".textarea-layer .t_content").on("input", function() {
					let val = $(this).val();
					if (val.length > limit) {
						$(this).val(val.slice(0, limit));
					}
				});
			},
			btn1: index => {
				if (disabled) return layer.close(index);;
				
				const reqData = Object.assign(
					{
						remark: $(".textarea-layer .t_content").val()
					},
					mustArgs
				);

				axios.post(requestUrl, reqData).then(res => {
					if (res.status === "OK") {
						layer.close(index);
						setTimeout(() => {
							callback();
						}, 1500);
					}
				});
			}
		});
	}

	/**
	 * 调整弹框高度并设置定位
	 * isOutAnim: false,
	 * move: false,
	 * @param {String} id 弹框的id
	 * @param {Number} type 1:增加, 0: 减少
	 * @param {Number} lineHeight 行高度
	 */
	layerControl({id, type, lineHeight = 51}) {
		lineHeight = type === 1 ? lineHeight : -lineHeight;
		$(`#${id}`).css({ 'height': ($(`#${id}`).outerHeight(true) + lineHeight) + 'px' });
		$(`#${id}`).parents('.layui-layer').css({ 'height': $(`#${id}`).parents('.layui-layer').outerHeight(true) + lineHeight + 'px' });
		$(`#${id}`).parents('.layui-layer').css({
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)'
		})
	}

	/**
	 * 假的进度条
	 * @param {String} title 加载弹框标题
	 * @param {String} tips 加载弹框中间部分提示文字
	 * @param {Number} speed 速度（每多少秒加1%）
	 * @param {Number} uploadNum 上传总次数
	 * @param {Function} success 加载弹框标题
	 */
	progressLayer(
		{
			title = '进度框',
			tips = '正在加载中，请稍后...',
			speed = 0.5,
			uploadNum = 1,
			success = () => { },
		} = {}) {

		const varData = {
			currentIndex: 0,	// 当前完成的数量
			currentPer: 0,		// 当前百分比
			timeId: null,		// 计时器ID
		}

		// 控制器
		const control = {
			// 渲染加载进度条
			renderLoadBar(reload) {
				++varData.currentPer;

				if (varData.currentPer > 99) {
					varData.currentPer = 99;
					return clearInterval(varData.timeId)
				};

				if (varData.currentPer >= Math.floor(100 / uploadNum) * (varData.currentIndex + 1)) return;
				if (reload) varData.currentPer = Math.floor(100 / uploadNum) * (varData.currentIndex);

				$('.loadingBar_layer .yet_loading').css('width', `${varData.currentPer}%`);
				$('.loadingBar_layer .load_num').html(varData.currentPer + '%')
			},

			// 加载完成
			loadFinish() {
				clearInterval(varData.timeId);
				$('.loadingBar_layer .yet_loading').css('width', '100%');
				$('.loadingBar_layer .load_num').html('100%');
			},

			// 完成数量增加
			loadNext() {
				varData.currentIndex++;
				control.renderLoadBar(true);
			},

			// 加载提示更换
			changeTips(tips) {
				tips = tips.replace(/{{currentIndex}}/g, varData.currentIndex);
				$('.loadingBar_layer .tips_text').html(tips);
			},

			// 加载错误
			loadError(loadLayerId) {
				layer.close(loadLayerId);
				clearInterval(varData.timeId);
			}
		}

		layer.open({
			type: 1,
			closeBtn: 2,
			area: ['325px', '145px'],
			id: 'loading_layer',
			content: `
				<div class="loadingBar_layer">
					<div class="loading_bar">
						<div class="yet_loading"></div>
						<span class="load_num">0%</span>
						<span class="tips_text">${tips}</span>
					</div>
				</div>
			`,
			title: title,
			success: (__layer, loadLayerId) => {

				varData.timeId = setInterval(() => {
					control.renderLoadBar();
				}, +speed * 1000)

				// 调用初始化完成，并提供当前弹窗id
				if (typeof success === 'function') {
					success({
						loadLayerId,
						loadFinish: control.loadFinish,
						loadNext: control.loadNext,
						changeTips: control.changeTips,
						loadError: control.loadError,
					});
				} else {
					throw new Error('success为函数')
				}

			},
			end: () => {
				clearInterval(varData.timeId)
				$('.loadingBar_layer .yet_loading').css('width', `0%`);
				$('.loadingBar_layer .load_num').html(0 + '%')
			}
		})
	}
}
