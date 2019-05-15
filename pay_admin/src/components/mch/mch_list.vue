<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 商户管理 >
				<span>商户列表</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">
				<!-- 新增商户 -->
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button @click="add_mch" class="auth_add" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>

				<!-- 商户ID -->
				<div class="username fl" style="width: 100px;">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_id" placeholder="商户ID"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<!-- 商户账号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_account" placeholder="商户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<div class="fl" style="margin-left: 30px; margin-top: 5px;">
					<el-checkbox v-model="disabled_member" @change="change_disabled">禁止登录用户</el-checkbox>
				</div>

				<el-button class="fl ml20" v-show="checked_data.length > 0" type="primary" size="small" @click="all_pay_aisle(checked_data)">通道管理</el-button>

			</div>

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>商户ID</th>
						<th>类型</th>
						<th>手续费</th>
						<th>提现次数</th>
						<th>结算方式</th>
						
						<th>商户昵称</th>
						<th>商户账号</th>
						<th>更多</th>
						<th>创建时间</th>
						<th>账户余额</th>
						<th>下发</th>
						<th>状态</th>
						<th class="control_T">操作</th>
						<th>收款额度</th>
						<!-- <th>补单充值</th> -->
					</tr>
				</thead>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="item.id">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>{{ item.mch_id }}</td>
						<td>{{ $cm_d.tg['mch_type'][item.mch_type] }}</td>
						<td>{{ item.withdraw_fee }} 元</td>
						<td>
							<span v-if="item.withdraw_daily_count_limit !== 0">每日 {{item.withdraw_daily_count_limit}} 次</span>
							<span v-else>无限制</span>
						</td>
						<td>{{ item.balance_mode_desc }}</td>
						<td>{{ item.mch_nickname }}</td>
						<td>{{ item.mch_account }}</td>
						<td>
							<span @click="info(item)" class="_info auth_moreMsg">更多</span>
						</td>
						<td>{{ item.create_time }}</td>
						<td>
							<span v-if="+item.money > 0" class="red f_bold">{{ item.money }}</span>
							<span v-if="+item.money <= 0" class="gray">{{ item.money }}</span>
						</td>
						<td>
							<span class="auth_write" @click="$cm_m.textarea_layer('Merchant/mch_remark_edit', {remark: item.remark, mustArgs: {mch_id: item.mch_id}, callBack: request_data})">
								<i class="info_" v-if="item.remark === ''">填写</i>
								<i :class="$cm_m.getStringLength(item.remark) > 4 ? 'info_' : 'red f_bold cp'" v-else>{{ $cm_m.getStringLength(item.remark) > 4 ? '查看' : item.remark}}</i>
							</span>
						</td>
						<td :class="$cm_d.tg['mch_status_color'][item.status]">{{ $cm_d.tg['mch_status'][item.status] }}</td>
						<td class="control_C">
							<span class="editor_btn cp ml5 auth_eduit" @click="edit(item)"><i class="el-icon-edit-outline"></i>改</span>
							<span class="common_btn cp auth_close_account ml5" @click="close_account(item.mch_account)">结</span>
							<span class="ml5 common_btn cp auth_payaisle" @click="pay_aisle(item.mch_id)">通道</span>
							<span v-if="item.withdraw_mode !== 0" class="ml5 common_btn cp auth_autoSend" @click="autoSend(item)">自动下发</span>
						</td>
						<td>
							<span v-if="item.mch_type == 1" class="_info auth_payment"  @click="payment(item.mch_id, item.recharge_limit)">收款额度</span>
						</td>
						<!-- <td>
							<span class="_info auth_payment"  @click="repairOrder(item)">补单充值</span>
						</td> -->
					</tr>

					<tr v-if="dataList.page_sum">
						<td colspan="2">本页合计</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.page_sum.money }}</td>
						<td></td>
						<td></td>
						<td class="control_C"></td>
						<td></td>
						<td></td>
					</tr>

					<tr v-if="dataList.total_count">
						<td colspan="2">总计</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td class="red f_bold">{{ dataList.total_count.money }}</td>
						<td></td>
						<td></td>
						<td class="control_C"></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>

				<tbody class="common_tbody" v-if="dataList.list" v-show="dataList.list.length <= 0">
					<tr class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>{{ `暂时没有${disabled_member ? '禁止登录用户' : '商户'}列表信息` }}</p>
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
				disabled_member: false,		// 是否查询禁止登陆用户

				closeList: [],				// 结算方式列表
				form: {
					prompt: true,			// 加载层
					mch_id: '',					// 商户ID
					mch_account: '',			// 用户名
					status: 0,					// 状态
					page: 1,					// 页数
					pageSize: 100				// 页容量
				}
			}
		},
		created() {
			this.request_data();
			this.getCloseList();
		},
		computed: {
			
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$axios.post('Merchant/merchant_list', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
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
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data();
			},

			// 改变禁止用户
			change_disabled(status) {
				if (this.disabled_member) {
					this.form.status = 1;
					this.request_data();
				} else {
					this.form.status = 0;
					this.request_data();
				}
			},

			// 获取结算方式列表
			getCloseList() {
				this.$axios.post('Merchant/balance_mode').then(res => {
					this.closeList = res.list;
				})
			},

			/**
			 * 新增商户
			 */
			add_mch() {
				layer.open({
					type: 1,
					area: ['505px', '690px'],
					btn: ['确认'],
					title: '新增商户',
					content: `
						<div class="__layer register_view">
							<div class="item mb8">
								<span class="__layer_title">商户ID：</span>
								<input class="__layer_input mch_id" style="width: 100px" type="number" autocomplete="off"/>
								<span class="__layer_tips">请设置商户ID</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户密钥：</span>
								<input class="__layer_input passkey" style="width: 200px;" type="text" autocomplete="off"/>
								<span class="__layer_handle random_pass cp">随机生成</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户类型：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="mch_type" value="0" checked> 
								<label style="margin-right: 30px;" for="radio_status_1">普通</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="mch_type" value="1"> 
								<label for="radio_status_2">代收款</label>
							</div>
							<div class="item mb8">
								<span class="__layer_title">下发模式：</span>
								<input type="radio" id="withdraw_mode_1" class="__layer_radio" name="withdraw_mode" value="0" checked> 
								<label style="margin-right: 20px;" for="withdraw_mode_1">手动下发</label>

								<input type="radio" id="withdraw_mode_2" class="__layer_radio" name="withdraw_mode" value="1"> 
								<label style="margin-right: 20px;" for="withdraw_mode_2">自动下发</label>

								<input type="radio" id="withdraw_mode_3" class="__layer_radio" name="withdraw_mode" value="2"> 
								<label for="withdraw_mode_3">手动+自动下发</label>
							</div>
							<div class="item mb8">
								<span class="__layer_title">提现手续费：</span>
								<input class="__layer_input fee" style="width: 100px" value="0" type="number" autocomplete="off"/>
								<span class="__layer_tips">元</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">每日提现次数：</span>
								<input class="__layer_input withdraw_num" style="width: 100px" value="0" type="number" autocomplete="off"/>
								<span class="__layer_tips">(提示：为 0 则不限制每日提现次数)</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">结算方式：</span>
								<select class="__layer_input close_way"></select>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户账号：</span>
								<input class="__layer_input account" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置商户账号</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户昵称：</span>
								<input class="__layer_input nickname" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置昵称或别名</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">登录密码：</span>
								<input class="__layer_input password" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置登录密码</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">确认密码：</span>
								<input class="__layer_input again_password" onpaste="return false" type="text" autocomplete="off"/>
								<span class="__layer_tips">请重新输入密码</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">QQ：</span>
								<input class="__layer_input qq" type="number" autocomplete="off"/>
								<span class="__layer_tips">请设置QQ号码(<i class="red">可为空</i>)</span>
							</div>
							<div class="item">
								<span class="__layer_title">手机号码：</span>
								<input class="__layer_input tel" type="number" autocomplete="off"/>
								<span class="__layer_tips">请设置手机号码(<i class="red">可为空</i>)</span>
							</div>
						</div>
					`,
					success: () => {
						$('.register_view .random_pass').on('click', () => {
							$('.register_view .passkey').val(this.$cm_m.getRandomPass(20));
						})

						const closeHtmlArr = this.closeList.map(item => `<option value="${item.balance_mode}">${item.desc}</option>`);
						$('.register_view .close_way').html(closeHtmlArr.join(''));
					},
					yes: (layIndex) => {
						let passReg = /^[a-zA-Z0-9]{6,15}$/;
						
						let id = $('.register_view .mch_id').val(),
							passkey = $('.register_view .passkey').val(),
							mch_type = $('.register_view [name="mch_type"]:checked').val(),
							withdraw_mode = $('.register_view [name="withdraw_mode"]:checked').val(),
							fee = $('.register_view .fee').val(),
							withdraw_num = $('.register_view .withdraw_num').val(),
							close_way = $('.register_view .close_way').val(),
							account = $('.register_view .account').val(),
							nickname = $('.register_view .nickname').val(),
							password = $('.register_view .password').val(),
							again_password = $('.register_view .again_password').val(),
							qq = $('.register_view .qq').val(),
							tel = $('.register_view .tel').val();

						if (id === '') { return layer.msg('请设置商户id', {time: 1500, icon: 2}) };
						if (passkey === '') { return layer.msg('请设置商户密钥', {time: 1500, icon: 2}) };
						if (fee === '') { return layer.msg('请设置提现手续费', {time: 1500, icon: 2}) };
						if (withdraw_num === '') { return layer.msg('请输入每日提现次数', {time: 1500, icon: 2}) };
						if (withdraw_num < 0) { return layer.msg('每日提现次数不能小于0', {time: 1500, icon: 2}) };
						
						if (account === '') { return layer.msg('请设置商户账号', {time: 1500, icon: 2}) };
						if (nickname === '') { return layer.msg('请设置商户昵称或别名', {time: 1500, icon: 2}) };
						if (password === '') { return layer.msg('请设置密码', {time: 1500, icon: 2}) };
						if (again_password === '') { return layer.msg('请重新输入密码', {time: 1500, icon: 2}) };
						if (!passReg.test(password)) { return layer.msg('密码由6-15位数字或字母组成', {time: 1500, icon: 2}); }

						if (fee < 0) { return layer.msg('提现手续费不能小于0', {time: 1500, icon: 2}); }

						if (password !== again_password) { return layer.msg('两次输入的密码不一致，请重新输入', {time: 1500, icon: 2}) };

						this.$axios.post('Merchant/merchant_add', {
							mch_id: id,
							mch_key: passkey,
							mch_type,
							withdraw_mode,
							withdraw_fee: fee,
							withdraw_limit: withdraw_num,
							balance_mode: close_way,
							mch_account: account,
							mch_nickname: nickname,
							mch_password: password,
							mch_qq: qq,
							mch_phone: tel,
							prompt: true,
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

			/**
			 * 编辑商户
			 */
			edit(dataObj) {
				layer.open({
					type: 1,
					area: ['500px', '600px'],
					btn: ['确认'],
					title: '编辑商户',
					content: `
						<div class="__layer edit_view">
							<div class="item mb8">
								<span class="__layer_title">商户密钥：</span>
								<input class="__layer_input passkey" style="width: 200px;" value="${dataObj.mch_key}" type="text" autocomplete="off"/>
								<span class="__layer_handle random_pass cp">随机生成</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户类型：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="mch_type" value="0" ${dataObj.mch_type == '0' ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="radio_status_1">普通</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="mch_type" value="1" ${dataObj.mch_type == '1' ? 'checked' : ''}> 
								<label for="radio_status_2">代收款</label>
							</div>
							<div class="item mb8">
								<span class="__layer_title">下发模式：</span>
								<input type="radio" id="withdraw_mode_1" class="__layer_radio" name="withdraw_mode" value="0" ${dataObj.withdraw_mode == '0' ? 'checked' : ''}> 
								<label style="margin-right: 20px;" for="withdraw_mode_1">手动下发</label>

								<input type="radio" id="withdraw_mode_2" class="__layer_radio" name="withdraw_mode" value="1" ${dataObj.withdraw_mode == '1' ? 'checked' : ''}> 
								<label style="margin-right: 20px;" for="withdraw_mode_2">自动下发</label>

								<input type="radio" id="withdraw_mode_3" class="__layer_radio" name="withdraw_mode" value="2" ${dataObj.withdraw_mode == '2' ? 'checked' : ''}> 
								<label for="withdraw_mode_3">手动+自动下发</label>
							</div>
							<div class="item mb8">
								<span class="__layer_title">提现手续费：</span>
								<input class="__layer_input fee" value="${dataObj.withdraw_fee}" style="width: 100px" value="0" type="number" autocomplete="off"/>
								<span class="__layer_tips">元</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">每日提现次数：</span>
								<input class="__layer_input withdraw_num" style="width: 100px" value="${dataObj.withdraw_daily_count_limit}" type="number" autocomplete="off"/>
								<span class="__layer_tips">(提示：为 0 则不限制每日提现次数)</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">结算方式：</span>
								<select class="__layer_input close_way"></select>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户昵称：</span>
								<input class="__layer_input nickname" value="${dataObj.mch_nickname}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入昵称或别名</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">商户账号：</span>
								<input class="__layer_input account" value="${dataObj.mch_account}" type="text" autocomplete="off"/>
								<span class="__layer_tips">输入商户账号</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">登录密码：</span>
								<input class="__layer_input password" value="" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入登录密码</span>
							</div>
							<div class="item mb8">
								<span class="__layer_title">提现密码：</span>
								<input class="__layer_input withdraw_password" value="" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入提现密码</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">状态：</span>
								<input type="radio" id="radio_status_3" class="__layer_radio" name="mch_status" value="0" ${dataObj.status == '0' ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="radio_status_3">正常</label>

								<input type="radio" id="radio_status_4" class="__layer_radio" name="mch_status" value="1" ${dataObj.status == '1' ? 'checked' : ''}> 
								<label for="radio_status_4">禁用</label>
							</div>
						</div>
					`,
					success: () => {
						$('.edit_view .random_pass').on('click', () => {
							$('.edit_view .passkey').val(this.$cm_m.getRandomPass(20));
						})

						const closeHtmlArr = this.closeList.map(item => `<option value="${item.balance_mode}" ${dataObj.balance_mode == item.balance_mode ? 'selected' : ''}>${item.desc}</option>`);
						$('.edit_view .close_way').html(closeHtmlArr.join(''));
					},
					yes: (lay_index) => {
						const passReg = /^[a-zA-Z0-9]{6,15}$/;
							
						
						let passkey = $('.edit_view .passkey').val(),
							mch_type = $('.edit_view [name="mch_type"]:checked').val(),
							withdraw_mode = $('.edit_view [name="withdraw_mode"]:checked').val(),
							fee = $('.edit_view .fee').val(),
							withdraw_num = $('.edit_view .withdraw_num').val(),
							close_way = $('.edit_view .close_way').val(),
							account = $('.edit_view .account').val(),
							nickname = $('.edit_view .nickname').val(),
							password = $('.edit_view .password').val(),
							withdraw_password = $('.edit_view .withdraw_password').val()
							status = $('.edit_view [name="mch_status"]:checked').val();


						if (fee === '') { return layer.msg('请输入提现手续费', {time: 1500, icon: 2}) };
						if (fee < 0) { return layer.msg('提现手续费不能小于0', {time: 1500, icon: 2}); }
						if (withdraw_num === '') { return layer.msg('请输入每日提现次数', {time: 1500, icon: 2}) };
						if (withdraw_num < 0) { return layer.msg('每日提现次数不能小于0', {time: 1500, icon: 2}) };
						if (account === '') { return layer.msg('商户账号不能为空', {time: 1500, icon: 2}) };
						if (nickname === '') { return layer.msg('昵称或别名不能为空', {time: 1500, icon: 2}) };


						this.$axios.post('Merchant/merchant_edit', {
							mch_key: passkey,
							mch_type,
							withdraw_mode,
							withdraw_fee: fee,
							withdraw_limit: withdraw_num,
							balance_mode: close_way,
							mch_account: account,
							mch_nickname: nickname,
							mch_password: password,
							mch_withdraw_pass: withdraw_password,
							prompt: true,
							status,
							id: dataObj.id
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(lay_index);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			/**
			 * 收款额度
			 * @param {Number} mch_id 修改额度的数据id
			 * @param {String} recharge_limit 收款额度
			 */
			payment(mch_id, recharge_limit) {
				const REG = /^[0-9,/.]*$/;

				layer.open({
					type: 1,
					btn: ['确认'],
					title: '收款额度',
					area: ['450px', '280px'],
					content: `
						<div class="textarea-layer">
							<span>提示：多个收款额度之间使用英文","隔开</span>
							<span class="ml10 red f_bold warn" style="display: none;">请按照格式输入！</span>
							<textarea class="t_content">${recharge_limit}</textarea>
						</div>
					`,
					success: () => {
						$('.textarea-layer .t_content').on('input', function() {
							let val = $(this).val();
							if(!REG.test(val)) {
								$('.textarea-layer .warn').show();
							} else {
								$('.textarea-layer .warn').hide();
							}
						})
					},
					btn1: (layer_index) => {
						let limit = $('.textarea-layer .t_content').val();
						if(!REG.test(limit)) {
							return layer.msg('请按照格式输入收款额度！', {icon: 2, time: 1500});
						}
						
						this.$axios.post('Merchant/recharge_limit', {
							mch_id,
							recharge_limit: limit,
							prompt: true,
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(layer_index);
									return this.request_data();
								}, 1500)
							}
						})
					}
				});
			},

			/**
			 * 结算账号
			 */
			close_account(mch_account) {
				window.__mch_account = mch_account;
				layer.open({
					type: 2,
					title: '结算账号列表',
					shade: [0],
					id: 'close_account',
					area: ['730px', '500px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/close_account_list`], //iframe的url，no代表不显示滚动条
				})
			},

			/**
			 * 支付通道管理
			 */
			pay_aisle(mch_id) {
				window.__mch_id = mch_id;
				layer.open({
					type: 2,
					title: '支付通道管理',
					shade: [0],
					id: 'pay_aisle',
					area: ['730px', '500px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/pay_aisle`], //iframe的url，no代表不显示滚动条
				})
			},

			/**
			 * 全部支付通道管理
			 */
			all_pay_aisle(idArr) {
				const selectArr = this.dataList.list.filter(item => (idArr.includes(item.id)));
				const mchIdArr = selectArr.map(item => item.mch_id);

				if (idArr.length <= 0) return layer.msg('请选择需要操作的用户', {icon: 2, time: 1500});

				window.__all_mch_id = mchIdArr;
				
				layer.open({
					type: 2,
					title: '支付通道管理',
					shade: [0],
					id: 'pay_aisle',
					area: ['650px', '350px'],
					time: false, //2秒后自动关闭
					anim: 2,
					content: [`${window.location.pathname}#/all_pay_aisle`], //iframe的url，no代表不显示滚动条
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

			info(dataObj) {
				layer.open({
                    type: 1,
                    title: "更多信息",
                    area: ['430px', '280px'],
                    content: `
						<div class="__layer order_info">
							<div class="item mb15">
                                <span class="hidden __layer_title">商户秘钥：</span>
                                <span class="ellipsis __layer_content">
                                    ${dataObj.mch_key}
                                </span>
    						</div>
							<div class="item mb15">
                                <span class="hidden __layer_title">QQ号：</span>
                                <span class="ellipsis __layer_content">
                                    ${dataObj.mch_qq || '暂无'}
                                </span>
    						</div>
    						<div class="item mb15">
                                <span class="hidden __layer_title">手机号：</span>
                                <span class="ellipsis __layer_content">
                                    ${dataObj.mch_phone || '暂无'}
                                </span>
							</div>
							<div class="item mb0">
                                <span class="hidden __layer_title">最后登录时间：</span>
                                <span class="ellipsis __layer_content">
                                    ${dataObj.last_login_time || '暂无'}
                                </span>
							</div>
    					</div>
                    `
				});
			},

			/**
			 * 补单充值
			 */
			repairOrder(dataObj) {
				layer.open({
					type: 1,
					area: ['500px', '360px'],
					btn: ['确认', '取消'],
					title: '补单充值',
					content: `
						<div class="__layer repair-order">

							<div class="item mb15">
								<span class="__layer_title">商户账号：</span>
								<span class="__layer_content">${dataObj.mch_account}</span>
							</div>

							<div class="item mb15">
								<span class="__layer_title">商户昵称：</span>
								<span class="__layer_content">${dataObj.mch_nickname}</span>
							</div>
							
							<div class="item mb15">
								<span class="__layer_title">订单号：</span>
								<input class="__layer_input order-num" value="" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入订单号</span>
							</div>

							<div class="item mb15">
								<span class="__layer_title">金额：</span>
								<input class="__layer_input money" value="" type="number" autocomplete="off"/>
								<span class="__layer_tips">请输入充值金额</span>
							</div>

							<div class="item mb0">
								<span class="__layer_title">确认金额：</span>
								<input class="__layer_input reload-money" value="" type="number" autocomplete="off"/>
								<span class="__layer_tips">请重新输入充值金额</span>
							</div>
						</div>
					`,
					yes: (lay_index) => {
						
						let orderNum = $('.repair-order .order-num').val(),
							money = $('.repair-order .money').val(),
							reloadMoney = $('.repair-order .reload-money').val();


						if (orderNum === '') { return layer.msg('请输入订单号', {time: 1500, icon: 2}) };
						if (money === '') { return layer.msg('请输入充值金额', {time: 1500, icon: 2}); }
						if (+money <= 0) { return layer.msg('充值金额不能小于等于0', {time: 1500, icon: 2}); }
						if (+reloadMoney !== +money) { return layer.msg('两次充值金额输入不一致！', {time: 1500, icon: 2}) };

						this.$axios.post('Merchant/replenish_order', {
							mch_id: dataObj.mch_id,
							money,
							order_number: orderNum,
						}).then(res => {
							if (!res) {
								setTimeout(() => {
									layer.close(lay_index);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			/**
			 * 自动下发操作
			 */
			autoSend(dataObj) {
				this.$axios.post('Merchant/withdraw_account', {
					mch_id: dataObj.mch_id
				}).then(({list: bankCardList}) => {
					if (bankCardList.length <= 0) return layer.msg('该商户暂未绑定银行卡', { icon: 2, time: 1500 });

					layer.open({
						type: 1,
						area: ['420px', '470px'],
						btn: ['确认', '取消'],
						id: 'auto-send',
						title: '自动下发',
						content: `
							<div class="__layer send_view">
								<div class="item mb15">
									<span class="__layer_title">商户账号：</span>
									<span class="__layer_content big-font red">${dataObj.mch_account}</span>
								</div>
								<div class="item mb15">
									<span class="__layer_title">商户昵称：</span>
									<span class="__layer_content">${dataObj.mch_nickname}</span>
								</div>
								<div class="item mb15">
									<span class="__layer_title">商户类型：</span>
									<span class="__layer_content">${this.$cm_d.tg['mch_type'][dataObj.mch_type]}</span>
								</div>
								<div class="item mb15">
									<span class="__layer_title">商户余额：</span>
									<span class="__layer_content red f_bold">${dataObj.money}</span>
								</div>
								<div class="item mb15">
									<span class="__layer_title">银行卡：</span>
									<select class="__layer_select bank-card"></select>
								</div>
								<div class="item mb15">
									<span class="__layer_title">下发金额：</span>
									<input type="number" class="__layer_input send-money"/> &nbsp; 元
								</div>
								<div class="item mb0">
									<span class="__layer_title">确认金额：</span>
									<input type="number" class="__layer_input rewrite-send-money"/> &nbsp; 元
								</div>
							</div>
						`,
						success: () => {
							// 渲染银行卡号
							const optionHtml = bankCardList.map(item => (`<option value="${item.id}">${item.bank_card_person + '&nbsp;&nbsp;&nbsp;' + item.bank_card_number}</option>`));
							optionHtml.unshift('<option value="" selected>-- 请选择收款账号 --</option>');
							$('.send_view .bank-card').html(optionHtml.join(''))
						},
						yes: (layIndex) => {
							
							const bankCard = $('.send_view .bank-card').val();
							const sendMoney = $('.send_view .send-money').val();
							const rewriteSendMoney = $('.send_view .rewrite-send-money').val();

							if (bankCard === '') return layer.msg('请选择收款账号', {icon: 2, time: 1500});
							if (sendMoney === '') return layer.msg('请输入下发金额', {icon: 2, time: 1500});
							if (sendMoney <= 0) return layer.msg('下发金额不能小于等于0', {icon: 2, time: 1500});

							if (sendMoney !== rewriteSendMoney) return layer.msg('两次输入金额不一致，请重新输入', {icon: 2, time: 1500});
							if ((+sendMoney) > (+dataObj.money)) return layer.msg('下发金额不能大于商户余额', {icon: 2, time: 1500});
							
							layer.confirm(`确定为商户 ${dataObj.mch_account} 下发 ${sendMoney} 元吗？`, {title: '下发', icon: 7}, confirmIndex => {
								this.$axios.post('Merchant/merchant_withdraw', {
									id: dataObj.id,
									money: sendMoney,
									account_id: bankCard,
									prompt: true,
								}).then(res => {
									if (!res) {
										layer.close(confirmIndex)
										setTimeout(() => {
											layer.close(layIndex);
											this.request_data();
										}, 1500)
									}
								})
							})
						}
					})
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