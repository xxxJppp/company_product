<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 全局管理 >
				<span class="cp">充值域名管理</span>
			</dl>
		</div>
		<div class="am-g" id="open_num">
			<form class="am-form">
				<!-- 新增 -->
				<div class="add_member fl">
					<el-button type="primary" icon="el-icon-plus" size="small" @click="add()">新增</el-button>
				</div>

				<!-- 用户名 --> 
				<div class="username fl ml10" style="width: 350px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="select_data" style="width: 350px;" v-model="form.domain" placeholder="请输入域名"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<table width="100%" class="common_table">
					<thead>
						<tr>
							<th>域名</th>
							<th>备注</th>
							<th>状态</th>
							<th class="control_T">操作</th>
						</tr>
					</thead>

					<tbody class="common_tbody">
						<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
							<td>{{ item.domain }}</td>

							<td>
								<span class="info_ auth_write" @click="$cm_m.textarea_layer('Risk/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callBack: request_data})">{{ item.remark == '' ? '填写' : '查看' }}</span>
							</td>

							<td :class="$cm_d.tg['pay_status_color'][item.status]">{{ $cm_d.tg['pay_status'][item.status] }}</td>

							<td class="control_C">
								<span v-if="item.status == 0" class="close_btn cp ml10 is_open" @click="disabled(item.id)"><i class="el-icon-close"></i>禁用</span>
								<span v-if="item.status != 0" class="open_btn cp ml10 is_open" @click="enabled(item.id)"><i class="el-icon-check"></i>启用</span>

								<span class="editor_btn cp ml10 auth_eduit" @click="edit(item)"><i class="el-icon-edit-outline"></i>编辑</span>
							</td>

						</tr>
						<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
							<td colspan="5">
								<img src="../../statics/images/icon/nodate.png">
								<p>暂时没有充值域名列表</p>
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
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: {},				// 列表数据
				domainReg: /^(http|https):\/\//,	// 域名验证正则
				form: {
					prompt: true,			// 加载层
					domain: '',				// 域名
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
				this.$axios.post('Risk/pay_url', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data()
			},

			/**
			 * 添加充值链接
			 */
			add() {
				layer.open({
					type: 1,
					area: ['510px', '300px'],
					btn: ['新增', '取消'],
					title: '新增充值链接',
					content: `
						<div class="__layer add-payurl">
							<div class="item mb15">
								<span class="__layer_title" style="width: 60px;">域名：</span>
								<input class="__layer_input domain" style="width: 400px" type="text" autocomplete="off"/>
							</div>
							<div class="item mb0" style="height: auto">
								<span class="__layer_title" style="width: 60px;">备注：</span>
								<textarea class="__layer_textarea remark" style="width: 400px; height: 120px;"></textarea>
							</div>
						</div>
					`,
					yes: (layerIndex) => {
						const domain = $('.add-payurl .domain').val(),
							remark = $('.add-payurl .remark').val();
						
						if (!this.domainReg.test(domain)) { return layer.msg('域名地址开头必须为http或https', {icon: 2, time: 1500}); }
						this.$axios.post('Risk/pay_url_add', {
							domain, remark
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layerIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			/**
			 * 编辑充值链接
			 */
			edit(dataObj) {
				layer.open({
					type: 1,
					area: ['510px', '300px'],
					btn: ['修改', '取消'],
					title: '编辑充值链接',
					content: `
						<div class="__layer add-payurl">
							<div class="item mb15">
								<span class="__layer_title" style="width: 60px;">域名：</span>
								<input class="__layer_input domain" value="${dataObj.domain}" style="width: 400px" type="text" autocomplete="off"/>
							</div>
							<div class="item mb0" style="height: auto">
								<span class="__layer_title" style="width: 60px;">备注：</span>
								<textarea class="__layer_textarea remark" style="width: 400px; height: 120px;">${dataObj.remark}</textarea>
							</div>
						</div>
					`,
					yes: (layerIndex) => {
						const domain = $('.add-payurl .domain').val(),
							remark = $('.add-payurl .remark').val();
						
						if (!this.domainReg.test(domain)) { return layer.msg('域名地址开头必须为http或https', {icon: 2, time: 1500}); }

						this.$axios.post('Risk/pay_url_edit', {
							id: dataObj.id,
							domain, remark
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layerIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},


			/**
			 * 禁用充值链接
			 * @param {Number} id 修改数据的对应id
			 */
			disabled(id) {
				layer.confirm('是否要禁用选中的充值域名？', {title: '禁用', icon: 7}, layIndex => {
					this.$axios.post('Risk/status_edit', {
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

			/**
			 * 启用充值链接
			 * @param {Number} id 修改数据的对应id
			 */
			enabled(id) {
				layer.confirm('是否要启用选中的充值域名？', {title: '启用', icon: 7}, layIndex => {
					this.$axios.post('Risk/status_edit', {
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