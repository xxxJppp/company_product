<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>团队报表</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.sub_account" placeholder="下级码户账号"></el-input>
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

				<a @click="select_data" href="javascript:void(0)" class="select_btn fl ml15"><i class="el-icon-search"></i> &nbsp;搜索</a>


				<div class="ml30 fl" style="margin-top: 5px;">
					<el-checkbox v-model="form.is_all" @change="select_data()">是否统计禁登用户</el-checkbox>
				</div>

			</div>

			<table width="100%" class="common_table">
				
				<thead>
					<tr>
						<th>码户账号</th>
						<th>昵称</th>
						<th>总单数量</th>
						<th>未结金额</th>
						<th>已结金额</th>
						<th>佣金金额</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>
						<td>{{ item.count }}</td>
						<td>{{ item.pay_unfinished }}</td>
						<td>{{ item.pay_succeed }}</td>
						<td>{{ item.total_money }}</td>
					</tr>

					<tr v-if="dataList.page_sum">
						<td>本页合计</td>
						<td></td>
						<td>{{ dataList.page_sum.count }}</td>
						<td class="red f_bold">{{ dataList.page_sum.pay_unfinished }}</td>
						<td class="red f_bold">{{ dataList.page_sum.pay_succeed }}</td>
						<td class="red f_bold">{{ dataList.page_sum.total_money }}</td>
					</tr>

					<tr v-if="dataList.total_count">
						<td>总合计</td>
						<td></td>
						<td>{{ dataList.total_count.count }}</td>
						<td class="red f_bold">{{ dataList.total_count.pay_unfinished }}</td>
						<td class="red f_bold">{{ dataList.total_count.pay_succeed }}</td>
						<td class="red f_bold">{{ dataList.total_count.total_money }}</td>
					</tr>
				</tbody>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有团队报表信息</p>
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
					page: 1,			
					pageSize: 100,
					date: [this.$cm_m.getRangeTime(0).t2, this.$cm_m.getRangeTime(0).t2],			

					is_all: false,
					account: '',		
					sub_account: '',	
				}
			}
		},
		created() {
		},
		computed: {
			
		},
		mounted() {
			this.$cm_m.auth_btn();
		},
		methods: {
			request_data() {
				this.$cm_m.toggle_time(this);
				this.$axios.post('Code_provider/team_list', this.form).then((res) => {
					if (res.error) {
						return;
					}
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			select_data() {
				this.form.page = 1;
				this.request_data();
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