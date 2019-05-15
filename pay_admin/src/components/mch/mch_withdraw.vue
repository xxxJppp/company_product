<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 商户管理 >
				<span>提现管理</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
				<!-- 用户名 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_account" placeholder="用户名"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 时间 -->
				<div class="time_container fl clearfix ml10">
					<span class="demonstration">日期：</span>
					<el-date-picker
					value-format="yyyy-MM-dd"
					size="small"
					v-model="form.date"
					type="daterange"
					:picker-options="pickerOptions2"
					range-separator="至"
					align="right">
					</el-date-picker>
				</div>

				<!-- 提现状态 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="提现状态">
								<el-option label="全部状态" value=""></el-option>
								<el-option label="审核中" value="0"></el-option>
								<el-option label="待出款" value="1"></el-option>
								<el-option label="已出款" value="2"></el-option>
								<el-option label="已拒绝" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

			</div>

			<table width="100%" class="common_table click-table">
				<colgroup>
					<col width="25" />
				</colgroup>
				<thead class="click-thead">
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>商户账号</th>
						<th>银行名称</th>
						<th>持卡人姓名</th>
						<th>提现卡号</th>
						<th>提现金额</th>
						<th>手续费</th>
						<th>提现次数</th>
						<th>提现时间</th>
						<th>提现方式</th>
						<th>状态</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="item.id">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.mch_account }}</td>
						<td>{{ item.bank_name }}</td>
						<td>
							<span v-if="item.status === 1" class="red big-font">{{ item.card_person }}</span>
							<span v-else>{{ item.card_person }}</span>
						</td>
						<td>
							<span v-if="item.status === 1" class="red big-font">{{ formatBankCard(item.card_number) }}</span>
							<span v-else>{{ formatBankCard(item.card_number) }}</span>
						</td>
						<td>{{ item.apply_money }}</td>
						<td>{{ item.mch_withdraw_fee }}</td>
						<td class="red f_bold">{{ item.daily_no }}</td>
						<td>{{ item.apply_time }}</td>
						<td>{{ $cm_d.tg['withdraw_mode'][item.withdraw_mode] }}</td>
						<td :class="$cm_d.tg['mch_withdraw_color'][item.status]">{{ $cm_d.tg['mch_withdraw'][item.status] }}</td>
						<td class="control_C">
							<a class="auth_pass" href="javascript:void(0)" v-if="item.status != 3 && item.status != 2" style="color: #008000" @click="pass_audit([item.id], item.status)">通过 |</a>
							<a class="auth_reject" href="javascript:void(0)" v-if="item.status != 3 && item.status != 2" style="color: #b3b2b2" @click="reject_audit([item.id])">拒绝 |</a>
							<a class="auth_del" href="javascript:void(0)" @click="remove_data([item.id])" style="color: #f53232">删除</a>
						</td>
					</tr>

					<tr>
						<td colspan="2">本页合计</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.page_sum }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					
					<tr>
						<td colspan="2">总合计</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.count }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					
				</tbody>

				<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有提现记录</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default auth_pass" @click="pass_audit()">
					<span class="el-icon-check"></span> 通过</button>
				<button type="button" class="am-btn am-btn-default auth_reject" @click="reject_audit()">
					<span class="el-icon-close"></span> 拒绝</button>
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
				dataList: {},				// 列表数据
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据
				// 时间
				pickerOptions2: {
					shortcuts: [
					{
						text: '今天',
						onClick(picker) {
							let time1 = new Date()
							let Y1 = time1.getFullYear()
							let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
							let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
							let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
							const start = timer1;
							const end = timer1
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '昨天',
						onClick(picker) {
							let time2 = new Date()
							time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * 1))
							let Y2 = time2.getFullYear()
							let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
							let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
							let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
							const start = timer2;
							const end = timer2
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '前天',
						onClick(picker) {
							let time2 = new Date()
							time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * 2))
							let Y2 = time2.getFullYear()
							let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
							let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
							let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
							const start = timer2;
							const end = timer2
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				form: {
					prompt: true,			// 加载层
					date: [this.$cm_m.getRangeTime(0).t2, this.$cm_m.getRangeTime(0).t2],				// 时间
					status: '0',				// 状态
					mch_account: '',		// 用户名
					page: 1,				// 页数
					pageSize: 100			// 页容量
				}
			}
		},
		created() {
			if (this.$route.query.status) {
				this.form.status = this.$route.query.status;
			}
			this.request_data();
		},
		watch: {
			$route() {
				if (this.$route.query.status) {
					this.form.status = this.$route.query.status;
					this.request_data();
				}
			}
		},
		mounted() {
			this.bindEvent();
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$cm_m.toggle_time(this);
				this.$axios.post('Withdraw/withdraw_list', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn()
				})
			},

			/**
			 * 绑定事件
			 */
			bindEvent() {
				$('.click-table').on('click', 'tbody tr', function(){
					$(this).siblings().removeClass('active_tr active_tr_top');

					if ($(this).prev().length <= 0) {
						$('.click-thead tr').addClass('active_tr_top');
					} else {
						$('.click-thead tr').removeClass('active_tr_top');
						$(this).prev().addClass('active_tr_top');
					}

					$(this).addClass('active_tr');
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

			// 删除请求
			remove_request(obj) {
				layer.confirm('是否要删除此提现请求？', {icon: 7, title:'删除'}, (index) => {
					this.$axios.post('Withdraw/withdraw_del', obj).then((res) => {
						if (!res) {
							this.is_select_all = false;
							this.checked_data = [];
							setTimeout(() => {this.request_data()}, 1000)
						}
					})
					layer.close(index)
				})
			},
			// 删除记录
			remove_data(id) {
				if (id) 
					this.remove_request({id})
				else {
					if(this.checked_data.length <= 0) {
						layer.msg('请选择删除的数据', {
							icon: '2',
							time: 1000
						});
						return;
					}
					this.remove_request({id: this.checked_data})
				}
			},

			// 通过审核
			pass_audit(id, zt) {
				console.log(zt)
				if (!id && this.checked_data.length <= 0) {
					layer.msg('请选择通过的数据', {
						icon: '2',
						time: 1000
					});
					return;
				}
				this.$cm_m.e_layer({
					title: '通过审核',
					area: ['380px', '180px'],
					btn1: (index) => {
						this.$axios.post('Withdraw/withdraw_edit', {
							id: id || this.checked_data,
							status: $('input[name=wd_type]:checked').val()
						}).then((res) => {
							if(!res) {
								this.is_select_all = false;
								this.checked_data = [];
								setTimeout(() => {this.request_data()}, 1000)
							}
						})
						layer.close(index)
					},
					content: `
						<style>
							.e_layer_container {
								padding: 10px;
								height: 50px;
							}
						</style>
						<div class="select_type">
							<label class="auto"><span class="l_title_big">状态：</span></label>
							<input id="type_1" checked type="radio" name="wd_type" value="1"><label id="label_1" class="auto" for="type_1">待出款</label>
							<input id="type_2" type="radio" name="wd_type" value="2"><label id="label_2" class="auto" for="type_2" style="margin-left: 30px;">已出款</label>
						</div>`,
					success() {
						if (zt === 1) {
							$('#type_1, #label_1').hide();
							$('#type_2').prop('checked', true);
						}
					}
				})
			},

			// 拒绝通过审核
			reject_audit(id) {
				if (!id && this.checked_data.length <= 0) {
					layer.msg('请选择拒绝的数据', {
						icon: '2',
						time: 1000
					});
					return;
				}

				this.$cm_m.e_layer({
					title: '拒绝通过审核',
					area: ['400px', '300px'],
					btn1: (index) => {
						this.$axios.post('Withdraw/withdraw_edit_reject', {
							id: id || this.checked_data,
							remark: $('.reject_cause').val(),
							status: 3
						}).then((res) => {
							if(!res) {
								this.is_select_all = false;
								this.checked_data = [];
								setTimeout(() => {this.request_data()}, 1000)
							}
						})
						layer.close(index)
					},
					content: `
						<style>
							.e_layer_container {
								padding: 10px;
								height: 50px;
							}
						</style>
						<label>
							<span class="l_title_big">拒绝原因：</span>
							<textarea class="reject_cause" style="width: 230px; height: 134px;"></textarea>
						</label>							
						`
				})
			},


			// 复制文本
			copy_text(message) {
				$('body').append($(`<input id="copyText" type="text" value="${message}">`));
				$('#copyText')[0].select();
				document.execCommand("Copy"); // 执行浏览器复制命令
				$('#copyText').remove()
				layer.msg('复制成功', {icon: '1', time: 1500})
			},

			/**
			 * 格式化银行卡号
			 * @param {string} str 卡号
			 */
			formatBankCard(str) {
				str = '' + str;
				return str.replace(/([0-9]{4})/g, '$& ').trim();
			},

			// 分页
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