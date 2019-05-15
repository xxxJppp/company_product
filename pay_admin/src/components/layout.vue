<template>
	<div style="min-width: 1366px;">
		<!-- 头部 -->
		<header class="am-topbar admin-header">
			<div class="am-topbar-brand">
				<img id="logo" src="../statics/images/logo/logo.png">
			</div>
			<div class="am-collapse am-topbar-collapse" id="topbar-collapse">
				<ul class="am-nav am-nav-pills am-topbar-nav admin-header-list">
					<li v-if="show_service" style="line-height: 50px;">
						<button
							class="am-btn am-btn-primary am-dropdown-toggle am-btn-xs am-radius line_serive el-icon-service"
							style="margin-right:5px"
							@click="customizeChar(true)"
						>自定义聊天</button>
					</li>
					<li v-if="show_service" style="line-height: 50px;">
						<button
							id="new_line_serive"
							class="am-btn am-btn-primary am-dropdown-toggle am-btn-xs am-radius am-icon-bell-o line_serive showChat"
							style="margin-right:5px"
						>
							在线客服
							<span id="new_layer_tips" class="up_r_point numsShow"></span>
						</button>
					</li>

					<li
						v-if="show_wechat_manage"
						@click="updateData('/admin/code/wechat_manage')"
						style="line-height: 50px; margin: 0 10px; 0 0"
						class="am-dropdown tognzhi"
						data-am-dropdown
					>
						<router-link
							to="/admin/code/wechat_manage"
							tag="button"
							class="am-btn am-btn-secondary am-dropdown-toggle am-btn-xs am-radius am-icon-users"
						>
							检测微信店员
							<span
								class="am-badge am-badge-danger am-round"
							>{{ wechat_manage_sum }}</span>
						</router-link>
					</li>

					<li
						v-if="show_mch_list"
						@click="updateData('/admin/mch/mch_list')"
						style="line-height: 50px; margin: 0 10px; 0 0"
						class="am-dropdown tognzhi"
						data-am-dropdown
					>
						<router-link
							to="/admin/mch/mch_list"
							tag="button"
							class="am-btn am-btn-secondary am-dropdown-toggle am-btn-xs am-radius am-icon-cny"
						>商户余额：{{ mch_balance }} 元</router-link>
					</li>

					<li
						v-if="show_deposit_amount"
						@click="updateData({path: '/admin/code/code_list', query: {min: true}})"
						style="line-height: 50px; margin: 0 10px; 0 0"
						class="am-dropdown tognzhi"
						data-am-dropdown
					>
						<router-link
							:to="{path: '/admin/code/code_list', query: {min: true}}"
							tag="button"
							class="amaze-icon am-btn am-btn-secondary am-dropdown-toggle am-btn-xs am-radius am-icon-cny"
						>
							押金总数：{{ deposit_amount_data.gather_amount_limit }} 元
							<span
								class="am-badge am-badge-danger am-round"
							>{{ deposit_amount_data.sum > 99 ? 99 : deposit_amount_data.sum }}</span>
						</router-link>
					</li>

					<li
						v-if="show_code_list"
						@click="updateData({path: '/admin/code/code_list', query: {now_cp: true}})"
						style="line-height: 50px; margin: 0 10px; 0 0"
						class="am-dropdown tognzhi"
						data-am-dropdown
					>
						<router-link
							:to="{path: '/admin/code/code_list', query: {now_cp: true}}"
							tag="button"
							class="amaze-icon am-btn am-btn-secondary am-dropdown-toggle am-btn-xs am-radius am-icon-users"
						>
							当前码户
							<span class="am-badge am-badge-danger am-round">{{ code_num }}</span>
						</router-link>
					</li>

					<li
						v-if="show_withdraw || show_codeOnline"
						style="line-height: 50px; margin: 0 10px; 0 0"
						class="am-dropdown tognzhi"
						data-am-dropdown
					>
						<button
							id="msg_tips_show"
							class="amaze-icon am-btn am-btn-primary am-dropdown-toggle am-btn-xs am-radius am-icon-bell-o"
						>
							消息管理
							<span class="am-badge am-badge-danger am-round">{{ total_num }}</span>
						</button>
						<ul class="am-dropdown-content" style="min-width: 136px; display:none">
							<li class="am-dropdown-header">全局消息</li>

							<li
								v-if="show_withdraw"
								@click="updateData({path: '/admin/mch/mch_withdraw', query: { status: '0' }})"
							>
								<router-link
									:to="{path: '/admin/mch/mch_withdraw', query: { status: '0' }}"
								>
									提现请求
									<span
										class="am-badge am-badge-danger am-round"
									>{{ withdraw_num }}</span>
								</router-link>
							</li>
							<li
								v-if="show_withdraw"
								@click="updateData({path: '/admin/mch/mch_withdraw', query: { status: '1' }})"
							>
								<router-link
									:to="{path: '/admin/mch/mch_withdraw', query: { status: '1' }}"
								>
									提现审核通过
									<span
										class="am-badge am-badge-danger am-round"
									>{{ withdraw_pass_num }}</span>
								</router-link>
							</li>
						</ul>
					</li>

					<li class="am-hide-sm-only" style="float: right;">
						<a href="javascript:;" @click="logout" id="admin-fullscreen">
							<img src="../statics/images/icon/logout.png" alt>
							<span class="admin-fullText">退出</span>
						</a>
					</li>
				</ul>
			</div>
		</header>
		<div class="am-cf admin-main">
			<!-- 左侧 -->
			<div class="nav-navicon admin-main admin-sidebar need_side_animate" id="left_nav">
				<div
					class="sideMenu am-icon-dashboard"
					style="color:#aeb2b7; padding: 7px 8px 8px 0;"
				>
					欢迎：
					<span id="user_name"></span>
				</div>
				<div class="sideMenu add_color" v-for="(item, index) in power_list" :key="index">
					<h3 :class="$cm_d.tg['index_icon'][item.path]" style="margin-top: 0;">
						<em v-if="item.path != 'index'"></em>
						<a v-if="item.path != 'index'" href="javascript:void(0)">{{ item.name }}</a>
						<router-link v-if="item.path == 'index'" to="/admin/index">{{ item.name }}</router-link>
					</h3>
					<ul
						class="nav_list"
						v-if="item.children && item.children.length > 0"
						:style="item.path == 'mch' || item.path == 'code' ? 'display: block' : ''"
					>
						<li
							v-for="(subitem, subindex) in item.children"
							:key="subindex"
							@click="updateData(`/admin/${item.path}/${subitem.path}`)"
							:data-id="subitem.id"
						>
							<router-link
								v-if="subitem.path != 'pay_aisle' && subitem.path != 'mining_record' && subitem.path != 'code_online'"
								:to="`/admin/${item.path}/${subitem.path}`"
							>• &nbsp;{{ subitem.name }}</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="admin-content">
				<router-view></router-view>
			</div>
			<div id="mp3_container" class="dn"></div>
		</div>

		<div id="myChat"></div>
		<div id="newMyChat" v-if="show_service">
			<iframe :src="rootPath+'newChat/chat.html'"></iframe>
		</div>
	</div>
