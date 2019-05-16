<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>微信店员管理</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button
						@click="addClerk"
						class="auth_add"
						type="primary"
						icon="el-icon-plus"
						size="small"
					>新增</el-button>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.wx_account" placeholder="微信号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.wx_nickname" placeholder="微信昵称"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="状态">
								<el-option label="全部" value=""></el-option>
								<el-option label="正常" value="0"></el-option>
								<el-option label="禁用" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>


				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<div class="fl" style="margin-left: 30px; margin-top: 5px;">
					<el-checkbox @change="changeStatus($event)">禁用</el-checkbox>
				</div>

			</div>

			<table width="100%" class="common_table">
				
				<thead>
					<tr>
						<th>微信号</th>
						<th>微信昵称</th>
						<th>微信内部ID</th>
						<th>创建时间</th>
						<th>状态</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list">
					<tr v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="item.id">
						<td>{{ item.wx_account }}</td>
						<td>{{ item.wx_nickname }}</td>
						<td>{{ item.wx_id }}</td>
						<td>{{ item.create_time }}</td>
						<td :class="$cm_d.tg['wechat_status_color'][item.status]">{{ $cm_d.tg['wechat_status'][item.status] }}</td>

						<td class="control_C">
							<span class="editor_btn cp auth_eduit" @click="editClerk(item)"><i class="el-icon-edit-outline"></i>编辑</span>

							<span v-if="item.status === 0" class="close_btn cp ml5" @click="disabledClerk(item.id)"><i class="el-icon-close"></i>禁用</span>
							<span v-if="item.status === 1" class="open_btn cp ml5" @click="openClerk(item.id)"><i class="el-icon-check"></i>启用</span>
						</td>
					</tr>
					
					

					<tr v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有微信店员列表信息</p>
						</td>
					</tr>
				</tbody>
			</table>

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
				dataList: { list: [] },	

				form: {
					prompt: true,		
					page: 1,			
					pageSize: 100,		

					wx_nickname: '',		
					wx_account: '',	
					status: '0',		// 状态（0正常1禁用）默认0
				}
			}
		},
		created() {
			this.request_data();
		},
		computed: {
			
		},
		mounted() {
			this.$cm_m.auth_btn();
		},
		methods: {
			request_data() {
				this.$axios.post('Assis/wx_assis_list', this.form).then((res) => {
					if (res.error) { return }; 

					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},

			select_data() {
				this.form.page = 1;
				this.request_data();
			},

			/**
			 * 改变状态
			 */
			changeStatus(bool) {
				this.form.status = bool ? '1' : '0';
				this.request_data();
			},

			/**
			 * 新增微信店员
			 */
			addClerk() {
				layer.open({
					type: 1,
					area: ['450px', '260px'],
					btn: ['新增', '取消'],
					title: '新增微信店员',
					content: `
						<div class="__layer add-clerk">
							<div class="item mb15">
								<span class="__layer_title">微信号：</span>
								<input class="__layer_input wx-account" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入微信号</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">微信昵称：</span>
								<input class="__layer_input wx-nickname" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入微信昵称</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">微信内部ID：</span>
								<input class="__layer_input wx-id" type="number" autocomplete="off"/>
								<span class="__layer_tips">微信内部ID可为空</span>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let wx_nickname = $('.add-clerk .wx-nickname').val(),
							wx_account = $('.add-clerk .wx-account').val(),
							wx_id = $('.add-clerk .wx-id').val();

						if(wx_nickname === '') return layer.msg('请输入微信号！', {time: 1500, icon: 2});
						if(wx_account === '') return layer.msg('请输入微信昵称！', {time: 1500, icon: 2});

						this.$axios.post('Assis/wx_assis_add', {
							wx_nickname,
							wx_account,
							wx_id,
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

			/**
			 * 编辑微信店员
			 */
			editClerk(dataObj) {
				layer.open({
					type: 1,
					area: ['465px', '315px'],
					btn: ['确认', '取消'],
					title: '编辑微信店员',
					content: `
						<div class="__layer add-clerk">
							<div class="item mb15">
								<span class="__layer_title">微信号：</span>
								<input class="__layer_input wx-account" value="${dataObj.wx_account}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入微信号</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">微信昵称：</span>
								<input class="__layer_input wx-nickname" value="${dataObj.wx_nickname}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入微信昵称</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">微信内部ID：</span>
								<input class="__layer_input wx-id" value="${dataObj.wx_id}" type="number" autocomplete="off"/>
								<span class="__layer_tips">微信内部ID不能为空</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">账号类型：</span>

								<input type="radio" class="__layer_radio" id="wx_account_type_1" name="wx_account_type" value="0" ${dataObj.status === 0 ? 'checked' : ''}>
								<label for="wx_account_type_1" style="margin-right: 20px;">正常</label>

								<input type="radio" class="__layer_radio" id="wx_account_type_2" name="wx_account_type" value="1" ${dataObj.status === 1 ? 'checked' : ''}>
								<label for="wx_account_type_2" style="margin-right: 20px;">禁用</label>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let wx_nickname = $('.add-clerk .wx-nickname').val(),
							wx_account = $('.add-clerk .wx-account').val(),
							wx_id = $('.add-clerk .wx-id').val(),
							status = $('.add-clerk [name="wx_account_type"]:checked').val();

						if(wx_nickname === '') return layer.msg('请输入微信号！', {time: 1500, icon: 2});
						if(wx_account === '') return layer.msg('请输入微信昵称！', {time: 1500, icon: 2});
						if(wx_id === '') return layer.msg('微信内部ID不能为空！', {time: 1500, icon: 2});

						this.$axios.post('Assis/wx_assis_edit', {
							id: dataObj.id,
							wx_nickname,
							wx_account,
							wx_id,
							status,
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

			/**
			 * 分配操作
			 * @param {Numberr} id 
			 */
			allocation(id) {
				layer.open({
					type: 1,
					area: ['350px', '160px'],
					btn: ['分配', '取消'],
					title: '分配操作',
					content: `
						<div class="__layer allocation_view">
							<div class="item mb0">
								<span class="__layer_title" style="width: 95px;">码户账号：</span>
								<input type="text" class="__layer_input cp_account"/>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						const cp_account = $('.allocation_view .cp_account').val();
						if (cp_account == '') return layer.msg('请输入分配的码户账号', { time: 1500, icon: 2 });

						this.$axios.post('Code_Provider/wx_assis_matching', {
							id: id,
							cp_account,
							prompt: true,
						}).then(res => {
							if(!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500);
							}
						})
					}
				})
			},

			/**
			 * 禁用对应码户
			 * @param {Numberr} id 
			 */
			disabled(id) {
				layer.open({
					type: 1,
					area: ['350px', '160px'],
					btn: ['确认', '取消'],
					title: '禁用对应码户操作',
					content: `
						<div class="__layer disabled_view">
							<div class="item mb0">
								<span class="__layer_title" style="width: 95px;">码户账号：</span>
								<input type="text" class="__layer_input cp_account"/>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						const cp_account = $('.disabled_view .cp_account').val();
						if (cp_account == '') return layer.msg('请输入禁用的码户账号', { time: 1500, icon: 2 });

						this.$axios.post('Code_provider/wx_assis_forbidden', {
							id: id,
							cp_account,
							prompt: true,
						}).then(res => {
							if(!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500);
							}
						})
					}
				})
			},

			/**
			 * 取消操作
			 * @param {Numberr} id
			 */
			cancel(id) {
				layer.confirm('是否进行取消操作？', {icon: 7, title:'取消'}, (index) => {
					this.$axios.post('Code_Provider/wx_assis_cancel', {id}).then((res) => {
						if (!res) {
							layer.close(index)
							setTimeout(() => {this.request_data()}, 1500)
						}
					})
				})
			},

			/**
			 * 启用操作
			 */
			openClerk(id) {
				layer.confirm('是否要启用选中的微信店员？', {title: '启用操作', icon: 7}, layIndex => {
					this.$axios.post('Assis/wx_assis_status', {
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
			 * 禁用操作
			 */
			disabledClerk(id) {
				layer.confirm('是否要禁用选中的微信店员？', {title: '禁用操作', icon: 7}, layIndex => {
					this.$axios.post('Assis/wx_assis_status', {
						id,
						status: 1
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