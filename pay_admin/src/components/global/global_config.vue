<template>
	<div class="global-view">
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">
				当前位置： 全局管理 >
				<span>全局配置</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="global_config">
				<el-form ref="form" :model="form" label-width="220px">
					<ul class="clearfix">
						<!-- <li>
							<el-form-item label="码户排队优先选取人数百分比：">
								<div class="layui-input-inline" style="width:100px;">
									<input
										type="number"
										class="input_style layui-input"
										v-model="form.cp_queue_priority_percent"
									>
								</div> %
							</el-form-item>
						</li> -->
						<li>
							<el-form-item label="支付时间：">
								<div class="layui-input-inline" style="width:100px;">
									<input
										type="number"
										class="input_style layui-input"
										v-model="form.order_payment_time"
									>
								</div> 分钟
							</el-form-item>
						</li>
						<li>
							<el-form-item label="最低押金：">
								<div class="layui-input-inline" style="width:100px;">
									<input
										type="number"
										class="input_style layui-input"
										v-model.number="form.minimum_deposit_amount"
									>
								</div> 元
								<span style="color: #9a9a9a;">（下级押金低于最低押金在顶部进行提示）</span>
							</el-form-item>
						</li>
						<li>
							<el-form-item label="二维码上传金额：">
								<div class="layui-input-inline" style="width:500px;">
									<textarea
										class="input_style layui-textarea"
										v-model="form.app_qrcode_up_money_limit"
									>
									</textarea>
								</div>
								<span class="tips">金额与金额之间使用英文","分隔</span>
							</el-form-item>
						</li>
						<li>
							<el-form-item label="最低充值金额：">
								<div class="layui-input-inline" style="width:100px;">
									<input
										type="number"
										class="input_style layui-input"
										v-model.number="form.min_pay_money"
									>
								</div> 元
							</el-form-item>
						</li>
						<li>
							<el-form-item label="最高充值金额：">
								<div class="layui-input-inline" style="width:100px;">
									<input
										type="number"
										class="input_style layui-input"
										v-model.number="form.max_pay_money"
									>
								</div> 元
							</el-form-item>
						</li>
						<li style="padding-left: 220px; margin-top: 20px;">
							<el-button size="small" type="primary" @click="localSubmit(['order_payment_time', 'app_qrcode_up_money_limit', 'minimum_deposit_amount', 'min_pay_money', 'max_pay_money'])">确认</el-button>
							<el-button size="small" @click="reload()">重置</el-button>
						</li>
					</ul>
				</el-form>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			baseData: {},	// 基础数据
			verify: {		// 验证数据
				cp_queue_priority_percent: {
					min: 1,
					max: 100,
					hint: `优先选取人数百分比设置范围为：{{min}}% - {{max}}%`,
					empty: `优先选取人数百分比设置不能为空`,
				},
				order_payment_time: {
					min: 0,
					hint: `支付时间不能低于{{min}}分钟`,
					empty: `支付时间不能为空`,
				},
				app_qrcode_up_money_limit: {
					reg: /^[0-9,]*$/,
					hint: `金额与金额之间使用英文","分隔`,
					empty: `二维码上传金额不能为空`,
				},
				minimum_deposit_amount: {
					min: 0,
					hint: `最低押金不能低于{{min}}元`,
					empty: `最低押金不能为空`,
				},
				min_pay_money: {
					min: 0,
					hint: `最低充值金额不能低于{{min}}元`,
					empty: `最低充值金额不能为空`,
				},
				max_pay_money: {
					min: 0,
					hint: `最高充值金额不能低于{{min}}元`,
					empty: `最高充值金额不能为空`,
				}
			},
			form: {
				prompt: true,
				// cp_queue_priority_percent: "", 	// 码户排队时优先选取的人数百分比
				order_payment_time: "",			// 支付时间配置
				app_qrcode_up_money_limit: '',  // app二维码上传金额限制(逗号分隔)
				minimum_deposit_amount: '',     // 最低押金
				min_pay_money: 0,
				max_pay_money: 0,
			}
		};
	},
	created() {
		this.request_data();
	},
	methods: {
		// 请求列表数据
		request_data() {
			this.$axios.post('Risk/config', this.form).then(res => {
				[res.min_pay_money, res.max_pay_money] = res.pay_money_limit.split(',');
				this.baseData = JSON.parse(JSON.stringify(res));
				this.form = res;
				this.$cm_m.auth_btn();
			});
		},

		/**
		 * 实现局部提交
		 */
		localSubmit(arr) {
			for(let i = 0 ; i < arr.length; i++) {
				const item = arr[i];

				const verifyObj = this.verify[item];
				const now = this.form[item];

				if (now == '') {
						return layer.msg(verifyObj.empty, { icon: 2, time: 2000 });
				}
				
				if (verifyObj.reg) {
					if (!verifyObj.reg.test(now)) {
						return layer.msg(verifyObj.hint, { icon: 2, time: 2000 });
					}
				} else {
					const hint = verifyObj.hint
							.replace(/{{min}}/g, verifyObj.min)
							.replace(/{{max}}/g, verifyObj.max);

					if(now < verifyObj.min || now > verifyObj.max) {
						return layer.msg(hint, { icon: 2, time: 2000 });
					}
				}
				
			}
			this.submit(arr)
		},
		
		/**
		 * 提交
		 */
		submit(arr) {
			if(+this.form.min_pay_money >= +this.form.max_pay_money) return layer.msg('最低充值金额不能大于或等于最大充值金额', {icon: 2, time: 1500});

			const submitObj = {
				prompt: true
			};
			for (const item of arr) {
				submitObj[item] = this.form[item]
			}

			submitObj.pay_money_limit = `${submitObj.min_pay_money},${submitObj.max_pay_money}`
			delete submitObj.min_pay_money;
			delete submitObj.max_pay_money;

			this.$axios.post('Risk/config_edit', submitObj).then(res => {
				if (!res) {
					this.request_data();
				}
			})
		},

		/**
		 * 重置
		 */
		reload() {
			this.form = JSON.parse(JSON.stringify(this.baseData));
		},
	}
};
</script>