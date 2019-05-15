<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>团队报表</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
				<!-- 码户账号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 下级码户账号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.sub_account" placeholder="下级码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 商户订单号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_order_number" placeholder="商户订单号"></el-input>
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

				<!-- 支付状态 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="支付状态">
								<el-option label="全部状态" value=""></el-option>
								<el-option label="正常" value="0"></el-option>
								<el-option label="超时" value="1"></el-option>
								<el-option label="废弃" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<!-- 支付方式 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.pay_mode" placeholder="支付方式">
								<el-option label="全部方式" value=""></el-option>
								<el-option label="微信定额收款码" value="0"></el-option>
								<el-option label="微信不定额收款码" value="1"></el-option>
								<el-option label="支付宝定额收款码" value="2"></el-option>
								<el-option label="支付宝不定额收款码" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
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
						<th>商户订单号</th>
						<th>码户账号</th>
						<th>矿单编号</th>
						<th>支付金额</th>
						<th>返款金额</th>
						<th>下单时间</th>
						<th>上传二维码</th>
						<th>支付成功</th>
						<th>状态</th>
						<th>收款账号</th>
						<th>支付方式</th>
						<th>发送到客户端</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.mch_order_number }}</td>
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_order_no }}</td>
						<td>{{ item.pay_money }}</td>
						<td>{{ item.return_money }}</td>
						<td>{{ item.create_time }}</td>
						<td :class="$cm_d.tg['has_upload_color'][item.has_upload]">{{ $cm_d.tg['has_upload'][item.has_upload] }}</td>
						<td :class="$cm_d.tg['has_pay_color'][item.has_pay]">{{ $cm_d.tg['has_pay'][item.has_pay] }}</td>
						<td :class="$cm_d.tg['mining_status_color'][item.status]">{{ $cm_d.tg['mining_status'][item.status] }}</td>
						<td>{{ item.pay_account }}</td>
						<td>{{ $cm_d.tg['pay_mode'][item.pay_mode] }}</td>
						<td :class="$cm_d.tg['has_send_color'][item.has_send]">{{ $cm_d.tg['has_send'][item.has_send] }}</td>
					</tr>
					
					

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有挖矿记录信息</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
				<!-- <button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button> -->
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
				rebatesList: [],			// 返点列表
				dataList: { list: [] },		// 列表数据
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
					page: 1,				// 页数
					pageSize: 100,			// 页容量
					date: [this.$cm_m.getRangeTime(0).t2, this.$cm_m.getRangeTime(0).t2],				// 时间

					account: '',			// 码户账号
					sub_account: '',		// 下级码户账号
					mch_order_number: '',	// 商户订单号
					status: '',				// 状态（0正常1超时2废弃）
					pay_mode: '',			// 支付方式（0微信定额收款码、1微信不定额收款码、2支付宝定额收款码、3支付宝不定额收款码）
				}
			}
		},
		created() {
			// this.request_data();
		},
		computed: {
			
		},
		mounted() {
			this.$cm_m.auth_btn();
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$cm_m.toggle_time(this);
				this.$axios.post('Code_provider/mining_list', this.form).then((res) => {
					if (res.error) {
						return;
					}
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data();
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