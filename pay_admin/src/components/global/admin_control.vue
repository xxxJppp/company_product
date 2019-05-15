<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 全局管理 >
				<span class="cp">后台管理员</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
				<!-- 新增会员 -->
				<div class="add_member fl">
					<el-button @click="add_member" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>

				<!-- 用户名 -->
				<div class="username fl ml10">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.account" placeholder="用户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 用户组 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.groupId" placeholder="用户组">
								<el-option label="全部分组" value=""></el-option>
								<el-option v-for="(item, index) in group" :key="index" :label="item.group_name" :value="item.group_id"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<!-- 状态 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="状态">
								<el-option label="全部状态" value=""></el-option>
								<el-option label="启用" value="1"></el-option>
								<el-option label="禁用" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				
				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

			</div>

			<table width="100%" class="common_table">
				<colgroup>
					<col width="25" />
					<col width="auto" />
					<col width="auto" />
					<col width="auto" />
					<col width="auto" />
					<col class="control_W" width="290" />
				</colgroup>
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>账号</th>
						<th>状态</th>
						<th>用户组</th>
						<th>最后登录时间</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>
							<input type="checkbox" :value="item.admin_id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.account }}</td>
						<td :class="$cm_d.tg['admin_type_c'][item.status]">{{ $cm_d.tg['admin_type'][item.status] }}</td>
						<td>{{ item.group_name }}</td>
						<td>{{ item.last_login_time }}</td>
						<td class="control_C">
							<span class="editor_btn cp ml5 auth_eduit" @click="edit_admin(item)"><i class="el-icon-edit-outline"></i>编辑</span>
							<span class="editor_btn cp ml5 auth_group" @click="memberPacket({adminId: item.admin_id, name: item.group_name})"><i class="el-icon-setting"></i>分组</span>
							<span v-if="item.status == 1" class="close_btn cp ml5 is_open" @click="change_status({type: 3, status: 0, adminId: item.admin_id})"><i class="el-icon-close"></i>禁用</span>
							<span v-if="item.status == 0" class="open_btn cp ml5 is_open" @click="change_status({type: 3, status: 1, adminId: item.admin_id})"><i class="el-icon-check"></i>启用</span>
							<span class="remove_btn cp ml5 auth_del" @click="remove_data(item.admin_id)"><i class="el-icon-delete"></i>删除</span>
						</td>
					</tr>
					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="5">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有后台管理员</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default auth_del" @click="remove_data()">
					<span class="am-icon-trash-o"></span> 删除</button>
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
				dataList: { list:[] },				// 列表数据
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据
				group: [],					// 分组信息
				form: {
					prompt: true,			// 加载层
					groupId: '',			// 分组id
					status: '',				// 状态
					account: '',			// 账号
					page: 1,				// 页数
					pageSize: 100			// 页容量
				}
			}
		},
		created() {
			this.request_data();

			// 获取分组信息
			this.$axios.post('Admin/userGroup').then(res => {
				this.group = res.group;
			})
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$axios.post('Admin/admin_info', this.form).then((res) => {
					this.dataList = res
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
						if (!this.checked_data.includes(item.admin_id))
						this.checked_data.push(item.admin_id);
					})
				} else 
					this.checked_data = [];
			},
			// 单选按钮
			checked_one() {
				if (this.dataList.length === this.checked_data.length) {
					this.is_select_all = true;
				}
				else {
					this.is_select_all = false;
				}
			},

			// 删除请求
			remove_request(obj) {
				layer.confirm('是否删除此管理员？', {icon: 7, title: '删除'},index => {
					let sendData={};
					sendData.adminId=obj.adminId+'';
					this.$axios.post('Admin/delete_admin',sendData ).then((res) => {
						if (!res) {
							this.is_select_all = false;
							this.checked_data = [];
							setTimeout(() => {this.request_data();}, 1000)
						}
					})
				})
			},
			// 删除记录
			remove_data(adminId) {
				if (adminId) {
					if (adminId == window.$userInfo.admin_id) {
						layer.msg('不能删除自身账号', {
							icon: '2',
							time: 1000
						})
						return;
					}
					this.remove_request({adminId})
				}
				else {
					if(this.checked_data.length <= 0) {
						layer.msg('请选择删除的数据', {
							icon: '2'
						});
						return;
					}

					if(this.checked_data.includes(window.$userInfo.admin_id)) {
						layer.msg('不能删除自身账号', {
							icon: '2',
							time: 1000
						})
						return;
					}
					this.remove_request({
						adminId: this.checked_data
					})
				}
			},

			
			// 分组
			memberPacket({adminId, name}) {
				let self = this;
				this.$cm_m.e_layer({
					title: '分组操作',
					area: ['30px', '200px'],
					content: `
						<style>
							.e_layer_container {
								padding: 10px;
								height: 50px;
							}
						</style>
						<div class="s_container" style="width: 100%">
							<select class="c_select" id="packet_select">
							<select>
						</div>
					`,
					btn1(index) {
						self.$axios.post('Admin/edit_admin_fz', {
							type: 2,
							groupId: $('#packet_select').val(),
							adminId
						}).then(res => {
							if(!res) {
								setTimeout(() => {self.request_data();}, 1000)
							}
						})
					},
					success() {
						let group = self.group;
						let option_html = '';
						group.forEach(item => {
							option_html += `<option data-name="${item.group_name}" value="${item.group_id}">${item.group_name}</option>`
						})
						$('#packet_select').html(option_html);
						$(`#packet_select option[data-name="${name}"]`).prop('selected', true)
					}
				})
			},

			// 编辑会员
			edit_admin(obj) {
				let self = this;
				this.$cm_m.e_layer({
					title: '编辑',
					area: ['550px', '400px'],
					content: `
						<style>
							.e_layer_container {
								padding: 10px;
								height: 50px;
							}
						</style>
						<label>
							<span class="l_title_big">账号：</span> &nbsp;&nbsp;${obj.account}
						</label>
						<label>
							<span class="l_title_big">昵称：</span><input value="${obj.nickname}" class="l_p l_sort_big admin_nickname" type="text" />
						</label>
						<label>
							<span class="l_title_big">密码：</span><input value="${obj.password}" class="l_p l_sort_big admin_password" type="text" />
							<span class="sub_msg">密码长度为6-14位</span>
						</label>
						<label>
							<span class="l_title_big fl" style="position: relative; top: 8px;">分组：</span>
							<div class="s_container fl" style="width: 300px;">
								<select class="c_select" id="admin_packet_select">
								<select>
							</div>
						</label>
						<input id="status_one" value="1" name="bank_status" type="radio" />
						<div class="admin_status_container">
							<span class="l_title_big">状态：</span>
							<input id="status_o" value="1" name="admin_status" type="radio" />
							<label class="auto" for="status_o">正常</label>
							<input id="status_t" value="0" name="admin_status" type="radio" />
							<label class="auto" for="status_t" style="margin-left: 30px;">禁用</label>
						</div>
					`,
					success() {
						let group = self.group;
						let option_html = '';
						group.forEach(item => {
							option_html += `<option data-name="${item.group_name}" value="${item.group_id}">${item.group_name}</option>`
						})
						$('#admin_packet_select').html(option_html);
						$(`#admin_packet_select option[data-name="${obj.group_name}"]`).prop('selected', true)
						$(`.admin_status_container input[value="${obj.status}"]`).prop('checked', true)
					},
					btn1(index) {
						if ($('.admin_password').val().length < 4 || $('.admin_password').val().length > 20) {
							layer.msg('请输入正确长度的密码', {
								icon: '2'
							})
							return;
						}
						self.$axios.post('Admin/edit_admin', {
							type: 1,
							password: $('.admin_password').val(),
							groupId: $('#admin_packet_select').val(),
							status: $('.admin_status_container input:checked').val(),
							nickName: $('.admin_nickname').val(),
							adminId: obj.admin_id
						}).then(res => {
							if(!res) {
								setTimeout(() => {self.request_data();}, 1000)
							}
						})
					}
				})
			},

			// 添加会员
			add_member() {
				let self = this;
				window.admin_group = this.group;
				layer.open({
					type: 2,
					title: '添加用户',
					shade: [0],
					id: 'eduit_data_one',
					area: ['450px', '450px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/add_admin`, 'no'], //iframe的url，no代表不显示滚动条
					success: () => {
						window.can_close_iframe = () => {
							setTimeout(() => { layer.closeAll('iframe'); this.request_data() }, 1000)
						}
					},
				});	
			},

			// 更改用户状态
			change_status(obj) {
				let self = this;
				if (obj.adminId == window.$userInfo.admin_id) {
					layer.msg('不能禁用自身账号', {
						icon: '2',
						time: 1000
					})
					return;
				}
				let text;
				if(obj.status) {
					text='启用';
				} else {
					text = '禁用';
				}

				layer.confirm(`是否${text}该管理员`, {icon: 7, title: text}, index => {
					self.$axios.post('Admin/edit_admin_status', obj).then(res => {
						if(!res) {
							setTimeout(() => {self.request_data();}, 1000)
						}
					})
				})
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