<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>码户账变</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
				<!-- 码户ID -->
				<div class="username fl" style="width: 100px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_id" placeholder="码户ID"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 码户账号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 时间 -->
				<div class="time_container fl clearfix ml5">
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

				<!-- 帐变类型 -->
				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.change_type" placeholder="帐变类型">
								<el-option label="全部类型" value=""></el-option>
								<el-option label="订单支付" value="1"></el-option>
								<el-option label="增加押金" value="2"></el-option>
								<el-option label="减少押金" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>
				

			</div>

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>码户ID</th>
						<th>码户账号</th>
						<th>帐变类型</th>
						<th>账变金额</th>
						<th>余额</th>
						<th>账变时间</th>
						<th>备注</th>
						<th>商户订单号</th>
						<th>支付方式</th>
						<th>详情</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="item.id">
						<td>{{ item.cp_id }}</td>
						<td>{{ item.cp_account }}</td>
						<td>{{ $cm_d.tg['code_bill_type'][item.change_type] }}</td>
						<td
						 :class="{
							'red': (+item.change_money) < 0,
							'green': (+item.change_money) > 0,
						 }">
							{{ (+item.change_money) > 0 ? `+${item.change_money}` : item.change_money }}
						</td>
						<td>{{ item.balance }}</td>
						<td>{{ item.change_time }}</td>
						<td>
							<span class="info_ auth_write" @click="$cm_m.textarea_layer('Code_Provider/change_remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callBack: request_data})">{{ item.remark == '' ? '填写' : '查看' }}</span>
						</td>
						<td>{{ item.mch_order_number }}</td>
						<td>{{ item.pay_mode }}</td>
						<td>
							<span v-if="item.change_type === 1" class="_info cp" @click="lookOrder({mch_order_number: item.mch_order_number, prompt: true}, item.operate_account)">详情</span>
							<span v-if="item.change_type === 2 || item.change_type === 3" class="_info cp" @click="lookCash(item)">详情</span>
						</td>
					</tr>

					<tr v-if="dataList.page_sum">
						<td colspan="2">本页合计</td>
						<td></td>
						<td class="red f_bold">{{ dataList.page_sum.change_money }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>

					<tr v-if="dataList.page_sum">
						<td colspan="2">总计</td>
						<td></td>
						<td class="red f_bold">{{ dataList.total_count.change_money }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>

				</tbody>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有码户账变记录</p>
						</td>
					</tr>
				</tbody>
		<!-- <span class="_info"  @click="look({url:item.pay_url, money: item.pay_money, nickname: item.cp_nickname})">{{ item.pay_url === '' ? '' : '查看' }}</span> -->

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

					cp_id: '',					// 码户id
					cp_account: '',				// 码户账号
					change_type: '',			// 帐变类型（1订单支付2增加押金3减少押金，全部为空）

					page: 1,					// 页数
					pageSize: 100				// 页容量
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
				this.$axios.post('Code_Provider/money_change', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data();
			},

			/**
			 * 查看订单操作
			 * @param {Object} requestObj 发起请求需要的数据对象
			 * @param {String} operate_account 后台操作人员
			 */
			lookOrder(requestObj, operate_account) {
				
				this.$axios.post('Code_Provider/change_order', requestObj).then(res => {

					const dataList = res;
					
					for (const key in dataList) {
						if (dataList.hasOwnProperty(key)) {
							const element = dataList[key];
							if (element === undefined || element === null) {
								dataList[key] = '暂无';
							}
						}
					}

					layer.open({
						type: 1,
						area: ['730px', '390px'],
						btn: ['确认'],
						title: '查看订单',
						content: `
							<div class="__layer two_lines">
								<div class="item mb10">
									<span class="__layer_title">码户账号：</span>
									<span class="__layer_content">${dataList.cp_account}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">商户订单号：</span>
									<span class="__layer_content">${dataList.mch_order_number}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">支付方式：</span>
									<span class="__layer_content">${dataList.pay_type}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">支付金额：</span>
									<span class="__layer_content">${dataList.pay_money} 元</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">订单时间：</span>
									<span class="__layer_content">${dataList.apply_time}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">交易时间：</span>
									<span class="__layer_content">${dataList.pay_time}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">二维码：</span>
									<span class="__layer_content ${dataList.pay_url === '' ? '' : '_info look-qrcode'}">${dataList.pay_url === '' ? '' : '查看'}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">商户账号：</span>
									<span class="__layer_content">${dataList.mch_account}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">收款人：</span>
									<span class="__layer_content">${dataList.payee}</span>
								</div>
								<div class="item mb10">
									<span class="__layer_title">状态：</span>
									<span class="__layer_content ${this.$cm_d.tg['code_bill_status_c'][dataList.status]}">${this.$cm_d.tg['code_bill_status'][dataList.status]}</span>
								</div>
								<div class="item mb0">
									<span class="__layer_title">后台操作人员：</span>
									<span class="__layer_content">${operate_account || '暂无'}</span>
								</div>
								<div class="item mb0 hidden">
									<span class="__layer_title">隐藏</span>
									<span class="__layer_content"></span>
								</div>
							</div>
						`,
						success: () => {
							$('.look-qrcode').on('click', () => {
								this.$cm_m.lookQrcode({url: dataList.pay_url, money: dataList.money, nickname: dataList.payee})
							})
						}
					})
				})
			},

			/**
			 * 查看押金
			 * @param {Object} dataObj 列表数据
			 */
			lookCash(dataObj) {
				layer.open({
					type: 1,
					area: ['380px', '580px'],
					btn: ['确认'],
					title: '查看押金',
					content: `
						<div class="__layer">
							<div class="item mb10">
								<span class="__layer_title">码户ID：</span>
								<span class="__layer_content">${ dataObj.cp_id }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">码户账号：</span>
								<span class="__layer_content">${ dataObj.cp_account }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">帐变类型：</span>
								<span class="__layer_content">${ this.$cm_d.tg['code_bill_type'][dataObj.change_type] }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">账变金额：</span>
								<span class="__layer_content">${ dataObj.change_money } 元</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">余额：</span>
								<span class="__layer_content">${ dataObj.balance }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">账变时间：</span>
								<span class="__layer_content">${ dataObj.change_time }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">支付方式：</span>
								<span class="__layer_content">${ dataObj.pay_mode }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">后台操作人员：</span>
								<span class="__layer_content">${ dataObj.operate_account }</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">收款账号：</span>
								<span class="__layer_content">${ dataObj.order_cp_account }</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">收款人：</span>
								<span class="__layer_content">${ dataObj.cp_nickname }</span>
							</div>
						</div>
					`
				})
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