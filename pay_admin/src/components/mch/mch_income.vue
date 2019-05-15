<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 商户管理 >
				<span>商户收入</span>
			</dl>
		</div>
		<form class="am-form am-g ">
			<!-- 头部 -->
			<div class="common_title clearfix" style="height: 52px;">
				<!-- 时间 -->
				<div class="time_container fl clearfix ">
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
				<a @click="select_data" href="javascript:void(0)" class="select_btn"><i class="el-icon-search"></i> &nbsp;搜索</a>

			</div>

			<table width="100%" class="common_table">
				<!-- <colgroup>
					<col width="25" />
				</colgroup> -->
				<thead>
					<tr>
						<!-- <th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th> -->
						
						<th>商户账号</th>
						<th>支付通道</th>
						<th>支付单数</th>
						<th>支付金额</th>
						<th>提成金额</th>
						<th>收入金额</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<!-- <td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td> -->
						<td>{{ item.mch_account }}</td>
						<td>{{ item.product_code }}</td>
						<td>{{ item.pay_number }}</td>
						<td class="red f_bold">{{ item.pay_money }}</td>
						<td class="red f_bold">{{ item.divide_money }}</td>
						<td class="red f_bold">{{ item.income_money }}</td>
					</tr>
					

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有商户收入记录</p>
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

					mch_account: '',		// 商户账号
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
				this.$axios.post('Merchant/mch_income_query', this.form).then((res) => {
					console.log(res)
					this.dataList = res;
					this.$cm_m.auth_btn()
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