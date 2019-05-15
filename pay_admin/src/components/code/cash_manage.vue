<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">
				当前位置： 码户管理 >
				<span>押金管理</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button
						@click="add"
						class="auth_add"
						type="primary"
						icon="el-icon-plus"
						size="small"
					>新增</el-button>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input
								@keyup.enter.native="request_data"
								v-model="form.cp_account"
								placeholder="码户账号"
							></el-input>
						</el-form-item>
					</el-form>
				</div>

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


				<a @click="select_data" href="javascript:void(0)" class="select_btn">
					<i class="el-icon-search"></i> &nbsp;搜索
				</a>
			</div>

			<!-- <div v-if="showStatistics" key="count" class="f_bold" style="margin-bottom: 12px; color: red;">
				用户 {{_cp_account}}：押金总额是 {{dataList.count.deposit_money}} 元、剩余 {{dataList.count.gather_money}} 元
			</div> -->

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>码户账号</th>
						<th>昵称</th>
						<th>操作时间</th>
						<th>变动金额</th>
						<th>类型</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr
						v-for="(item, index) in dataList.list"
						:key="index"
					>
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>
						<td>{{ item.change_time }}</td>
						<td>{{ item.change_money }}</td>
						<td>{{ item.change_type }}</td>
					</tr>

					
				</tbody>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有押金管理信息</p>
						</td>
					</tr>
				</tbody>

			</table>
			<div style="margin-top: 10px;">
				<div class="fr">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="form.page"
						:page-sizes="$cm_d.pageSize"
						:page-size="form.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="dataList.sum"
					></el-pagination>
				</div>
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

			hasName: false,		// 查询是否带有名字
			_cp_account: '',	// 查询使用的名字副本

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
				prompt: true,
				date: [this.$cm_m.getRangeTime(0).t2, this.$cm_m.getRangeTime(0).t2],			
				cp_account: "",
				page: 1,
				pageSize: 100
			}
		};
	},
	created() {
		this.request_data();
	},
	computed: {
		showStatistics() {
			return this.dataList.list && this.dataList.list.length > 0 && this.hasName
		}
	},
	methods: {
		request_data() {
			this.$cm_m.toggle_time(this);
			this.$axios.post("Code_provider/deposit", this.form).then(res => {
				this.dataList = res;

				if (this.form.cp_account !== "") {
					this.hasName = true;
					this._cp_account = this.form.cp_account;
				} else {
					this.hasName = false;
				}

				this.$cm_m.auth_btn();
			});
		},

		select_data() {
			this.form.page = 1;
			this.request_data();
		},

		add() {
			let accountData = null;
			layer.open({
				type: 1,
				area: ['450px', '375px'],
				btn: ['确认'],
				title: '押金操作',
				content: `
					<div class="__layer amount-view">
						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<input class="__layer_input code_account" type="text" autocomplete="off"/>
							<button class="layui-btn layui-btn-normal layui-btn-sm getInfo" style="margin-left: 15px;">
								获取
							</button>
						</div>

						<div class="item mb15">
							<span class="__layer_title">剩余金额：</span>
							<span class="__layer_content surplus_money">请先获取码户信息</span>
						</div>
						<div class="item mb15">

							<span class="__layer_title">额度操作：</span>

							<input type="radio" class="__layer_radio" id="checkbox_1" name="limit_control" value="1" checked>
							<label for="checkbox_1" style="margin-right: 20px;">增加额度</label>

							<input type="radio" id="checkbox_2" class="__layer_radio" name="limit_control" value="2">
							<label for="checkbox_2"><span id="other_radio">减少额度</span></label>
						</div>

						<div class="item mb15">
							<span class="__layer_title">金额：</span>
							<input class="__layer_input money" disabled type="number" autocomplete="off"/>
						</div>

						<div class="item mb15">
							<span class="__layer_title">实际金额：</span>
							<input class="__layer_input actual_money" disabled type="number" autocomplete="off"/>
							<span class="__layer_tips">小数点精确到两位</span>
						</div>
					</div>
				`,
				success: () => {
					$('.amount-view .code_account').on('change', () => {
						$('.amount-view .surplus_money').html('请先获取码户信息');
						$('.amount-view .money').val('').prop('disabled', true);
						$('.amount-view .actual_money').val('').prop('disabled', true);
						accountData = null;
					})

					$('.amount-view .getInfo').on('click', () => {
						let cp_account = $('.amount-view .code_account').val();
						if (cp_account === '') return layer.msg('请输入码户账号', {icon: 2, time: 1500});
						this.$axios.post('Code_provider/deposit_operation_account', {
							cp_account
						}).then(res => {
							if (!res.error) {
								accountData = res;
								$('.amount-view .surplus_money').html(res.gather_amount_limit);
								$('.amount-view .money').prop('disabled', false);
								$('.amount-view .actual_money').prop('disabled', false);
							}
						})
					})

					// rebate
					$('.amount-view .money').on('input', () => {
						if(accountData === null) return;
						let money = $('.amount-view .money').val();
						$('.amount-view .actual_money').val((+money * +accountData.rebate).toFixed(2));
					})
				},
				yes: (layIndex) => {
					if(accountData === null) return layer.msg('请先获取码户信息', {time: 1500, icon: 2});

					let type = $('.amount-view [name=limit_control]:checked').val(),
						deposit_money = $('.amount-view .actual_money').val();


					if (deposit_money === '') return layer.msg('请输入操作的金额', {time: 1500, icon: 2});
					if (deposit_money < 0)  return layer.msg('操作的金额不能小于 0', {time: 1500, icon: 2});

					this.$axios.post('Code_provider/deposit_operation', {
						deposit_money,
						type,
						cp_account: accountData.cp_account,
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

		/* edit(dataObj) {
			layer.open({
				type: 1,
				area: ["500px", "268px"],
				btn: ["确认"],
				title: "编辑押金管理",
				content: `
						<div class="__layer edit_cash">
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<span class="__layer_content">${dataObj.cp_account}</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">押金数额：</span>
								<span class="__layer_content">${dataObj.deposit_money}</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">状态：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="cash_status" value="0" ${
									dataObj.deposit_status == "0"
										? "checked"
										: ""
								}> 
								<label style="margin-right: 20px;" for="radio_status_1">正常</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="cash_status" value="1" ${
									dataObj.deposit_status == "1"
										? "checked"
										: ""
								}> 
								<label for="radio_status_2">已退还</label>
							</div>
						</div>
					`,
				yes: layIndex => {
					let status = $(
						'.edit_cash [name="cash_status"]:checked'
					).val();

					this.$axios
						.post("Code_provider/deposit_edit", {
							id: dataObj.id,
							deposit_status: status
						})
						.then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500);
							}
						});
				}
			});
		}, */

		returnMoney(id) {
			layer.confirm('是否退还该账户押金？', {icon: 7, title: '退还押金'}, index => {
				this.$axios.post('Code_provider/return_money', {id, prompt: true}).then(res => {
					if (!res) {
						setTimeout(() => {
							this.request_data();
						}, 1500)
					}
				})
			})
		},
		
		del(arr) {
			if (arr.length <= 0) {
				return layer.msg('请选择需要删除的押金管理记录', {icon: 2, time: 1500})
			}
			layer.confirm('是否删除此押金管理记录？', {icon: 7, title: '删除'}, index => {
				this.$axios.post('Code_provider/deposit_del', {id: arr}).then(res => {
					if (!res) {
						setTimeout(() => {
							this.request_data();
						}, 1000)
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
};
</script>