<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 全局管理 >
				<span class="cp">支付频率管理</span>
			</dl>
		</div>
		<div class="am-g" id="open_num">
			<form class="am-form">
				<!-- 新增 -->
				<div class="add_member fl">
					<el-button type="primary" icon="el-icon-plus" size="small" @click="add()">新增</el-button>
				</div>

				<!-- 用户名 --> 
				<div class="username fl ml10">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_account" placeholder="商户账号"></el-input>
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
						<th>商户ID</th>
						<th>商户账号</th>
						<th>频率限制</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.mch_id }}</td>
						<td>{{ item.mch_account }}</td>
						<td>
							<span class="red">{{ item.freq_minute }}</span>
							分钟内，最多发起
							<span class="red">{{ item.freq_count }}</span>
							次支付
						</td>
						<td class="control_C">
							<span class="editor_btn cp ml10 auth_eduit" @click="edit(item)"><i class="el-icon-edit-outline"></i>编辑</span>
							<span class="remove_btn cp ml10 auth_del" @click="del([item.id])"><i class="el-icon-delete"></i>删除</span>
						</td>
					</tr>
					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="5">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有支付频率管理</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default" @click="del(checked_data)">
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
					mch_account: '',		// 商户账号
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
				this.$axios.post('Overall/pay_freq', this.form).then((res) => {
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
					this.dataList.list.forEach((item) => {
						if (!this.checked_data.includes(item.id))
							this.checked_data.push(item.id);
					})
				} else 
					this.checked_data = [];
			},
			// 单选按钮
			checked_one() {
				if (this.dataList.list.length === this.checked_data.length)
					this.is_select_all = true;
				else
					this.is_select_all = false;
			},

			// 添加
			add() {
				layer.open({
					type: 1,
					area: ['500px', '210px'],
					btn: ['确认'],
					title: '新增频率限制',
					content: `
						<div class="__layer add_pay_rate">
							<div class="item mb15">
								<span class="__layer_title">商户账号：</span>
								<input class="__layer_input mch_account" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入商户账号</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">频率限制：</span>
								<input class="__layer_input freq_minute" style="width: 50px;" type="number" autocomplete="off"/>
								 分钟内，最多发起 
								<input class="__layer_input freq_count" style="width: 50px;" type="number" autocomplete="off"/>
								 次支付
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let mch_account = $('.add_pay_rate .mch_account').val(),
							freq_minute = $('.add_pay_rate .freq_minute').val(),
							freq_count = $('.add_pay_rate .freq_count').val();

						if (mch_account === '') { return layer.msg('请输入商户账号', {time: 1500, icon: 2}) };
						if (freq_minute === '') { return layer.msg('请设置频率时间', {time: 1500, icon: 2}) };
						if (freq_count === '') { return layer.msg('请设置限制次数', {time: 1500, icon: 2}) };

						this.$axios.post('Overall/pay_freq_add', {
							mch_account, freq_minute, freq_count
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
					area: ['500px', '210px'],
					btn: ['确认'],
					title: '新增频率限制',
					content: `
						<div class="__layer add_pay_rate">
							<div class="item mb15">
								<span class="__layer_title">商户账号：</span>
								<span class="__layer_content">${dataObj.mch_account}</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">频率限制：</span>
								<input class="__layer_input freq_minute" style="width: 50px;" value="${dataObj.freq_minute}" type="number" autocomplete="off"/>
								 分钟内，最多发起 
								<input class="__layer_input freq_count" style="width: 50px;" value="${dataObj.freq_count}" type="number" autocomplete="off"/>
								 次支付
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let freq_minute = $('.add_pay_rate .freq_minute').val(),
							freq_count = $('.add_pay_rate .freq_count').val();

						if (freq_minute === '') { return layer.msg('请设置频率时间', {time: 1500, icon: 2}) };
						if (freq_count === '') { return layer.msg('请设置限制次数', {time: 1500, icon: 2}) };

						this.$axios.post('Overall/pay_freq_edit', {
							id: dataObj.id,
							freq_minute, freq_count
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layIndex);
									[dataObj.freq_minute, dataObj.freq_count] = [freq_minute, freq_count]
								}, 1500)
							}
						})
					}
				})
			},

			del(delArr) {
				if (delArr.length <= 0) {
					return layer.msg('请选择需要删除的内容', {icon: 2, time: 1500})
				}
				layer.confirm('是否删除此支付频率管理？', {icon: 7, title: '删除'}, index => {
					this.$axios.post('Overall/pay_freq_del', {id: delArr}).then(res => {
						if (!res) {
							setTimeout(() => {
								this.request_data();
								this.is_select_all = false;
							}, 1000)
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