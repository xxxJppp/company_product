<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 商户管理 >
				<span>商户订单</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">

				<!-- 订单金额 -->
				<div class="username fl" style="width: 100px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.money" placeholder="订单金额"></el-input>
						</el-form-item>
					</el-form>
				</div>
				
				<!-- 商户账号 -->
				<div class="username fl" style="width: 100px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_account" placeholder="商户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 商户订单号 -->
				<div class="username fl" style="width: 240px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.order_number" placeholder="商户订单号" style="width: 230px;"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 码户账号 -->
				<div class="username fl" style="width: 100px;">
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

				<!-- 支付状态 -->
				<div class="lottery_status fl ml5">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.pay_status" placeholder="支付状态">
								<el-option label="全部状态" value=""></el-option>
								<el-option label="未支付" value="0"></el-option>
								<el-option label="已支付" value="1"></el-option>
								<el-option label="补单充值" value="5"></el-option>
								<el-option label="出错" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn fl ml5"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<div class="fl" style="margin-left: 20px; margin-top: 5px;">
					<el-checkbox @change="changeAutoUpdate($event)">自动更新</el-checkbox>
				</div>

			</div>

			<table width="100%" class="common_table gradual">
				<thead>
					<tr>
						<th>商户账号</th>
						<th>订单号</th>
						<th>支付方式</th>
						<th>订单金额</th>
						<th>支付金额</th>
						<th>订单时间</th>
						<th>交易时间</th>
						<th>二维码</th>
						<th>码户账号</th>
						<th>收款人</th>
						<th>支付状态</th>
						<th class="control_T">操作</th>
						<th>费率</th>
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="item.id">
						<td class="f_bold">{{ item.mch_account }}</td>

						<td>
							<span @click="getOrder(item.order_number)" class="_info">查看</span>
						</td>

						<td>{{ item.pay_type }}</td>
						<td class="red">{{ item.money }}</td>
						<td>
							<span v-if="+item.pay_money > 0" class="red f_bold">{{ item.pay_money }}</span>
							<span v-if="+item.pay_money <= 0" class="gray">{{ item.pay_money }}</span>
						</td>
						<td>{{ item.apply_time }}</td>
						<td>{{ item.pay_time }}</td>

						<td>
							<span class="_info cp" v-if="item.pay_url" @click="$cm_m.lookQrcode({url: item.pay_url, money: item.money, nickname: item.payee})">查看</span>
						</td>

						<td class="f_bold">{{ item.cp_account }}</td>
						<td>{{ item.payee }}</td>
						<td :class="$cm_d.tg['order_status_color'][item.pay_status]">{{ $cm_d.tg['order_status'][item.pay_status] }}</td>
						<td class="control_C">
							<span v-if="item.repetition" @click="resend(item)" class="auth_resend editor_btn cp"><i class="el-icon-refresh"></i> 重发回调</span>

							<span v-if="item.pay_status == 1" @click="transferOrder(item)" class="auth_transferOrder editor_btn cp ml5"><i class="el-icon-printer"></i> 转单</span>

							<span v-if="item.replenishment" @click="repaint(item)" class="auth_repair editor_btn cp ml5"><i class="el-icon-refresh"></i> 补单</span>
						</td>
						<td>{{ item.fee }}%</td>
					</tr>
					<tr>
						<td colspan="1">本页合计</td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.page_sum.money }}</td>
						<td class="red f_bold">{{ dataList.page_sum.pay_money }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="control_C"></td>
					</tr>
					<tr>
						<td colspan="1">总计</td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.count.money }}</td>
						<td class="red f_bold">{{ dataList.count.pay_money }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="control_C"></td>
					</tr>
				</tbody>
				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有商户订单记录</p>
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
	let repaintId = null,
		transferId = null;

	export default {
		data() {
			return {
				intervalId: null,
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
					money: '',				// 金额
					mch_account: '',		// 商户账号
					cp_account: '',			// 码户账号
					order_number: '',		// 商户订单号

					product_code: '',		// 支付方式
					pay_status: '',			// 支付状态 0已支付，1未支付，2出错
					page: 1,				// 页数
					pageSize: 100			// 页容量
				}
			}
		},
		created() {
			this.init();
			
			this.request_data();

		},
		destroyed() {
			this.$store.commit('setOrderDate', []);
			clearInterval(this.intervalId);
		},
		methods: {
			init() {
				const cp_account = this.$route.query.cp_account;
				const date = this.$store.getters.getOrderDate;

				if (cp_account) {
					this.form.cp_account = cp_account;
				}
				if (date.length > 0) {
					this.form.date = date;
				}
			},
			// 请求列表数据
			request_data(prompt = true) {
				this.form.prompt = prompt;
				this.$cm_m.toggle_time(this);
				this.$axios.post('Merchant/mch_order', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn()
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data()
			},

			/**
			 * 显示商户订单
			 */
			getOrder(order) {
				layer.open({
                    type: 1,
                    title: "详细",
                    area: ['430px', '125px'],
                    content: `
						<div class="__layer order_info">
							<div class="item mb0">
                                <span class="hidden __layer_title">商户订单号：</span>
                                <span class="ellipsis __layer_content">
                                    ${order}
                                </span>
    						</div>
    					</div>
					`
                });
			},

			/**
			 * 补单操作
			 */
			repaint(dataObj) {
				layer.open({
					type: 1,
					area: ['420px', '390px'],
					btn: ['补单', '取消'],
					title: '补单操作',
					id: 'repaint-view',
					content: `
						<div class="__layer repaint_view">
							<div class="item mb10">
								<span class="__layer_title">商户订单号：</span>
								<span class="__layer_content">${dataObj.order_number || '暂无'}</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">订单金额：</span>
								<span class="__layer_content">${dataObj.money || '暂无'}</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">收款人：</span>
								<span class="__layer_content">${dataObj.payee || '暂无'}</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">支付金额：</span>
								<input class="__layer_input pay_money" type="number" value="0" /> 元
							</div>
							<div class="item mb10">
								<span class="__layer_title">确认金额：</span>
								<input class="__layer_input verify_money" type="number" value="0" /> 元
							</div>
							<div class="item mb0">
								<span class="__layer_title">是否回调：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="callback-type" value="1" checked> 
								<label style="margin-right: 30px;" for="radio_status_1">是</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="callback-type" value="0"> 
								<label for="radio_status_2">否</label>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						if(repaintId !== null) return;

						let pay_money = +$('.repaint_view .pay_money').val(),
							verify_money = +$('.repaint_view .verify_money').val(),
							callback_type = $('.repaint_view [name="callback-type"]:checked').val();

						if (pay_money === '') return layer.msg('支付金额不能为空', {icon: 2, time: 1500});
						if (pay_money <= 0) return layer.msg('支付金额不能小于等于0', {icon: 2, time: 1500});
						if (pay_money !== verify_money) return layer.msg('两次金额输入不一致，请重新输入', {icon: 2, time: 1500});

						$('#repaint-view').siblings('.layui-layer-btn').find('.layui-layer-btn0').addClass('disabled-style');
						repaintId = 1;

						const {order_number, money, mch_id} = dataObj;

						layer.confirm('是否为选中用户进行补单？', {title: '补单', icon: 7}, layer_index => {
								this.$axios.post('Merchant/replenishment', {
								order_number, money, mch_id,
								pay_money,
								affirm_money: verify_money,
								notify: callback_type,
								prompt: true
							}).then(res => {
								if (!res) {
									setTimeout(() => {
										this.request_data();
										layer.close(layer_index);
										layer.close(layIndex);
										repaintId = null;
									}, 1500)
								} else {
									layer.close(layer_index);
									repaintId = null;
									$('#repaint-view').siblings('.layui-layer-btn').find('.layui-layer-btn0').removeClass('disabled-style');
								}
							})
						})
					}
				})
			},

			resend(dataObj) {
				layer.open({
					type: 1,
					area: ['420px', '255px'],
					btn: ['重发', '取消'],
					title: '重发回调操作',
					content: `
						<div class="__layer register_view">
							<div class="item mb10">
								<span class="__layer_title">商户订单号：</span>
								<span class="__layer_content">${dataObj.order_number || '暂无'}</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">订单金额：</span>
								<span class="__layer_content">${dataObj.money || '暂无'}</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">收款人：</span>
								<span class="__layer_content">${dataObj.payee || '暂无'}</span>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						const {order_number, money, mch_id} = dataObj;
						this.$axios.post('Merchant/retry', {
							order_number, money, mch_id,
							prompt: true
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									this.request_data();
									layer.close(layIndex);
								}, 1500)
							}
						})
					}
				})
			},

			/**
			 * 转单操作
			 * @param {Object} dataObj 对应的数据
			 */
			transferOrder(dataObj) {
				layer.open({
					type: 1,
					id: 'transfer-view',
					area: ['400px', '260px'],
					btn: ['转单', '取消'],
					title: '转单操作',
					content: `
						<div class="__layer transfer_view">
							<div class="item mb10">
								<span class="__layer_title">码户账号：</span>
								<span class="__layer_content">${dataObj.cp_account || '暂无'}</span>
							</div>
							<div class="item mb10">
								<span class="__layer_title">订单号：</span>
								<span class="__layer_content">${dataObj.order_number || '暂无'}</span>
							</div>
							<div class="item">
								<span class="__layer_title">接收码户账号：</span>
								<input class="__layer_input accept-account" type="text" autocomplete="off"/>
							</div>
						</div>
					`,
					yes: (layerIndex) => {
						if (transferId !== null) return;
						$('#transfer-view').siblings('.layui-layer-btn').find('.layui-layer-btn0').addClass('disabled-style');
						transferId = 1;

						let acceptAccount = $('.transfer_view .accept-account').val();
						if (acceptAccount === '') { return layer.msg('请输入接收订单的码户账号', {icon: 2, time: 1500}) };

						this.$axios.post('/Merchant/transferOrder', {
							cp_account: dataObj.cp_account,
							order_number: dataObj.order_number,
							receive_account: acceptAccount,
							mch_id: dataObj.mch_id,
							prompt: true
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layerIndex);
									this.request_data();
									transferId = null;
								}, 1500)
							} else {
								transferId = null;
								$('#transfer-view').siblings('.layui-layer-btn').find('.layui-layer-btn0').removeClass('disabled-style');
							}
						})
					}
				})
			},

			/**
			 * 改变自动更新
			 */
			changeAutoUpdate(status) {
				if (status) {
					this.intervalId = setInterval(() => {
						this.request_data(false);
					}, 20000);
				} else {
					clearInterval(this.intervalId);
				}
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
		},
	}
</script>