<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 全局管理 >
				<span class="cp">权限管理</span>
			</dl>
		</div>
		<div class="am-g" id="open_num">
			<form class="am-form">
				<!-- 新增会员 -->
				<div class="add_member fl">
					<el-button type="primary" icon="el-icon-plus" size="small" @click="operation_data({type: 1})">新增</el-button>
				</div>

				<!-- 用户名 --> 
				<div class="username fl ml10">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.username" placeholder="用户名"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<table width="100%" class="common_table">
				<colgroup>
					<col width="25" />
					<col width="150" />
					<col width="auto" />
					<col width="auto" />
					<col class="control_W" width="400" />
				</colgroup>
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>ID</th>
						<th>用户组</th>
						<th>状态</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.group_id }}</td>
						<td>{{ item.group_name }}</td>
						<td :class="item.status == 0 ? 'red': 'green'">{{ item.status == 0 ? '禁用': '启用' }}</td>
						<td class="control_C">
							<span class="editor_btn cp ml10 auth_auth" @click="allot(item.group_id)"><i class="el-icon-setting"></i>成员</span>
							<span v-if="item.group_id != 1" class="editor_btn cp ml10 auth_auth" @click="authority(item.group_id)"><i class="el-icon-setting"></i>授权</span>
							<span v-if="item.group_id != 1" class="editor_btn cp ml10 auth_eduit" @click="operation_data({type: 4, groupId:item.group_id, groupName: item.group_name})"><i class="el-icon-edit-outline"></i>编辑</span>
							<span v-if="item.group_id != 1 && item.status == 1" class="close_btn cp ml10 is_open" @click="operation_data({type: 3, groupId:item.group_id, status: 0})"><i class="el-icon-close"></i>禁用</span>
							<span v-if="item.group_id != 1 && item.status != 1" class="open_btn cp ml10 is_open" @click="operation_data({type: 3, groupId:item.group_id, status: 1})"><i class="el-icon-check"></i>启用</span>
							<span v-if="item.group_id != 1" class="remove_btn cp ml10 auth_del" @click="operation_data({type: 2, groupId: item.group_id})"><i class="el-icon-delete"></i>删除</span>
						</td>
					</tr>
					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="5">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有会员列表</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default" @click="operation_data({type: 2})">
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
					username: '',			// 用户名
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
				this.$axios.post('Admin/showGroup', this.form).then((res) => {
					layer.closeAll('loading')
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
						if (!this.checked_data.includes(item.id))
							this.checked_data.push(item.id);
					})
				} else 
					this.checked_data = [];
			},
			// 单选按钮
			checked_one() {
				console.log(this.dataList.length, this.checked_data.length)
				if (this.dataList.length === this.checked_data.length)
					this.is_select_all = true;
				else
					this.is_select_all = false;
			},


			// 成员
			allot(groupId) {
				let self = this;

				window.$allot_data = groupId;

				layer.open({
					type: 2,
					title: '成员',
					shade: [0],
					id: 'allot_data',
					area: ['650px', '734px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/allot`], //iframe的url，no代表不显示滚动条
					success() {
						$(window.frames[$('#allot_data iframe').attr('id')].$('.el-button--primary')).on('click', () => {
							
							setTimeout(() => { 
								if (window.is_set_allot) {
									window.is_set_allot = false;
									layer.closeAll('iframe')
								}
							}, 1000)
						})
					}
				});	
				return;
			},

			// 数据操作
			operation_data({type, groupId, status, groupName}) {
				let self = this;
				// 添加
				if (type == 1) {
					this.$cm_m.e_layer({
						title: '增加分组',
						area: ['550px', '200px'],
						content: `
							<style>
								.e_layer_container {
									padding: 10px;
									height: 50px;
								}
							</style>
							<label>
								<span class="l_title_big">分组名称：</span><input value="" class="l_p l_sort_big auth_class_name" type="text" />
							</label>
						`,
						btn1(index) {
							self.$axios.post('Admin/OperatingGroup_add', {groupName: $('.auth_class_name').val(), type})
							.then(res => {
								layer.msg('添加成功', {
									icon: '1'
								})
								setTimeout(() => {self.request_data();}, 1000)
							})
						}
					})
				// 删除
				} else if (type == 2) {
					if(!groupId && this.checked_data.length <= 0) {
						layer.msg('请选择删除的数据', {
							icon: 2,
							time: 1000
						})
						return;
					}
					layer.confirm('是否要删除？', {icon: 7, title:'删除'}, (index) => {
						this.$axios.post('Admin/OperatingGroup_del', {groupId: groupId || this.checked_data.join(','), type}).then(res => {
							layer.msg('删除成功', {
								icon: '1'
							})
							setTimeout(() => {self.request_data();}, 1000)
						})
					})

				// 启用/禁用
				} else if (type == 3) {
					let text,title;
					if (status == 1) {
						text = '是否要启用此分组？', title = '启用'
					} else {
						text = '是否要禁用此分组？', title = '禁用'
					}
					layer.confirm(text, {icon: 7, title}, (index) => {
						this.$axios.post('Admin/OperatingGroup_status', {type, groupId, status}).then(res => {
							layer.msg(`${title}成功`, {
								icon: '1'
							})
							setTimeout(() => {self.request_data();}, 1000)
						})
					})
				} else if (type == 4) {
					this.$cm_m.e_layer({
						title: '编辑',
						area: ['550px', '200px'],
						content: `
							<style>
								.e_layer_container {
									padding: 10px;
									height: 50px;
								}
							</style>
							<label>
								<span class="l_title_big">分组名称：</span><input value="${groupName}" class="l_p l_sort_big auth_class_name" type="text" />
							</label>
						`,
						btn1(index) {
							self.$axios.post('Admin/OperatingGroup_edit', {groupName: $('.auth_class_name').val(), type, groupId})
							.then(res => {
								layer.msg('修改成功', {
									icon: '1'
								})
								setTimeout(() => {self.request_data();}, 1000)
							})
						}
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
					area: ['700px', '734px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/eduit_authority`], //iframe的url，no代表不显示滚动条
					success() {
						$(window.frames[$('#eduit_data iframe').attr('id')].$('.el-button--primary')).on('click', () => {
							
							setTimeout(() => { 
								if (window.is_set_auth) {
									layer.closeAll('iframe')
								}
							}, 1000)
						})
					},
					end() {
						if (window.is_set_auth) {
							window.is_set_auth = false;
							self.request_data()
						}
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