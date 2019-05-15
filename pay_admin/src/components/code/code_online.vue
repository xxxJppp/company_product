<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>在线码户</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button @click="add" class="auth_add" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

			</div>

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>码户账号</th>
						<th>团长的账号</th>
						<th>微信返点比例</th>
						<th>支付宝返点比例</th>
						<th>押金数额</th>
						<th>收款额度</th>
						<th>创建时间</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_top_account }}</td>
						<td>{{ item.wx_rebate }}</td>
						<td>{{ item.ali_rebate }}</td>
						<td>{{ item.deposit_amount }}</td>
						<td>{{ item.gather_amount_limit }}</td>
						<td>{{ item.create_time }}</td>
 					</tr>
					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有在线码户列表信息</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
			</div>

			<div class="fr">
				<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="form.page"
				:page-sizes="$cm_d.pageSize"
				:page-size="form.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="dataList.sum">
				</el-pagination>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				rebatesList: [],
				dataList: {},
				disabled_member: false,		// 是否查询禁止登陆用户
				form: {
					prompt: true,
					cp_account: '',
					status: 0,
					page: 1,
					pageSize: 100
				}
			}
		},
		created() {
			this.request_data();
		},
		computed: {
			
		},
		methods: {
			request_data() {
				this.$axios.post('Code_provider/code_provider_online', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			select_data() {
				this.form.page = 1;
				this.request_data();
			},


			add() {
				layer.open({
					type: 1,
					area: ['500px', '320px'],
					btn: ['确认'],
					title: '新增码户',
					content: `
						<div class="__layer add_code">
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<input class="__layer_input code_account" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置码户账号</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">码户密码：</span>
								<input class="__layer_input code_password" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置码户密码</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">微信返点比例：</span>
								<select class="__layer_input wechat_rebate"></select>
								<span class="__layer_tips">请选择微信返点比例</span>
							</div>
							<div class="item">
								<span class="__layer_title">支付宝返点比例：</span>
								<select class="__layer_input alipay_rebate"></select>
								<span class="__layer_tips">请选择支付宝返点比例</span>
							</div>
						</div>
					`,
					success: () => {
						let rebateList = this.$store.getters.getRebateList.map(item => `<option value="${item.value}">${item.name}</option>`)
						$('.add_code .wechat_rebate, .add_code .alipay_rebate').html(rebateList.join(''));
					},
					yes: (layIndex) => {
						let passReg = /^[a-zA-Z0-9]{6,15}$/;
						
						let code_account = $('.add_code .code_account').val(),
							code_password = $('.add_code .code_password').val(),
							wechat_rebate = $('.add_code .wechat_rebate').val(),
							alipay_rebate = $('.add_code .alipay_rebate').val();

						if (code_account === '') { return layer.msg('请设置码户账号', {time: 1500, icon: 2}) };
						if (code_password === '') { return layer.msg('请设置码户密码', {time: 1500, icon: 2}) };
						if (!passReg.test(code_password)) { return layer.msg('密码由6-15位数字或字母组成', {time: 1500, icon: 2}); }

						this.$axios.post('Code_provider/code_provider_add', {
							cp_account: code_account,
							cp_password: code_password,
							wx_rebate: wechat_rebate,
							ali_rebate: alipay_rebate
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			edit(dataObj) {
				layer.open({
					type: 1,
					area: ['500px', '320px'],
					btn: ['确认'],
					title: '编辑码户',
					content: `
						<div class="__layer edit_code">
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<input class="__layer_input code_account" value="${dataObj.cp_account}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入码户账号</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">码户密码：</span>
								<input class="__layer_input code_password" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入码户密码</span>
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
						let wechatRebateList = this.$store.getters.getRebateList.map(item => `<option value="${item.value}" ${(item.value / 10) == dataObj.wx_rebate ? 'selected' : ''}>${item.name}</option>`)
						$('.edit_code .wechat_rebate').html(wechatRebateList.join(''));

						let alipayRebateList = this.$store.getters.getRebateList.map(item => `<option value="${item.value}" ${(item.value / 10) == dataObj.ali_rebate ? 'selected' : ''}>${item.name}</option>`)
						$('.edit_code .alipay_rebate').html(alipayRebateList.join(''));
					},
					yes: (layIndex) => {
						let code_account = $('.edit_code .code_account').val(),
							code_password = $('.edit_code .code_password').val(),
							wechat_rebate = $('.edit_code .wechat_rebate').val(),
							alipay_rebate = $('.edit_code .alipay_rebate').val();


						if (code_account === '') { return layer.msg('请输入码户账号', {time: 1500, icon: 2}) };

						this.$axios.post('Code_provider/code_provider_edit', {
							cp_account: code_account,
							cp_password: code_password,
							wx_rebate: wechat_rebate,
							ali_rebate: alipay_rebate,
							id: dataObj.id,
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			// 改变禁止用户
			change_disabled(status) {
				if (this.disabled_member) {
					this.form.status = 1;
					this.request_data();
				} else {
					this.form.status = 0;
					this.request_data();
				}
			},

			disabled(id) {
				layer.open({
					type: '1',
					title: '禁用账号',
					area: ['500px', '210px'],
					btn: ['确认'],
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
						$('.disabled_view [name="account_status"]').on('change', function() {
							const val = $(this).val();
							if(val === '0') {
								$('.disabled_view .disabled_time').val('').prop('disabled', true);
								$('.disabled_view .unit').html('');
								return;
							};
							$('.disabled_view .disabled_time').prop('disabled', false);
							const tgObj = {
								'1': '天',
								'2': '小时',
								'3': '分钟',
							};
							$('.disabled_view .unit').html(tgObj[val]);
						})
					},
					yes: (layIndex) => {
						const time_type = $('.disabled_view [name="account_status"]:checked').val();
						const time = status === '0' ? '' : $('.disabled_view .disabled_time').val();
						this.$axios.post('Code_provider/status_edit', {
							time_type, time, id,
							status: 1,
						}).then(res => {
							if(!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			enabled(id) {
				layer.confirm('是否要启用选中的成员账号？', {title: '启用', icon: 7}, layIndex => {
					this.$axios.post('Code_provider/status_edit', {
						id,
						status: 0
					}).then(data => {
						if (!data) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500)
						}
					})
				})
			},

			/**
			 * 显示时间
			 */
			showTime(id) {
				let timeId;
				layer.open({
					type: 1,
					title: '禁用时间',
					area: ['300px', '170px'],
					btn: ['确定'],
					skin: 'layui-layer-rim', //加上边框
					content: `
						<div class="__layer diabled_view">
							<div class="item mb0">
								<span class="__layer_title fl" style="width: 80px;">禁用时间：</span>
								<span style="width: 140px;" class="__layer_content diabled_time fl"></span>
							</div>
						</div>
					`,
					success: () => {
						this.$axios.post('Code_provider/residue_time', {id}).then(res => {
							if (!res) return;
							if (res.type == 'perpetual') {
								$('.diabled_view .diabled_time').html('永久')
							} else {
								const {day, hour, minute} = res;
								$('.diabled_view .diabled_time').html(`${day} 天 ${hour} 小时 ${minute} 分`)
								timeId = setInterval(() => {
									$('.diabled_view .diabled_time').html(`${day} 天 ${hour} 小时 ${minute} 分`)
								}, 60000);
							}
						})
					},
					end: () => {
						clearInterval(timeId);
					}
				});
			},

			handleSizeChange(val) {
				this.form.page = 1;
				this.form.pageSize = val;
				this.request_data();
			},
			handleCurrentChange(val) {
				this.form.page = val;
				this.request_data();
			}
		}
	}
</script>