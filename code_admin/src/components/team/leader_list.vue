<template>
	<div>
		<div class="content_item">
			<div class="item_title">
				<span>团长列表</span>
			</div>
			<div class="layui-form item_content">
				<div
				 class="layui-inline"
				 style="margin-left: 20px;"
				 v-if="userInfo.level === 0"
				 >
					<button
					 class="layui-btn layui-btn-sm"
					 @click="addMySub()"
					 >新增我的下级团长</button>
				</div>


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

				<div class="layui-inline" style="margin-left: 30px;" v-if="userInfo.level === 0">
					<div class="layui-input-inline button-group" style="font-size: 12px;">
						<span
							class="button-group-btn active"
							@click="changeUser({status: '', e: $event})"
						>全部</span>
						<span
							class="button-group-btn"
							@click="changeUser({status: 1, e: $event})"
						>直属团长</span>
						<span
							class="button-group-btn"
							@click="changeUser({status: 2, e: $event})"
						>子团长</span>
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
								<th>团长账号</th>
								<th>昵称</th>
								<th>上级账号</th>
								<th>点位</th>
								<th>人数</th>
								<!-- <th>支付宝/利润</th> -->
								<th>可用额度</th>
								<th>状态</th>
								<th>备注</th>
								<th>创建时间</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="item.id">
								<td class="f_bold" v-text="item.cp_account"></td>
								<td v-text="item.cp_nickname"></td>
								<td
									:class="{'red': item.cp_top_account === '自己'}"
									v-text="item.cp_top_account"
								></td>
								<td v-text="item.wx_rebate"></td>
								<td style="color: #4ab2ff;" class="f_bold" v-text="item.team_number"></td>
								<!-- <td v-text="item.ali_rebate"></td> -->
								<td class="red f_bold" v-text="item.gather_amount_limit"></td>

								<td>
									<span
										:class="$d.tg['leader_status_c'][item.status]"
										v-text="$d.tg['leader_status'][item.status]"
									></span>
								</td>

								<td>
									<span
										v-if="item.is_alter"
										class="info_"
										@click="$m.remarkLayer('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callback: requestList})"
									>{{ item.remark == '' ? '填写' : '查看' }}</span>

									<span
										v-else
										class="info_"
										@click="$m.remarkLayer('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, disabled: true, callback: requestList})"
									>查看</span>
								</td>

								<td v-text="item.create_time"></td>

								<td>
									<button
										v-if="item.status == 1"
										class="layui-btn layui-btn-xs disabled"
									>整团启用接单</button>

									<button
										v-if="item.status == 3"
										class="layui-btn layui-btn-xs layui-btn-open"
										@click="enabled(item.id, item.wx_pay_openid)"
									>整团启用接单</button>

									<button
										v-if="(item.status != 3 && item.status == 0)"
										class="layui-btn layui-btn-xs layui-btn-close"
										@click="stop(item.id)"
									>整团暂停接单</button>

									<button
										v-if="!item.oneself"
										class="layui-btn layui-btn-xs"
										@click="editAccount(item)"
									>编辑</button>
									<button v-else class="layui-btn layui-btn-xs disabled">编辑</button>

									<button
									 v-if="userInfo.level === 0"
									 class="layui-btn layui-btn-xs"
									 @click="addAccount(item)"
									>新增下级团长</button>
								</td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>您暂时没有开下级团长！</p>
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
import { mapGetters } from 'vuex'


