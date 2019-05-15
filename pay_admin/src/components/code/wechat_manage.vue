<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>微信店员管理</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.wx_nickname" placeholder="微信昵称"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_nickname" placeholder="码户昵称"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="lottery_status fl ml10" style="width: 150px;">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.event_type" placeholder="事件类型">
								<el-option label="全部" value=""></el-option>
								<el-option label="通过店员申请" value="0"></el-option>
								<el-option label="取消店员通知" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="状态">
								<el-option label="全部" value=""></el-option>
								<el-option label="未处理" value="0"></el-option>
								<el-option label="已处理" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>


				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<div class="fl" style="margin-left: 30px; margin-top: 5px;">
					<el-checkbox @change="change_hind($event)">隐藏</el-checkbox>
				</div>

			</div>

			<table width="100%" class="common_table">
				
				<thead>
					<tr>
						<th>微信昵称</th>
						<th>微信号</th>
						<th>真实姓名</th>
						<th>码户账号</th>
						<th>码户昵称</th>
						<th>事件类型</th>
						<th>事件时间</th>
						<th>状态</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.wx_nickname }}</td>
						<td>{{ item.wx_account }}</td>
						<td>{{ item.real_name }}</td>
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>

						<td>{{ $cm_d.tg['event_type'][item.event_type] }}</td>
						<td>{{ item.event_time }}</td>
						<td :class="$cm_d.tg['wechat_status_color'][item.status]">{{ $cm_d.tg['wechat_status'][item.status] }}</td>

						<td class="control_C">
							<span v-if="item.is_hind == 0" class="close_btn cp " @click="hind(item.id)"><i class="el-icon-close"></i>隐藏</span>
							<span v-if="item.is_hind == 1" class="open_btn cp ml5 " @click="show(item.id)"><i class="el-icon-check"></i>显示</span>

							<span v-if="item.event_type == 0 && item.status != 1" class="editor_btn cp auth_allo" @click="allocation(item.id)"><i class="el-icon-edit-outline"></i> 分配</span>
							<span v-if="item.event_type == 1 && item.status != 1" class="editor_btn cp auth_disabledCode" @click="disabled(item.id)"><i class="el-icon-edit-outline"></i> 禁用对应码户</span>
							<span v-if="item.status == 1" class="editor_btn cp auth_cancel ml5" @click="cancel(item.id)"><i class="el-icon-close"></i> 取消</span>
						</td>
					</tr>
					
					

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="12">
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
					is_hind: 0,

					wx_nickname: '',		
					cp_account: '',	
					cp_nickname: '',	
					event_type: '',	// 事件类型（0通过店员申请1取消店员通知）
					status: '0',		// 状态（0未处理1已处理；默认为0）
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
				this.$axios.post('Code_Provider/wx_assis', this.form).then((res) => {
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
			 * 查询隐藏
			 */
			change_hind(e) {
				this.form.is_hind = e ? 1 : 0;
				this.select_data();
			},

			/**
			 * 显示操作
			 */
			show(id) {
				layer.confirm('是否要显示选中的记录？', {title: '显示', icon: 7}, layIndex => {
					this.$axios.post('Code_Provider/wx_assis_status_edit', {
						id,
						is_hind: 0
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
			 * 隐藏操作
			 */
			hind(id) {
				layer.confirm('是否要隐藏选中的记录？', {title: '隐藏', icon: 7}, layIndex => {
					this.$axios.post('Code_Provider/wx_assis_status_edit', {
						id,
						is_hind: 1
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