</template>

<script>
import "../statics/js/plugins/jquery.js";
export default {
	data() {
		return {
			now: "", // 当前日期

			power_list: {},

			codeOnline_num: 0, // 在线码户人数
			show_codeOnline: false, // 是否显示在线码户
			show_deposit_amount: false, // 是否显示押金总数

			show_withdraw: false, // 是否显示提现
			show_mch_list: false, // 是否显示商户列表
			show_code_list: false, // 是否显示码户列表
			code_num: 0, // 当前码户

			withdraw_num: 0, // 提现记录条数
			init_withdraw: true, // 是否是初始化
			withdraw_voice: false, // 是否有提现声音

			withdraw_pass_num: 0, // 提现审核通过记录条数
			init_withdraw_pass: true, // 是否是初始化
			withdraw_pass_voice: false, // 是否有提现声音

			deposit_amount_data: {}, // 押金数据
			init_deposit_amount: true, // 是否是初始化
			deposit_amount_voice: false, // 是否有最低押金人数提示声音

			mch_balance: 0, // 商户总余额

			show_wechat_manage: false, // 是否显示微信店员管理
			wechat_manage_sum: 0, // 微信店员管理人数
			init_wechat_manage: true, // 是否是初始化
			wechat_manage_voice: false, // 是否有提示声

			show_service: false //是否显示聊天按钮
		};
	},
	watch: {
		$route(newVal, oldVal) {
			setTimeout(() => {
				$("#left_nav .router-link-active")
					.parents("ul")
					.show(200);
			}, 200);
		}
	},
	computed: {
		total_num() {
			let count = this.withdraw_num + this.withdraw_pass_num;
			return count > 99 ? 99 : count;
		}
	},
	created() {
		this.get_user_power(); // 获取登录用户权限
		this.getRebates();

		this.intervalId = setInterval(() => {
			this.get_userInfo();
		}, 600000);
		
		this.clear_browser();

		this.min_get();
	},
	mounted() {
		// 刷新展开
		if ($(".router-link-active").length <= 0) {
			let timeId = setInterval(() => {
				if ($(".router-link-active").length > 0) {
					clearInterval(timeId);
					$(".router-link-active")
						.parents("ul")
						.show(200);
				}
			}, 200);
		}
		this.get_userInfo(); // 获取个人信息
		this.slide_animate(); // 滑动动画
		this.$cm_m.auth_btn();
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
		clearInterval(this.timerId);
	},
	methods: {
		// 聊天需要
		chitchat() {
			this.layer_tips();
		},
		layer_tips() {
			layer.tips("您有新消息哟", "#new_layer_tips", {
				time: false,
				id: "new_show_layer_tips",
				tipsMore: true,
				tips: [1, "#0e90d2"]
			});
		},
		customizeChar(isNew) {
			layer.prompt(
				{
					title: "请输入需要聊天的账号",
					formType: 0,
					closeBtn: 2,
					anim: 1
				},
				function(text, index) {
					reslut(text, index);
				}
			);
			let reslut = (username, index) => {
				let windowName = "window2";
				let url = `${window.location_url}Admin/chat_online`;
				let layerIndex = layer.msg("正在卖命查询账号，并尝试强制链接", {
					shade: 0.3,
					icon: 16,
					time: false
				});
				$.ajax({
					url,
					type: "post",
					data: {
						username,
						token: $.cookie("pay_token")
					},
					success: data => {
						layer.close(layerIndex);
						if (data.status == "OK") {
							if (isNew) {
								data.user = data.dataList;
								delete data.dataList;
							}
							layer.close(index);
							let [avatarList, uerId, nameList] = [
								data.user.avatar,
								data.user.id,
								data.user.username
							];
							layer.close(index);
							let href =
								window.top.$Res.httpRoot +
								"/newChat/chat1.html?avatar=" +
								avatarList +
								"&uerId=" +
								uerId +
								"&nameList=" +
								nameList;
							layer.confirm(
								`已经查询到 ${nameList.replace(/^.{0,}\_/,'')} 用户，马上进入聊天？`,
								{
									btn: ["确定", "取消"],
									closeBtn: 2,
									success: layer => {
										layer.find(".layui-layer-btn0").attr({
											href,
											target: windowName
										});
									}
								},
								index2 => {
									layer.close(index2);
								},
								() => {}
							);
						} else {
							if (typeof data.errorMsg != "undefined") {
								return layer.msg(data.errorMsg, {
									icon: 2,
									time: 1500
								});
							}
						}
					},
					error: () => {
						return layer.msg("查询查询账号失败，链接失败", {
							shade: 0.3,
							icon: 2,
							time: 1500
						});
					}
				});
			};
		},

		// 获取登录用户的权限
		get_user_power() {
			let self = this;
			// 获取用户权限
			this.$axios
				.post("/Admin/authority", {
					token: $.cookie("token")
				})
				.then(res => {
					/* 权限控制 */
					this.withdraw_voice = res.withdraw_voice === 1;

					this.withdraw_pass_voice = res.withdraw_pass_voice === 1;

					this.deposit_amount_voice = res.deposit_amount === 1;

					this.wechat_manage_voice = res.cancel_wx_assis === 1;

					this.show_service = this.$store.getters.openChat && res.chat === 1;

					res.children.sort(function(a, b) {
						return a.number - b.number;
					});

					this.btn_list = [];

					/**
					 * 按钮权限对象
					 */
					const btnAuthObj = {
						新增: "auth_add",
						更多信息: "auth_moreMsg",
						编辑: "auth_eduit",
						资金: "auth_capital",
						删除: "auth_del",
						撤单: "auth_repeal",
						计算: "auth_computed",
						发放: "auth_grant",
						填写: "auth_write",
						通过: "auth_pass",
						拒绝: "auth_reject",
						启用: "is_open",
						授权: "auth_auth",
						分配: "auth_allo",
						分组: "auth_group",
						补单: "auth_repair",
						工资: "auth_wage",
						分红: "auth_dividend",
						详细: "auth_Info",
						禁登: "auth_disabled",
						结算账号: "auth_close_account",
						支付通道: "auth_payaisle",
						退还押金: "auth_returnMoney",
						重发回调: "auth_resend",
						收款额度: "auth_payment",
						转单: "auth_transferOrder",
						更改上级: "auth_changeSuper",
						禁用码户: "auth_disabledCode",
						取消: "auth_cancel",
						自动下发: "auth_autoSend",
						暂停收款: "auth_stopReceipt",
						修改状态: 'auth_changeStatus'
					};

					new Promise(reslove => {
						res.children = res.children.filter((item, index) => {
							return item.name !== "消息提示";
						});

						this.power_list = res.children;

						res.children.forEach((item, index) => {
							if (item.children && item.children.length > 0) {
								item.children.sort(function(a, b) {
									return a.number - b.number;
								});
								// 判断顶部导航栏是否显示
								item.children.forEach((subitem, subindex) => {
									if (subitem.path == "mch_withdraw") {
										this.show_withdraw = true;
									}
									if (subitem.path == "code_online") {
										this.show_codeOnline = true;
									}
									if (subitem.path == "code_list") {
										this.show_code_list = true;
										this.show_deposit_amount = true;
									}
									if (subitem.path == "mch_list") {
										this.show_mch_list = true;
									}

									if (subitem.path == "code_qrcode") {
										this.$store.commit("setQrcode", true);
									}
									if (subitem.path == "wechat_manage") {
										this.show_wechat_manage = true;
									}
									if (
										this.$cm_m.check_type(
											subitem.btnList
										) === "Array" &&
										subitem.btnList.length > 0
									) {
										$(subitem.btnList).each(
											(index, item) => {
												item.class =
													btnAuthObj[
														item.permission_name
													];
												if (!item.class) {
													console.error(
														"暂无对应按钮权限"
													);
												}
												this.btn_list.push(item);
											}
										);
									}
								});
							}
							if (index === res.children.length - 1) {
								reslove();
							}
						});
					}).then(() => {
						let promiseArr = [];
						if (this.show_withdraw) {
							this.get_withdraw();
							this.get_pass_withdraw();
							this.get_deposit_amount();
							this.get_wechat_manage();
							promiseArr.push(this.getMchBalance());
						}

						// if (this.show_codeOnline) {
						// 	this.get_online_code();
						// }
						if (this.show_code_list) {
							promiseArr.push(this.get_code());
						}
						Promise.all(promiseArr).then(() => {
							this.chitchat(); // 聊天所需
						});
					});
					window.$btn_list = this.btn_list;
				});
		},
		// 账号信息
		get_userInfo() {
			this.$axios.post("Admin/userInfo").then(res => {
				window.$userInfo = res;
				$("#user_name").html(res.nickname);
				this.$store.commit('setuserInfo', res);
			});
		},
		// 滑动动画
		slide_animate() {
			$(".need_side_animate").on("click", "h3", function() {
				if (
					$(this)
						.next()
						.is("ul") &&
					!$(this)
						.next()
						.is(":hidden")
				) {
					$(this)
						.siblings(".nav_list")
						.hide(300);
				}

				if (
					$(this)
						.next()
						.is("ul") &&
					$(this)
						.next()
						.is(":hidden")
				) {
					$(this)
						.next()
						.show(300);
				}
			});
			$(".need_side_animate").on("click", ".nav_list li", function() {
				$(this)
					.parents(".nav_list")
					.siblings("h3")
					.parent()
					.siblings();
			});

			$("#topbar-collapse").on("click", "#msg_tips_show", function() {
				$(this)
					.siblings(".am-dropdown-content")
					.toggle(200);
				return false;
			});
			$(window).on("click", function() {
				$("#msg_tips_show")
					.siblings(".am-dropdown-content")
					.hide(200);
			});
		},
		// 清理控制台
		clear_browser() {
			// setInterval(() => {
			//     console.clear();
			// }, 5000);
		},
		// 退出登录
		logout() {
			let self = this;
			layer.confirm(
				"您确定要退出吗？",
				{
					title: "退出",
					btn: ["确定", "取消"] //按钮
				},
				function(index) {
					self.$axios.post("Admin/loginOut").then(res => {
						$.cookie("pay_token", "", {
							expires: -1,
							path: "/"
						}); // 删除 cookie
						$.cookie("userId", "", {
							expires: -1,
							path: "/"
						}); // 删除 cookie
						$.cookie("userName", "", {
							expires: -1,
							path: "/"
						}); // 删除 cookie
						self.$router.replace("/login");
						layer.close(index);
					});
				}
			);
		},

		// 轮询
		min_get() {
			this.timerId = setInterval(() => {
				if (this.show_withdraw) {
					this.get_withdraw();
					this.get_pass_withdraw();
					this.get_deposit_amount();
				}

				if (this.show_wechat_manage) {
					this.get_wechat_manage();
				}

				// if (this.show_codeOnline) {
				// 	this.get_online_code();
				// }

				if (this.show_code_list) {
					this.get_code();
				}
			}, 20000);

			this.timerId2 = setInterval(() => {
				if (this.show_mch_list) {
					this.getMchBalance();
				}
			}, 60000);
		},

		// 获取提现记录
		get_withdraw() {
			this.$axios
				.post("Withdraw/withdraw_list", {
					status: "0"
				})
				.then(res => {
					if (this.init_withdraw) {
						this.init_withdraw = false;
						this.withdraw_num = res.sum;
						return;
					}

					if (res.sum > this.withdraw_num && this.withdraw_voice) {
						$("#mp3_container").html(
							`<audio autoplay="true" height="0" width="0" src="${window
								.location.origin +
								window.location
									.pathname}/statics/mp3/withdraw.mp3"></audio>`
						);
					}

					this.withdraw_num = res.sum;
				});
		},

		// 获取提现审核通过记录
		get_pass_withdraw() {
			this.$axios
				.post("Withdraw/withdraw_list", {
					status: "1"
				})
				.then(res => {
					if (this.init_withdraw_pass) {
						this.init_withdraw_pass = false;
						this.withdraw_pass_num = res.sum;
						return;
					}

					if (
						res.sum > this.withdraw_pass_num &&
						this.withdraw_pass_voice
					) {
						$("#mp3_container").html(
							`<audio autoplay="true" height="0" width="0" src="${window
								.location.origin +
								window.location
									.pathname}/statics/mp3/pass_withdraw.mp3"></audio>`
						);
					}

					this.withdraw_pass_num = res.sum;
				});
		},

		// 押金相关数据
		get_deposit_amount() {
			this.$axios.post("Code_Provider/gather_amount").then(res => {
				if (this.init_deposit_amount) {
					this.init_deposit_amount = false;
					this.deposit_amount_data = res;
					return;
				}

				if (
					res.sum > this.deposit_amount_data.sum &&
					this.deposit_amount_voice
				) {
					$("#mp3_container").html(
						`<audio autoplay="true" height="0" width="0" src="${window
							.location.origin +
							window.location
								.pathname}/statics/mp3/deposit_amount.mp3"></audio>`
					);
				}

				this.deposit_amount_data = res;
			});
		},
		// 押金相关数据
		get_wechat_manage() {
			this.$axios.post("Code_provider/cancel_wx_assis").then(res => {
				if (this.init_wechat_manage) {
					this.init_wechat_manage = false;
					this.wechat_manage_sum = res;
					return;
				}

				if (res > this.wechat_manage_sum && this.wechat_manage_voice) {
					$("#mp3_container").html(
						`<audio autoplay="true" height="0" width="0" src="${window
							.location.origin +
							window.location
								.pathname}/statics/mp3/cancel_clerk.mp3"></audio>`
					);
				}

				this.wechat_manage_sum = res;
			});
		},

		/**
		 * 获取商户余额
		 */
		getMchBalance() {
			return new Promise(resolve => {
				this.$axios.post("/Merchant/merchant_balance").then(data => {
					this.mch_balance = data.money;
					resolve();
				});
			});
		},

		// 获取在线码户信息
		get_online_code() {
			this.$axios
				.post("Code_provider/code_provider_online")
				.then(data => {
					this.codeOnline_num = data.sum;
				});
		},

		get_code() {
			return new Promise(resolve => {
				this.$axios.post("Code_Provider/cp_present").then(data => {
					this.code_num = data.sum;
					resolve();
				});
			});
		},

		/**
		 * 获取返点比例
		 */
		getRebates() {
			this.$axios.post("Code_provider/cp_rebate").then(data => {
				this.$store.commit("setRebateList", data);
			});
		},

		// 更改数据
		updateData(url) {
			this.$router.push("/admin");
			setTimeout(() => {
				this.$router.push(url);
			});
		}
	},
	beforeDestroy() {
		clearInterval(this.timerId);
		clearInterval(this.timerId2);
	}
};
</script>