export default {
	data() {
		return {
			layForm: null,
			dataList: { list: [] },
			reqData: {
				prompt: true,
				cp_account: "",
				cp_nickname: "",
				status: "",
				type: 1,
				page: 1,
				pageSize: 100
			}
		};
	},
	computed: {
		...mapGetters([
			'userInfo',
		])
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

			this.$axios.post("Member/member_list", this.reqData).then(data => {
				this.dataList = data.dataList;
			});
		},

		selectData() {
			this.reqData.page = 1;
			this.requestList();
		},

		/**
		 * 新增我的下级团长
		 */
		addMySub() {
			const _userInfo = this.$store.getters.userInfo;
			const wxRebateArr = this.$m.getRebate(_userInfo.wx_rebate);

			layer.open({
				type: 1,
				area: ["500px", "310px"],
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

						<div class="item mb0">
							<span class="__layer_title">点位：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请设置点位</span>
						</div>
					</div>
				`,
				success: () => {
					// 渲染返点比例
					const renderRebates = () => {
						const wxHtml = wxRebateArr.map(
							item =>
								`<option value="${item.value}">${
									item.name
								}</option>`
						);
						$(".addAccount .wechat_rebate").html(wxHtml.join(""));
					};
					renderRebates();
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					// TODO 限制昵称字符长度

					const code_account = $(".addAccount .code_account").val(),
						cp_nickname = $(".addAccount .cp_nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".addAccount .code_password").val(),
						wechat_rebate = $(".addAccount .wechat_rebate").val(),
						account_type = '1';

					if (code_account === "") return this.$m.hint_layer("请输入账号", 2);
					if (cp_nickname === "") return this.$m.hint_layer("请输入昵称", 2);
					if (nickNameLength > 10) return this.$m.hint_layer("昵称长度为5个汉字或10个字符", 2);
					if (code_password === "") return this.$m.hint_layer("请输入密码", 2);
					if (!PASSREG.test(code_password)) return this.$m.hint_layer("密码由6-15位数字或字母组成", 2);

					this.$axios
						.post("Member/member_add", {
							cp_account_type: account_type,
							sup_account: _userInfo.cp_account,
							cp_account: code_account,
							cp_nickname,
							cp_password: code_password,
							wx_rebate: wechat_rebate
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
		},

		/**
		 * 添加账号
		 */
		addAccount(dataObj) {
			const wxRebateArr = this.$m.getRebate(dataObj.wx_rebate);

			layer.open({
				type: 1,
				area: ["500px", "410px"],
				id: "addAccount",
				btn: ["添加"],
				title: "添加账号",
				content: `
					<div class="__layer addAccount">
						<div class="item mb15">
							<span class="__layer_title">上级账号：</span>
							<span class="__layer_content">${dataObj.cp_account}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">上级昵称：</span>
							<span class="__layer_content">${dataObj.cp_nickname}</span>
						</div>
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

						<div class="item mb0">
							<span class="__layer_title">点位：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请设置点位</span>
						</div>
					</div>
				`,
				success: () => {
					// 渲染返点比例
					const renderRebates = () => {
						const wxHtml = wxRebateArr.map(
							item =>
								`<option value="${item.value}">${
									item.name
								}</option>`
						);
						$(".addAccount .wechat_rebate").html(wxHtml.join(""));
					};
					renderRebates();
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					// TODO 限制昵称字符长度

					const code_account = $(".addAccount .code_account").val(),
						cp_nickname = $(".addAccount .cp_nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".addAccount .code_password").val(),
						wechat_rebate = $(".addAccount .wechat_rebate").val(),
						account_type = '1';

					if (code_account === "")
						return this.$m.hint_layer("请输入账号", 2);
					if (cp_nickname === "")
						return this.$m.hint_layer("请输入昵称", 2);
					if (nickNameLength > 10)
						return this.$m.hint_layer(
							"昵称长度为5个汉字或10个字符",
							2
						);
					if (code_password === "")
						return this.$m.hint_layer("请输入密码", 2);
					if (!PASSREG.test(code_password))
						return this.$m.hint_layer(
							"密码由6-15位数字或字母组成",
							2
						);

					this.$axios
						.post("Member/member_add", {
							cp_account_type: account_type,
							sup_account: dataObj.cp_account,
							cp_account: code_account,
							cp_nickname,
							cp_password: code_password,
							wx_rebate: wechat_rebate
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
		},

		/**
		 * 编辑账号
		 */
		editAccount(dataObj) {
			const getTopRebate = this.$m.getTopRebate(dataObj.cp_account);

			layer.open({
				type: 1,
				area: ["510px", "310px"],
				btn: ["确定"],
				title: "编辑账号",
				content: `
					<div class="__layer editAccount">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<span class="__layer_content">${dataObj.cp_account}</span>
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
						<div class="item mb0">
							<span class="__layer_title">点位：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请设置点位</span>
						</div>
					</div>
				`,
				success: async () => {
					const rebateList = await getTopRebate;
					const wxRebateArr = rebateList.wx;

					// 渲染微信返点比例
					const wxRebate = Number.parseFloat(dataObj.wx_rebate);
					const wxHtml = wxRebateArr.map(
						item =>
							`<option value="${item.value}" ${
								item.value / 10 == wxRebate ? "selected" : ""
							}>${item.name}</option>`
					);
					$(".editAccount .wechat_rebate").html(wxHtml.join(""));
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					let code_account = $(".editAccount .code_account").val(),
						cp_nickname = $(".editAccount .nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".editAccount .code_password").val(),
						wechat_rebate = $(".editAccount .wechat_rebate").val();

					if (code_account === "") return this.$m.hint_layer("请输入账号", 2);
					if (cp_nickname === "") return this.$m.hint_layer("请输入昵称", 2);
					if (nickNameLength > 10) return this.$m.hint_layer("昵称长度为10个汉字或20个字符", 2);
					if (code_password !== "" && !PASSREG.test(code_password)) return this.$m.hint_layer("密码由6-15位数字或字母组成", 2);

					let reqObj = {
						cp_account: code_account,
						cp_nickname,
						cp_password: code_password,
						wx_rebate: wechat_rebate,
						id: dataObj.id,
					};

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
		 * 启用账号
		 */
		enabled(id, clerk) {
			layer.confirm(
				"是否要启用选中的团长账号？",
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
		 * 暂停收款
		 */
		stop(id) {
			layer.confirm(
				"是否要暂停选中的团长账号？",
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
		 * 改变用户
		 */
		changeUser({ status, e }) {
			this.reqData.user = status;
			$(e.currentTarget)
				.addClass("active")
				.siblings()
				.removeClass("active");
			this.requestList();
		},

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