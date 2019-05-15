<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">
				当前位置： 码户管理 >
				<span>团长利润</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">

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
					:picker-options="pickerOptions"
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
						<th>团长账号</th>
						<th>昵称</th>

						<th>返点</th>
						<th>利润点位</th>
						<th>成交总量</th>

						<th>利润金额</th>
						<th>日期</th>
						<th>后台操作人员</th>
						<th>操作时间</th>
						<th>状态</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr
						v-for="(item, index) in dataList.list"
						:key="item.id"
					>
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>

						<td>{{ item.sub_cp_fee }}</td>
						<td>{{ item.profit_point }}</td>
						<td>{{ item.sub_cp_total_money }}</td>

						
						<td>{{ item.profit_money }}</td>
						<td>{{ item.profit_date }}</td>
						<td>{{ item.operator }}</td>
						<td>{{ item.operate_time }}</td>
						<td>
							<span :class="$cm_d.tg['leader_profit_status_c'][item.status]">{{ $cm_d.tg['leader_profit_status'][item.status] }}</span>
						</td>
						<td class="control_C">
							<span class="editor_btn cp auth_changeStatus ml5" @click="editStatus(item)"><i class="el-icon-edit-outline"></i>修改状态</span>
						</td>
					</tr>

					
				</tbody>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有团长利润信息</p>
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
			dataList: { list: [] },

			pickerOptions: {
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
		// this.request_data();
		this.$cm_m.auth_btn();

	},
	methods: {
		request_data() {
			if (this.form.cp_account === '') return layer.msg('请输入团长账号！', {icon: 2, time: 1500});
			this.$cm_m.toggle_time(this);
			this.$axios.post("Code_Provider/top_account_profit", this.form).then(res => {
				if (!res) {
					this.dataList = res;
					this.$cm_m.auth_btn();
				}
			});
		},

		select_data() {
			this.form.page = 1;
			this.request_data();
		},

		/**
		 * 修改状态
		 */
		editStatus({status, id}) {
			layer.open({
					type: 1,
					area: ['370px', '160px'],
					btn: ['确认'],
					title: '修改状态',
					content: `
						<div class="__layer edit_status">
							<div class="item mb0">
								<span class="__layer_title">状态：</span>

								<input type="radio" id="profit_status_1" class="__layer_radio" name="profit_status" value="0" ${status === 0 ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="profit_status_1">未结算</label>

								<input type="radio" id="profit_status_2" class="__layer_radio" name="profit_status" value="1" ${status === 1 ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="profit_status_2">已结算</label>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let __status = $('.edit_status [name="profit_status"]:checked').val();
						this.$axios.post('Code_Provider/top_account_profit_status', {
							status: __status,
							id,
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