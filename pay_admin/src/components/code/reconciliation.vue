<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>码户对账</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
			
				<div class="username fl" style="width: 120px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_account" placeholder="码户账号"></el-input>
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

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="fl select_btn ml15"><i class="el-icon-search"></i> &nbsp;搜索</a>
				
				<div class="ml30 fl" style="margin-top: 5px;">
					<el-checkbox v-model="form.is_all" @change="select_data()">是否统计禁登用户</el-checkbox>
				</div>
			</div>

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>码户账号</th>
						<th>昵称</th>
						<th>剩余收款额度</th>
						<th>收款金额</th>
						<th>应返款金额</th>
						<th>盈利金额</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>
							<span class="_info" @click="selectOrder(item.cp_account)">{{ item.cp_account }}</span>
						</td>
						<td>{{ item.nickname }}</td>
						<td class="red">{{ item.residue_money }}</td>
						<td class="red">{{ item.receipt_money }}</td>
						<td class="red">{{ item.return_money }}</td>
						<td class="red f_bold">{{ item.profit_money }}</td>
					</tr>

					<tr v-if="dataList.list" v-show="dataList.list.length > 0">
						<td colspan="1">本页合计</td>
						<td></td>
						<td class="red f_bold">{{ dataList.page_sum.residue_money }}</td>
						<td class="red f_bold">{{ dataList.page_sum.receipt_money }}</td>
						<td class="red f_bold">{{ dataList.page_sum.return_money }}</td>
						<td class="red f_bold">{{ dataList.page_sum.profit_money }}</td>
					</tr>
					<tr v-if="dataList.list" v-show="dataList.list.length > 0">
						<td colspan="1">总计</td>
						<td></td>
						<td class="red f_bold">{{ dataList.count.residue_money }}</td>
						<td class="red f_bold">{{ dataList.count.receipt_money }}</td>
						<td class="red f_bold">{{ dataList.count.return_money }}</td>
						<td class="red f_bold">{{ dataList.count.profit_money }}</td>
					</tr>


					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有码户对账记录</p>
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
				dataList: {},				// 列表数据

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
					cp_account: '',			// 码户账号
					is_all: false,
					page: 1,				// 页数
					pageSize: 100			// 页容量
				}
			}
		},
		created() {
			this.request_data();
		},
		computed: {
			
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$cm_m.toggle_time(this);
				this.$axios.post('Code_provider/cp_check_bill', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn()
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data()
			},

			// 查询对应用户订单
			selectOrder(codeAccount) {
				this.$store.commit('setOrderDate', this.form.date);
				this.$router.push({path: '/admin/mch/mch_order', query: {'cp_account': codeAccount}});
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