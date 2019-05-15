<template>
	<div>
		<div class="content_item">
			<div class="item_title">
				<span>团队成员</span>
			</div>
			<div class="layui-form item_content">
				<!-- <div class="layui-inline" style="margin-left: 20px;">
					<button class="layui-btn layui-btn-sm" @click="addAccount()">
						<i class="layui-icon">&#xe608;</i> 添加账号
					</button>
				</div>-->

				<div class="layui-inline">
					<label class="layui-form-label w80">账号：</label>
					<div class="layui-input-inline">
						<input
							@keyup.enter="selectData"
							v-model="reqData.cp_account"
							type="text"
							autocomplete="off"
							class="layui-input"
						>
					</div>
				</div>
				<div class="layui-inline">
					<label class="layui-form-label w80">昵称：</label>
					<div class="layui-input-inline">
						<input
							@keyup.enter="selectData"
							v-model="reqData.cp_nickname"
							type="text"
							autocomplete="off"
							class="layui-input"
						>
					</div>
				</div>

				<div class="layui-inline">
					<label class="layui-form-label" style="width: 70px;">状态：</label>
					<div class="layui-input-inline button-group" style="font-size: 12px;">
						<span class="button-group-btn" @click="changeStatus({status: '', e: $event})">全部</span>
						<span class="button-group-btn active" @click="changeStatus({status: 0, e: $event})">正常接单</span>
						<span class="button-group-btn" @click="changeStatus({status: 3, e: $event})">手动暂停接单</span>
						<span class="button-group-btn" @click="changeStatus({status: 2, e: $event})">系统暂停接单</span>
						<span class="button-group-btn" @click="changeStatus({status: 1, e: $event})">系统封号</span>
					</div>
				</div>

				<div class="layui-inline">
					<button
						@click="selectData()"
						style="padding: 0 20px; margin-left: 30px;"
						class="layui-btn layui-btn-sm layui-btn-normal"
					>查询</button>
				</div>

				<div class="connect_div">
					<table class="layui-table">
						<thead>
							<tr>
								<th>账号</th>
								<th>昵称</th>
								<th>上级账号</th>
								<th>微信/利润</th>
								<!-- <th>支付宝/利润</th> -->
								<th>可用额度</th>
								<th>限制额度</th>
								<th>创建时间</th>
								<th>二维码</th>
								<th>状态</th>
								<th>备注</th>
								<th>店员</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="item.id">
								<td v-text="item.cp_account"></td>
								<td v-text="item.cp_nickname"></td>
								<td v-text="item.cp_top_account"></td>
								<td v-text="item.wx_rebate"></td>
								<!-- <td v-text="item.ali_rebate"></td> -->
								<td class="red f_bold" v-text="item.gather_amount_limit"></td>
								<td class="red" v-text="item.gal_personal"></td>
								<td v-text="item.create_time"></td>
								<td>
									<span
										class="red cp"
										v-if="item.pay_url === '' && item.is_alter"
										@click="addQrcode(item.cp_account)"
									>未上传/上传</span>

									<span
										class="_info"
										v-if="item.pay_url !== ''"
										@click="look({url: item.pay_url, nickname: item.cp_nickname})"
									>已上传/查看</span>
								</td>

								<td>
									<span
										v-if="item.status == 0 || item.status == 2"
										:class="$d.tg['account_status_color'][item.status]"
										v-text="$d.tg['account_status'][item.status]"
									></span>

									<span
										v-else
										@click="showTime(item.id)"
										class="cp"
										:class="$d.tg['account_status_color'][item.status]"
										v-text="$d.tg['account_status'][item.status]"
									></span>
								</td>

								<td>
									<span
										v-if="item.is_alter"
										class="info_"
										@click="remark('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}})"
									>{{ item.remark == '' ? '填写' : '查看' }}</span>

									<span v-else class="info_" @click="remark('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, disabled: true})">
										查看
									</span>
								</td>

								<td :class="item.wx_pay_openid === '' ? 'red' : 'green'">{{ item.wx_pay_openid === '' ? '未添加' : '已添加' }}</td>

								<td>
									<button
										v-if="item.status == 1 && item.is_alter"
										class="layui-btn-disabled layui-btn layui-btn-xs"
									>
										启用
									</button>
									
									<button
										v-if="(item.status == 3 || item.status == 2) && item.is_alter"
										class="layui-btn layui-btn-xs"
										@click="enabled(item.id, item.wx_pay_openid)"
									>
										启用
									</button>

									<button
										v-if="item.status == 0 && item.is_alter"
										class="layui-btn layui-btn-xs"
										@click="stop(item.id)"
									>
										暂停
									</button>

									<button v-if="item.is_alter" class="layui-btn layui-btn-xs" @click="limit(item)">
										限制额度
									</button>
									

									<button v-if="item.is_alter && !item.oneself" class="layui-btn layui-btn-xs" @click="editAccount(item)">
										编辑
									</button>
								</td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>您暂时没有团队成员！</p>
								</td>
							</tr>
						</tbody>
					</table>
					<div id="page" class="fr">
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="reqData.page"
							:page-sizes="$d.pageSizes"
							:page-size="reqData.pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="dataList.sum"
						></el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			layForm: null,
			dataList: { list: [] },
			rebateList: [], // 返点列表
			reqData: {
				prompt: true,
				cp_account: "",
				cp_nickname: "",
				status: "0",
				page: 1,
				pageSize: 100
			}
		};
	},
	created() {
		this.requestList();
	},
	methods: {
		/**
		 * 请求商户订单列表
		 * closePrompt: 是否关闭加载页面
		 */
		requestList(closePrompt) {
			this.reqData.prompt = closePrompt ? false : true;

			this.$axios
				.post("Code_Provider/code_provider", this.reqData)
				.then(data => {
					this.dataList = data.dataList;
				});
		},

		selectData() {
			this.reqData.page = 1;
			this.requestList();
		},

		/**
		 * 获取返点比例下拉
		 */
		getRebate(cp_top_account) {
			return new Promise(res => {
				this.$axios.post("Code_provider/cp_rebate", {
					cp_top_account,
				}).then(data => {
					if (data.status === "error") return;
					res(data.dataList.list)
				});
			})
		},

		/**
		 * 添加账号
		 */
		/* addAccount() {
			layer.open({
				type: 1,
				area: ["500px", "420px"],
				id: "addAccount",
				btn: ["添加"],
				title: "添加账号",
				content: `
					<div class="__layer addAccount">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<input class="__layer_input code_account" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入账号</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<input class="__layer_input cp_nickname" type="text" autocomplete="off"/>
							<span class="__layer_tips">长度为5个汉字或10个字符</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">密码：</span>
							<input class="__layer_input code_password" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入密码</span>
						</div>

						<div class="item mb15">
							<span class="__layer_title">上级账号：</span>
							<label style="margin-right: 20px;">
								<input type="radio" class="__layer_radio" name="sup_account" value="${$.cookie(
									"code_name"
								)}" checked> 自己
							</label>
							<label>
								<input type="radio" class="__layer_radio" name="sup_account" value="other">
								<span id="other_radio"> 其他</span>
							</label>
							<button class="layui-btn layui-btn-normal layui-btn-sm select_other" style="margin-left: 15px; display: none;">
								选择用户
							</button>
						</div>
						<div class="item mb15">
							<span class="__layer_title">微信返点比例：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请选择微信返点比例</span>
						</div>
						<div class="item mb0">
							<span class="__layer_title">支付宝返点比例：</span>
							<select class="__layer_input alipay_rebate"></select>
							<span class="__layer_tips">请选择支付宝返点比例</span>
						</div>
					</div>
				`,
				success: () => {
					// 渲染返点比例
					const renderRebates = ({ wx_rebate, ali_rebate }) => {
						const wxRebateArr = this.rebateList.filter(
							item => wx_rebate >= item.value
						);
						const wxHtml = wxRebateArr.map(
							item =>
								`<option value="${item.value}">${
									item.name
								}</option>`
						);
						$(".addAccount .wechat_rebate").html(wxHtml.join(""));

						const aliRebateArr = this.rebateList.filter(
							item => ali_rebate >= item.value
						);
						const aliHtml = aliRebateArr.map(
							item =>
								`<option value="${item.value}">${
									item.name
								}</option>`
						);
						$(".addAccount .alipay_rebate").html(aliHtml.join(""));
					};
					renderRebates(this.$store.getters.userInfo);

					// 渲染上级账号
					$(".addAccount [name=sup_account]").on(
						"change",
						function() {
							if ($(this).val() == "other") {
								$(".addAccount .select_other").show();
							} else {
								$(".addAccount .select_other").hide();
								renderRebates(this.$store.getters.userInfo);
							}
						}
					);

					$(".addAccount .select_other").on("click", () => {
						layer.open({
							type: "1",
							area: ["400px", "155px"],
							btn: ["确定"],
							title: "选择账号",
							content: `
								<div class="__layer select_view">
									<div class="item mb0">
										<span class="__layer_title" style="width: 60px;">账号：</span>
										<input class="__layer_input code_account" type="text" autocomplete="off"/>
										<span class="__layer_tips">请输入账号</span>
									</div>
								</div>
							`,
							yes: layerIndex => {
								const codeAccount = $(
									".select_view .code_account"
								).val();
								if (codeAccount === "")
									return layer.msg("请输入账号！", {
										icon: 2,
										time: 1500
									});
								this.$axios
									.post("Code_provider/sub_rebate", {
										cp_account: codeAccount
									})
									.then(res => {
										if (res.status === "error") return;

										const { dataList } = res;
										renderRebates(dataList);
										$(".addAccount #other_radio").html(
											codeAccount
										);
										layer.close(layerIndex);
									});
							}
						});
					});
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					// TODO 限制昵称字符长度

					const code_account = $(".addAccount .code_account").val(),
						cp_nickname = $(".addAccount .cp_nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".addAccount .code_password").val(),
						wechat_rebate = $(".addAccount .wechat_rebate").val(),
						alipay_rebate = $(".addAccount .alipay_rebate").val(),
						sup_account_radio = $(
							".addAccount [name=sup_account]:checked"
						).val(),
						sup_account_name = $(".addAccount #other_radio").html(),
						sup_account =
							sup_account_radio == "other"
								? sup_account_name
								: sup_account_radio;

					if (code_account === "") {
						return this.$m.hint_layer("请输入账号", 2);
					}
					if (cp_nickname === "") {
						return this.$m.hint_layer("请输入昵称", 2);
					}
					if (nickNameLength > 10) {
						return this.$m.hint_layer(
							"昵称长度为5个汉字或10个字符",
							2
						);
					}
					if (code_password === "") {
						return this.$m.hint_layer("请输入密码", 2);
					}
					if (!PASSREG.test(code_password)) {
						return layer.msg("密码由6-15位数字或字母组成", {
							icon: 2,
							time: 2000
						});
					}
					if (sup_account === "") {
						return this.$m.hint_layer("请输入上级账号", 2);
					}

					this.$axios
						.post("Code_provider/code_provider_add", {
							cp_account: code_account,
							cp_nickname,
							cp_password: code_password,
							wx_rebate: wechat_rebate,
							ali_rebate: alipay_rebate,
							sup_account
						})
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			});
		}, */

		/**
		 * 编辑账号
		 */
		editAccount(dataObj) {
			let disabledArgs = null;
			const AREA =
				dataObj.status == 1 ? ["510px", "330px"] : ["510px", "365px"];

			layer.open({
				type: 1,
				area: AREA,
				btn: ["确定"],
				title: "编辑账号",
				content: `
					<div class="__layer editAccount">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<input class="__layer_input code_account" value="${
								dataObj.cp_account
							}" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入账号</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<input class="__layer_input nickname" value="${
								dataObj.cp_nickname
							}" type="text" autocomplete="off"/>
							<span class="__layer_tips">长度为10个汉字或20个字符</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">密码：</span>
							<input class="__layer_input code_password" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入密码</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">微信返点比例：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请选择微信返点比例</span>
						</div>
						<div class="item mb0 ${dataObj.status == 1 ? "dn" : ""}">
							<span class="__layer_title">状态：</span>

							
							<label style="margin-right: 20px;">
								<input type="radio"  class="__layer_radio" name="account_status" value="0" ${
									dataObj.status == 0 ? "checked" : ""
								}> 启用收款
							</label>

							<label>
								<input type="radio" class="__layer_radio" name="account_status" value="3" ${
									dataObj.status == 3 ? "checked" : ""
								}> 暂停收款
							</label>
						</div>
					</div>
				`,
				success: async () => {
					const rebateList = await this.getRebate(dataObj.cp_account);
					// 渲染返点比例
					const wechat_rebateArr = rebateList.map(
						item =>
							`<option value="${item.value}" ${
								item.value / 10 == dataObj.wx_rebate
									? "selected"
									: ""
							}>${item.name}</option>`
					);
					$(".editAccount .wechat_rebate").html(
						wechat_rebateArr.join("")
					);

					/* const alipay_rebateArr = rebateList.map(
						item =>
							`<option value="${item.value}" ${
								item.value / 10 == dataObj.ali_rebate
									? "selected"
									: ""
							}>${item.name}</option>`
					);
					$(".editAccount .alipay_rebate").html(
						alipay_rebateArr.join("")
					); */

					/* $('.editAccount [name="account_status"]').on(
						"change",
						() => {
							const val = $(
								'.editAccount [name="account_status"]:checked'
							).val();
							if (val != 1) {
								return;
							}

							layer.open({
								type: "1",
								title: "禁用账号",
								area: ["500px", "210px"],
								btn: ["确认"],
								content: `
								<div class="__layer disabled_view">
									<div class="item mb15">
										<span class="__layer_title">禁用时长：</span>
										<label style="margin-right: 10px;">
											<input type="radio" class="__layer_radio" name="disabled_type" checked value="0"> 永久
										</label>
										
										<label style="margin-right: 10px;">
											<input type="radio" class="__layer_radio" name="disabled_type" value="1"> 按天禁用
										</label>

										<label style="margin-right: 10px;">
											<input type="radio" class="__layer_radio" name="disabled_type" value="2"> 按时禁用
										</label>
										
										<label for="radio_status_4">
											<input type="radio" id="radio_status_4" class="__layer_radio" name="disabled_type" value="3"> 按分禁用
										</label>
									</div>
									<div class="item mb0">
										<span class="__layer_title">禁用时间：</span>
										<input class="__layer_input disabled_time" type="number" disabled autocomplete="off"/>
										<span class="__layer_tips unit"></span>
									</div>
								</div>`,
								success: () => {
									$(
										'.disabled_view [name="disabled_type"]'
									).on("change", function() {
										const val = $(this).val();
										if (val === "0") {
											$(".disabled_view .disabled_time")
												.val("")
												.prop("disabled", true);
											$(".disabled_view .unit").html("");
											return;
										}
										$(".disabled_view .disabled_time").prop(
											"disabled",
											false
										);
										const tgObj = {
											"1": "天",
											"2": "小时",
											"3": "分钟"
										};
										$(".disabled_view .unit").html(
											tgObj[val]
										);
									});
								},
								yes: layIndex => {
									const time_type = $(
										'.disabled_view [name="disabled_type"]:checked'
									).val();
									const time = $(
										".disabled_view .disabled_time"
									).val();
									if (time_type !== "0" && time == "") {
										return layer.msg(
											"请输入需要禁用的时间",
											{ icon: 2, time: 1500 }
										);
									}
									disabledArgs = {
										time_type,
										time
									};
									layer.close(layIndex);
								}
							});
						}
					); */
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					let code_account = $(".editAccount .code_account").val(),
						cp_nickname = $(".editAccount .nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".editAccount .code_password").val(),
						wechat_rebate = $(".editAccount .wechat_rebate").val(),
						superiorID = $(".editAccount .superiorID").val(),
						status = $(
							'.editAccount [name="account_status"]:checked'
						).val();

					if (code_account === "") {
						return this.$m.hint_layer("请输入账号", 2);
					}
					if (cp_nickname === "") {
						return this.$m.hint_layer("请输入昵称", 2);
					}
					console.log(nickNameLength)
					if (nickNameLength > 10) {
						return this.$m.hint_layer(
							"昵称长度为10个汉字或20个字符",
							2
						);
					}

					let reqObj = {
						cp_account: code_account,
						cp_nickname,
						cp_password: code_password,
						wx_rebate: wechat_rebate,
						sup_id: superiorID,
						id: dataObj.id,
						status
					};

					if (status == 1) {
						Object.assign(reqObj, disabledArgs);
					}

					this.$axios
						.post("Code_provider/code_provider_edit", reqObj)
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			});
		},

		/**
		 * 额度配置	
		 * @param {Number} id 操作数据的id
		 * @param {Number} limit_type 0无限制 1有限制
		 */
		limit(dataObj) {
			let radioHtml;

			const isLimit = dataObj.gal_personal === '无限制';

			if (isLimit) {
				radioHtml = `
					<input class="__layer_radio" id="limit_type_1" type="radio" name="handle" value="3"/>
					<label style="margin-right: 15px;" for="limit_type_1"> 有限制</label>

					<input class="__layer_radio" id="limit_type_2" type="radio" name="handle" value="2" checked/>
					<label for="limit_type_2"> 无限制</label>`

			} else {
				radioHtml = `
					<input class="__layer_radio" id="limit_type_3" type="radio" name="handle" value="0" checked/>
					<label style="margin-right: 15px;" for="limit_type_3"> 增加</label>

					<input class="__layer_radio" id="limit_type_4" type="radio" name="handle" value="1"/>
					<label style="margin-right: 15px;" for="limit_type_4"> 减少</label>

					<input class="__layer_radio" id="limit_type_5" type="radio" name="handle" value="2"/>
					<label for="limit_type_5"> 无限制</label>
				`
			}

			layer.open({
				type: 1,
				area: ['370px', '210px'],
				btn: ['确定'],
				title: '额度设置',
				content: `
					<div class="__layer limit_view">
						<div class="item mb15">
							<span class="__layer_title">额度操作：</span>
							${radioHtml}
						</div>
						<div class="item mb0">
							<span class="__layer_title">金额：</span>
							<input class="__layer_input amount" style="width: 100px;" type="text" autocomplete="off"/> 元
						</div>
					</div>
				`,
				success: () => {
					if (isLimit) {
						$('.limit_view .amount').prop('disabled', true);
					};

					$('.limit_view [name="handle"]').on('change', () => {

						let val = $('.limit_view [name="handle"]:checked').val();
						if (val == 2) {
							$('.limit_view .amount').val('').prop('disabled', true);
						} else {
							$('.limit_view .amount').val('').prop('disabled', false);
						}
					})
				},
				yes: (layIndex) => {
					let limit_type = $('.limit_view [name="handle"]:checked').val(),
						amount = $('.limit_view .amount').val();

					if (limit_type !== '2' && amount === '') { return this.$m.hint_layer('请输入金额', 2) };

					this.$axios.post('Code_Provider/cp_limit_money', {
						id: dataObj.id,
						amount, limit_type,
					}).then(data => {
						if (data.status === 'OK') {
							setTimeout(() => {
								layer.close(layIndex);
								this.requestList();
							}, 1500)
						}
					})
				}
			})
		},

		/**
		 * 备注
		 */
		remark(requestUrl, { remark, mustArgs, limit = 100 , disabled = false}) {
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

					this.$axios.post(requestUrl, reqData).then(res => {
						if (res.status === "OK") {
							layer.close(index);
							setTimeout(() => {
								this.requestList();
							}, 1500);
						}
					});
				}
			});
		},

		/**
		 * 启用账号
		 */
		enabled(id, clerk) {
			if (clerk === '') return layer.msg('无法启用！该账号没有店员', {icon: 2, time: 1500});
			
			layer.confirm(
				"是否要启用选中的成员账号？",
				{ title: "启用", icon: 7 },
				layIndex => {
					this.$axios
						.post("Code_provider/status_edit", {
							id,
							status: 0
						})
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			);
		},

		/**
		 * 禁用账号
		 */
		disabled(id) {
			layer.open({
				type: "1",
				title: "禁用账号",
				area: ["500px", "210px"],
				btn: ["确认"],
				content: `
					<div class="__layer disabled_view">
						<div class="item mb15">
							<span class="__layer_title">禁用时长：</span>
							<input type="radio" id="radio_status_1" class="__layer_radio" name="account_status" checked value="0"> 
							<label style="margin-right: 10px;" for="radio_status_1">永久</label>

							<input type="radio" id="radio_status_2" class="__layer_radio" name="account_status" value="1"> 
							<label style="margin-right: 10px;" for="radio_status_2">按天禁用</label>

							<input type="radio" id="radio_status_3" class="__layer_radio" name="account_status" value="2"> 
							<label style="margin-right: 10px;" for="radio_status_3">按时禁用</label>

							<input type="radio" id="radio_status_4" class="__layer_radio" name="account_status" value="3"> 
							<label for="radio_status_4">按分禁用</label>
						</div>
						<div class="item mb0">
							<span class="__layer_title">禁用时间：</span>
							<input class="__layer_input disabled_time" type="number" disabled autocomplete="off"/>
							<span class="__layer_tips unit"></span>
						</div>
					</div>`,
				success: () => {
					$('.disabled_view [name="account_status"]').on(
						"change",
						function() {
							const val = $(this).val();
							if (val === "0") {
								$(".disabled_view .disabled_time")
									.val("")
									.prop("disabled", true);
								$(".disabled_view .unit").html("");
								return;
							}
							$(".disabled_view .disabled_time").prop(
								"disabled",
								false
							);
							const tgObj = {
								"1": "天",
								"2": "小时",
								"3": "分钟"
							};
							$(".disabled_view .unit").html(tgObj[val]);
						}
					);
				},
				yes: layIndex => {
					const time_type = $(
						'.disabled_view [name="account_status"]:checked'
					).val();
					const time = $(".disabled_view .disabled_time").val();
					if (time_type !== "0" && time == "") {
						return layer.msg("请输入需要禁用的时间", {
							icon: 2,
							time: 1500
						});
					}
					this.$axios
						.post("Code_provider/status_edit", {
							time_type,
							time,
							id,
							status: 1
						})
						.then(res => {
							if (res.status == "error") return;
							setTimeout(() => {
								layer.close(layIndex);
								this.requestList();
							}, 1500);
						});
				}
			});
		},

		/**
		 * 暂停收款
		 */
		stop(id) {
			layer.confirm(
				"是否要暂停选中的成员账号？",
				{ title: "暂停收款", icon: 7 },
				layIndex => {
					this.$axios
						.post("Code_provider/status_edit", {
							id,
							status: 3
						})
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			);
		},

		/**
		 * 显示时间
		 */
		showTime(id) {
			let timeId;
			layer.open({
				type: 1,
				title: "禁用时间",
				area: ["300px", "170px"],
				btn: ["确定"],
				skin: "layui-layer-rim", //加上边框
				content: `
					<div class="__layer diabled_view">
						<div class="item mb0">
							<span class="__layer_title fl" style="width: 80px;">禁用时间：</span>
							<span style="width: 140px;" class="__layer_content diabled_time fl"></span>
						</div>
					</div>
				`,
				success: () => {
					this.$axios
						.post("Code_provider/residue_time", { id })
						.then(res => {
							if (res.status == "error") return;
							const { dataList } = res;
							if (dataList.type == "perpetual") {
								$(".diabled_view .diabled_time").html("永久");
							} else {
								const { day, hour, minute } = dataList;
								$(".diabled_view .diabled_time").html(
									`${day} 天 ${hour} 小时 ${minute} 分`
								);
								timeId = setInterval(() => {
									$(".diabled_view .diabled_time").html(
										`${day} 天 ${hour} 小时 ${minute} 分`
									);
								}, 60000);
							}
						});
				},
				end: () => {
					clearInterval(timeId);
				}
			});
		},

		/**
		 * 查看二维码图片
		 * @param {String} url 二维码地址
		 * @param {Number} money 对应二维码的金额
		 * @param {Number} nickname 昵称
		 */
		look({ url, nickname }) {
			this.$axios
				.post(`Qrcode/qrcode_images`, {
					url: url,
					prompt: true
				})
				.then(res => {
					const data = res.dataList;
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
						title: [
							`${nickname}`,
							"font-size:20px; font-weight: bold; text-align: center; padding: 0"
						],
						area: ["300px", "350px"],
						photos: JSON,
						shade: 0.5,
						anim: 5
					});
				});
		},

		/**
		 * 上传二维码
		 * @param {string} account 码户账号
		 */
		addQrcode(account) {
			let baseImg;
			layer.open({
				type: 1,
				area: ["500px", "160px"],
				offset: "250px",
				btn: ["确定"],
				id: "add_qrcode",
				title: "上传二维码",
				content: `
					<div class="__layer editQrcode">
						<div class="item mb15">
							<span class="__layer_title" style="width: 95px;">支付二维码：</span>
							<input style="vertical-align: baseline; display: inline-block;" class="qrcode" type="file" autocomplete="off"/>
						</div>
						<div class="hidden_container">
							<div class="item mb0" style="text-align: center;">
								<img class="qrcode_img" style="height:230px;" />
							</div>
						</div>
					</div>
				`,
				success: () => {
					const containerHeight = 240;
					let isShow = false;

					function hideList() {
						isShow = false;
						$(".editQrcode .hidden_container").css({
							visibility: "hidden",
							height: 0 + "px"
						});
						$("#edit_qrcode").css({
							height:
								$("#edit_qrcode").outerHeight(true) -
								containerHeight +
								"px"
						});
						$("#add_qrcode")
							.parents(".layui-layer")
							.css({
								height:
									$("#add_qrcode")
										.parents(".layui-layer")
										.outerHeight(true) -
									containerHeight +
									"px"
							});
					}

					function showList() {
						if (isShow) {
							return;
						}
						isShow = true;
						$(".editQrcode .hidden_container").css({
							visibility: "initial",
							height: containerHeight + "px"
						});
						$("#add_qrcode").css({
							height:
								$("#add_qrcode").outerHeight(true) +
								containerHeight +
								"px"
						});
						$("#add_qrcode")
							.parents(".layui-layer")
							.css({
								height:
									$("#add_qrcode")
										.parents(".layui-layer")
										.outerHeight(true) +
									containerHeight +
									"px"
							});
					}

					$(".editQrcode .qrcode").on("change", e => {
						const files = $(e.currentTarget)[0].files[0];

						if (files) {
							showList();
						} else {
							return hideList();
						}

						const reader = new FileReader();
						reader.onload = function(e) {
							baseImg = e.target.result;
							console.log($(".editQrcode .qrcode_img"));
							$(".editQrcode .qrcode_img").attr(
								"src",
								e.target.result
							);
						};
						reader.readAsDataURL(files);
					});
				},
				yes: async layIndex => {
					const files = $(".editQrcode .qrcode")[0].files[0];
					if (!files)
						return layer.msg("请选择支付二维码文件", {
							time: 1500,
							icon: 2
						});

					let requestData;
					if (this.$store.getters.userInfo.qr_code_url === "") {
						requestData = {
							cp_account: account,
							base64: baseImg,
							prompt: true
						};
					} else {
						requestData = {
							cp_account: account,
							list: await this.requestOuterUrl({
								base: baseImg,
								prompt: true,
								pay_mode: 1
							}),
							prompt: true
						};
					}

					this.$axios
						.post("Qrcode/qr_code_add", requestData)
						.then(res => {
							if (res.status === "error") return;
							if (res.dataList === 'OK') {
								layer.msg('图片上传成功', {icon: 1, time: 1500})
							}
							setTimeout(() => {
								layer.close(layIndex);
								this.requestList();
							}, 1500);
						});
				}
			});
		},

		/**
		 * 请求外部url
		 * @param {String} base 图片的base64格式
		 * @param {Number} pay_mode 外部访问上传模式  0为定额，1为不定额；不传默认为0
		 * @param {Boolean} prompt 是否显示提示框
		 */
		requestOuterUrl({ base, pay_mode, prompt }) {
			const requestUrl = this.$store.getters.userInfo.qr_code_url;

			return new Promise(res => {
				this.$axios
					.post(requestUrl, {
						base64: base,
						pay_mode,
						prompt
					})
					.then(data => {
						if (data.status === "error") return;
						res(data.dataList);
					});
			});
		},
		
		/**
		 * 改变状态
		 */
		changeStatus({ status, e }) {
			this.reqData.status = status;
			$(e.currentTarget).addClass('active').siblings().removeClass('active');
			this.requestList();
		},

		/**
		 * 删除账号
		 */
		/* delAccount(delArr) {
			layer.confirm('是否要删除选中的结算账号？', {icon: 7}, layIndex => {
				this.$axios.post('Merchant/pay_account_del', { id: delArr }).then(data => {
					if (data.status === 'OK') {
						setTimeout(() => {
							layer.close(layIndex);
							this.requestList();
						}, 1500)
					}
				})
			})
		} */

		/**
		 * 页容量变化
		 */
		handleSizeChange(val) {
			this.reqData.pageSize = val;
			this.reqData.page = 1;
			this.requestList();
		},

		/**
		 * 页码变化
		 */
		handleCurrentChange(val) {
			this.reqData.page = val;
			this.requestList();
		}
	}
};
</script>