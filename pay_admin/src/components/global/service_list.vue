<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 全局管理 >
				<span class="cp">客服列表</span>
			</dl>
		</div>
		<div class="am-g" id="open_num">
			<form class="am-form">
				<!-- 新增会员 -->
				<div class="add_member fl">
					<el-button type="primary" icon="el-icon-plus" size="small" @click="operation_data({type: 'add'})">新增</el-button>
				</div>

				<!-- 用户名 --> 
				<div class="username fl ml10">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.nickName" placeholder="客服名称"></el-input>
						</el-form-item>
						
					</el-form>
				</div>
				<div class="username fl ml10">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.account" placeholder="客服账号"></el-input>
						</el-form-item>
					</el-form>
				</div>
					

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<table width="100%" class="common_table">
				<colgroup>
					<col width="25" />
					<col width="auto" />
					<col width="auto" />
					<col width="auto" />
					<col class="control_W" width="300" />
				</colgroup>
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>客服名称</th>
						<th>客服账号</th>
						<th>管理员账号</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList" v-show="dataList.length > 0" v-for="(item, index) in dataList" :key="index">
						<td>
							<input type="checkbox" :value="item.account" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.nickname }}</td>
						<td>{{ item.account }}</td>
						<td>{{ item.username }}</td>
						<td class="control_C">
							<span class="editor_btn cp ml10 auth_eduit" @click="operation_data({nickName: item.nickname, id: item.id, type: 'eduit'})"><i class="el-icon-edit-outline"></i>编辑</span>
							<span class="editor_btn cp ml10 auth_allo" @click="operation_data({type: 'allot', username: item.username, account: item.account})"><i class="el-icon-setting"></i>分配</span>
							<span class="close_btn cp ml10 auth_del" @click="operation_data({type: 'del', account: item.account})"><i class="el-icon-close"></i>删除</span>
						</td>
					</tr>
					<tr v-if="dataList" v-show="dataList.length <= 0" class="no_data">
						<td colspan="5">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有后台客服列表信息</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default auth_del" @click="operation_data({type: 'del'})">
					<span class="am-icon-trash-o"></span> 删除</button>
			</div>
			</form>
		</div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: {},				// 列表数据
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据
				
				form: {
					prompt: true,			// 加载层
					nickName: '',			// 用户名
					account: '',			// 账号查询
					page: 1,				// 页数
					pageSize: 100			// 页容量
				}
			}
		},
		created() {
			this.request_data();
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$axios.post('Admin/customerService_list', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})

			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data()
			},

			// 全选按钮
			checked_all() {
				this.is_select_all = !this.is_select_all;
				if (this.is_select_all) {
					this.dataList.forEach((item) => {
						if (!this.checked_data.includes(item.account))
						this.checked_data.push(item.account);
					})
				} else 
					this.checked_data = [];
			},
			// 单选按钮
			checked_one() {
				if (this.dataList.length === this.checked_data.length)
					this.is_select_all = true;
				else
					this.is_select_all = false;
			},


			// 数据操作
			operation_data({type, nickName, id, username, account}) {
				let self = this;
				if (type == 'eduit') {
					this.$cm_m.e_layer({
						title: '编辑',
						area: ['550px', '190px'],
						content: `
							<style>
								.e_layer_container {
									padding: 30px;
									height: 50px;
								}
							</style>
							<label>
								<span class="l_title_big">客服名称：</span>
								<input value="${nickName}" class="l_p l_sort_big admin_nickname" type="text" />
							</label>
						`,
						btn1(index) {

							if (!$('.admin_nickname').val().trim()) {
								layer.msg('客服名称不能为空', {icon: '2'})
								return;
							}
							self.$axios.post('Admin/customerService_edit', {nickName: $('.admin_nickname').val(), id})
							.then(res => {
								if (!res) {
									setTimeout(() => {
										self.request_data();
										layer.close(index);
									}, 1000)
								}
							})
						}
					})
				} else if (type == 'add') {
					this.$cm_m.e_layer({
						type: 1,
						title: '新增',
						area: ['550px', '250px'],
						content: `
							<style>
								.e_layer_container {
									padding: 10px;
									height: 50px;
								}
							</style>
							<div style="padding: 20px 20px 0;">
								<label>
									<span class="l_title_big">客服账号：</span>
									<input value="" class="l_p l_sort_big admin_account" type="text" />
								</label>
								<label>
									<span class="l_title_big">客服名称：</span>
									<input value="" class="l_p l_sort_big admin_nickname" type="text" />
								</label>
							</div>
						`,
						btn1(index) {
							// <label style='display:none'>
							// 	<span class="l_title_big">管理后台账号：</span>
							// 	<input value="" class="l_p l_sort_big admin_user" type="text" />
							// </label>
							// , adminName: $('.admin_user').val()
							if (!$('.admin_nickname').val().trim() || !$('.admin_account').val().trim() ) {
								layer.msg('请完善信息', {icon: '2'})
								return;
							}
							self.$axios.post('Admin/scustomerService_add', {nickName: $('.admin_nickname').val(), account: $('.admin_account').val()})
							.then(res => {
								if (!res) {
									setTimeout(() => {self.request_data();}, 1000);
									layer.close(index);
								}
							})
						}
					})
				} else if (type == 'del') {
					account = account || this.checked_data.join(',')
					
					if (!account) {
						layer.msg('请选择删除的数据', {
							icon: '2',
							time: 1000
						});
						return;
					}
					layer.confirm('是否删除数据？', {icon: 7, title: '删除'}, index => {
						self.$axios.post('Admin/customerService_delete', {account}).then(res => {
							if (!res) {
								self.checked_data = [];
								self.is_select_all = false;
								setTimeout(() => {self.request_data();}, 1000)
							}
						})
					})
				} else if (type == "allot") {
					this.$axios.post('Admin/customerAutoInfo', {username}).then(res => {

						this.$cm_m.e_layer({
							title: '分配用户',
							area: ['300px', '170px'],
							content: `
								<style>
									.e_layer_container {
										padding: 10px 20px;
										height: 50px;
									}
								</style>
								<div class="s_container" style="width: 100%; margin-top: 10px;">
									<select class="c_select" id="admin_select">
									<select>
								</div>
							`,
							btn1(index) {
								self.$axios.post('Admin/customerService_assignation', {
									groupId: $('#admin_select').val(),
									account,
									adminId: $('#admin_select option:selected').attr('adminId'),
								}).then(data => {
									if (!data) {
										setTimeout(() => {
											layer.close(index)
											self.request_data()
										}, 1500)
									}
								})
							},
							success() {
								let option_html = `<option data-name="" value="" adminId="">${username === '' ? '未分配' : '取消分配'}</option>`;
								res.admin.forEach(item => {
									option_html += `<option ${item.account === username ? 'selected' : ''} data-name="${item.account}" adminId="${item.admin_id}" value="${item.group}">${item.account}</option>`
								})
								$('#admin_select').html(option_html);
							}
						})
					})
				}
			},


			// 权限管理编辑
			authority(id) {
				let self = this;
				window.authority_id = id;
				layer.open({
					type: 2,
					title: '编辑',
					shade: [0],
					id: 'eduit_data',
					area: ['650px', '734px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/eduitAuthority`], //iframe的url，no代表不显示滚动条
					success() {
						$(window.frames[$('#eduit_data iframe').attr('id')].$('.el-button--primary')).on('click', () => {
							setTimeout(() => { 
								if (window.is_set_auth) {
									window.is_set_auth = false;
									layer.closeAll('iframe')
								}
							}, 1000)
						})
					},
					end() {
						self.request_data()
					}
				});	
			},

			// 分页
			handleSizeChange(val) {
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