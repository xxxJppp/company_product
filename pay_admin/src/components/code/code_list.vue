<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 码户管理 >
				<span>码户列表</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button @click="add" class="auth_add" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.cp_account" placeholder="码户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="fl ml5" style="width: 150px;">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.account_type" placeholder="账号类型">
								<el-option label="全部" value=""></el-option>
								<el-option label="独立金额" value="1"></el-option>
								<el-option label="已分配店员" value="2"></el-option>
								<el-option label="未分配店员" value="3"></el-option>
								<el-option label="启动收款" value="4"></el-option>
								<el-option label="未启动收款" value="5"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

				<a @click="select_data" href="javascript:void(0)" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

				<div class="fl" style="margin-left: 30px; margin-top: 5px;">
					<el-checkbox v-model="disabled_member" @change="change_disabled">禁止登录用户</el-checkbox>
				</div>

				<div class="fl" style="margin-top: 4px; margin-left: 20px;">
					<div class="am-btn-group am-btn-group-xs">
						<button type="button" class="am-btn am-btn-default" @click="checked_all">
							<span class="am-icon-plus"></span> 全选</button>
						<button type="button" class="am-btn am-btn-default" @click="checked_user(2)">
							<span class="am-icon-plus"></span> 选中暂停用户</button>
						<button type="button" class="am-btn am-btn-default" @click="checked_user(4)">
							<span class="am-icon-plus"></span> 选中风控用户</button>
						<button type="button" class="am-btn am-btn-default " @click="openAll()">
							<span class="el-icon-check"></span> 启用</button>
						<button type="button" class="am-btn am-btn-default " @click="stopAll()">
							<span class="el-icon-close"></span> 暂停</button>
					</div>
				</div>

			</div>

			<table width="100%" class="common_table">
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						<th>人数</th>
						<th>码户ID</th>
						<th>码户账号</th>
						<th>昵称</th>
						<th>店员分配</th>
						<th>上级账号</th>
						<th>返点</th>
						<!-- <th>支付宝返点比例</th> -->
						<!-- <th>押金数额</th> -->
						<th>收款额度</th>
						<th>限制额度</th>
						<th>创建时间</th>
						<!-- <th v-if="$store.getters.getQrcode">二维码</th> -->
						<th>上级操作</th>
						<th class="control_T">操作</th>
						<th>备注</th>
						<th>状态</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="item.id">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>
						<td>
							<span class="table_badge_container">
								<i class="bubble" v-if="item.team_number > 0">{{ item.team_number }}</i>
							</span>
						</td>
						<td>{{ item.cp_unique_id }}</td>
						<td>
							<i class="_info" @click="selectOrder(item.cp_account)">{{ item.cp_account }}</i>
						</td>
						<td>{{ item.cp_nickname }}</td>
						<td class="f_bold" :class="$cm_d.tg['clerk_status_c'][item.wx_assis_status]">{{ $cm_d.tg['clerk_status'][item.wx_assis_status] }}</td>
						<td>{{ item.cp_top_account }}</td>
						<td>{{ item.wx_rebate }}</td>
						<!-- <td>{{ item.ali_rebate }}</td> -->

						<!-- <td>{{ item.deposit_amount }}</td> -->
						
						<!-- @click="updataAmountMoney(item.cp_account, item.gather_amount_limit)" -->
						<td>
							<span
						 	 :class="item.gather_amount_limit > 0 ? 'red f_bold' : ''">
								{{ item.gather_amount_limit }}
							</span>
						</td>
						<td class="red">{{ item.gal_personal }}</td>
						<td>{{ item.create_time.slice(0, item.create_time.lastIndexOf(':')) }}</td>
						
						<!-- <td v-if="$store.getters.getQrcode">
							<router-link class="_info cp" :to="{path: '/admin/code/code_qrcode', query: {cp: item.cp_account}}" tag="span">查看</router-link>
						</td> -->
						<td>
							<span v-if="item.is_alter_up" class="auth_changeSuper _info" @click="changeSuper(item.id)">更改上级</span>
						</td>
						<td class="control_C">
							<span v-if="item.status == 1" class="open_btn cp ml5 " @click="enabled(item.id)"><i class="el-icon-check"></i>启用</span>
							<span v-else class="close_btn cp " @click="disabled(item.id)"><i class="el-icon-close"></i>禁用</span>
							
							<span class="common_btn cp ml5" @click="limit(item)"><i class="am-icon-cny"></i> 限制额度</span>

							<span v-if="item.wx_assis_status === 0" class="open_btn cp auth_allo ml5" @click="setClerk(item.id)"><i class="el-icon-s-custom"></i>设置店员</span>
							<span v-else class="close_btn cp auth_allo ml5" @click="cancelClerk(item.id)"><i class="el-icon-s-custom"></i>取消分配</span>

							<span class="editor_btn cp auth_eduit ml5" @click="edit(item)"><i class="el-icon-edit-outline"></i>编辑</span>
						</td>

						<td>
							<span class="common_btn cp" v-if="item.remark === ''" @click="$cm_m.textarea_layer('Code_Provider/code_remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callBack: request_data})">填写</span>

							<span v-else class="_info auth_write" @click="$cm_m.textarea_layer('Code_Provider/code_remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callBack: request_data})">
								{{ $cm_m.getStringLength(item.remark) > 12 ? '详细' : item.remark }}
							</span>
						</td>

						<td>
							<span v-if="item.status != 1" class="f_bold" :class="$cm_d.tg['account_status_color'][item.status]">{{ $cm_d.tg['account_status'][item.status] }}</span>
							<span v-if="item.status == 1" @click="showTime(item.id)" class="f_bold cp" :class="$cm_d.tg['account_status_color'][item.status]">{{ $cm_d.tg['account_status'][item.status] }}</span>
						</td>
					</tr>

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="99">
							<img src="../../statics/images/icon/nodate.png">
							<p>{{ `暂时没有${disabled_member ? '禁止登录用户' : '码户'}列表信息` }}</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="am-btn-group am-btn-group-xs">
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
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据

				rebatesList: [],
				dataList: {},
				disabled_member: false,		// 是否查询禁止登陆用户
				form: {
					prompt: true,
					gather_amount_limit: false,
					now_cp: false,
					cp_account: '',
					account_type: '',
					allocation_status: '',
					status: 0,
					page: 1,
					pageSize: 1000
				}
			}
		},
		created() {
			this.form.now_cp = this.$route.query.now_cp;
			this.form.gather_amount_limit = !!this.$route.query.min;
			this.request_data();
		},
		methods: {
			request_data() {
				this.$axios.post('Code_provider/code_provider', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			select_data() {
				this.form.now_cp = false;
				this.form.gather_amount_limit = false;
				this.form.page = 1;
				this.request_data();
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
			
			/**
			 * 选中特定状态用户
			 * @param {Number} statusNum 2: 暂停用户，4: 风控用户
			 */
			checked_user(statusNum) {
				this.checked_data = [];
				this.dataList.list.forEach(item => {
					if (item.status !== statusNum) return;
					this.checked_data.push(item.id);
				})
				if (this.checked_data.length === this.dataList.list.length) {
					this.is_select_all = true;
				} else {
					this.is_select_all = false;
				}
			},

			// 单选按钮
			checked_one() {
				if (this.dataList.list.length === this.checked_data.length)
					this.is_select_all = true;
				else
					this.is_select_all = false;
			},

			/**
			 * 打开所有
			 */
			openAll() {
				if (this.checked_data.length <= 0) return layer.msg('请选择启用的账号', {icon: 2, time: 1500});

				layer.confirm('是否要启用选中的成员账号？', {title: '启用', icon: 7}, layIndex => {
					this.$axios.post('Code_Provider/forbidden_arr', {
						id: this.checked_data,
						status: 0
					}).then(data => {
						this.checked_data = [];
						if (!data) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500)
						}
					})
				})
			},

			/**
			 * 暂停所有
			 */
			stopAll() {
				if (this.checked_data.length <= 0) return layer.msg('请选择暂停的账号', {icon: 2, time: 1500});

				layer.confirm('是否要暂停选中的成员账号？', {title: '暂停', icon: 7}, layIndex => {
					this.$axios.post('Code_Provider/forbidden_arr', {
						id: this.checked_data,
						status: 2
					}).then(data => {
						this.checked_data = [];
						if (!data) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500)
						}
					})
				})
			},


			add() {
				let __data = {
					type: '0',				// 当前开户类型
					leader: null,				// 当前团长
					group: null,				// 当前组长
					isBatch: false,			// 是否是批量
					get lineNum() {
						return this._lineNum
					},
					set lineNum(newVal) {
						const oldVal = this._lineNum;
						let max = Math.max(oldVal, newVal);
						let min = Math.min(oldVal, newVal);
						while(min < max) {
							min++;
							if (newVal < oldVal) {
								reduceLineHeight();
							} else {
								addLineHeight();
							}
						}
						this._lineNum = newVal;
					},
					_lineNum: 0,			// 添加行的数量
				}

				const lineHeight = 51;

				function reduceLineHeight() {
					$('#add_code').css({ 'height': $('#add_code').outerHeight(true) - lineHeight + 'px' });
					$('#add_code').parents('.layui-layer').css({ 'height': $('#add_code').parents('.layui-layer').outerHeight(true) - lineHeight + 'px' });
				};

				function addLineHeight() {
					$('#add_code').css({ 'height': $('#add_code').outerHeight(true) + lineHeight + 'px' });
					$('#add_code').parents('.layui-layer').css({ 'height': $('#add_code').parents('.layui-layer').outerHeight(true) + lineHeight + 'px' });
				};

				layer.open({
					type: 1,
					area: ['500px', '415px'],
					offset: '150px',
					id: 'add_code',
					btn: ['确认'],
					title: '新增码户',
					content: `
						<div class="__layer add_code">
							<div class="item mb15">
								<span class="__layer_title">批量增加：</span>

								<input type="radio" class="__layer_radio" id="batch_add_1" name="batch_add" value="1">
								<label for="batch_add_1" style="margin-right: 20px;"> 批量</label>

								<input type="radio" id="batch_add_2" class="__layer_radio" name="batch_add" value="0" checked>
								<label for="batch_add_2"><span id="other_radio"> 单个</span></label>
							</div>
							
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<input class="__layer_input code_account" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置码户账号</span>
							</div>

							<div class="item mb15 dn sort_view">
								<span class="__layer_title">序号：</span>
								
								<span class="code_account_content"></span>
								<input class="__layer_input start_num" style="width: 50px;" type="number" autocomplete="off"/>
								-
								<span class="code_account_content"></span>
								<input class="__layer_input end_num" style="width: 50px;" type="number" autocomplete="off"/>
							</div>

							<div class="item mb15">
								<span class="__layer_title">昵称：</span>
								<input class="__layer_input code_nickname" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置昵称</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">码户密码：</span>
								<input class="__layer_input code_password" type="text" autocomplete="off"/>
								<span class="__layer_tips">请设置码户密码</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">账号类型：</span>

								<input type="radio" class="__layer_radio" id="checkbox_1" name="account_type" value="0" checked>
								<label for="checkbox_1" style="margin-right: 20px;">总团长</label>

								<input type="radio" class="__layer_radio" id="checkbox_2" name="account_type" value="1">
								<label for="checkbox_2" style="margin-right: 20px;">团长</label>

								<input type="radio" class="__layer_radio" id="checkbox_3" name="account_type" value="2">
								<label for="checkbox_3" style="margin-right: 20px;">组长</label>
								
								<input type="radio" class="__layer_radio" id="checkbox_4" name="account_type" value="3">
								<label for="checkbox_4" style="margin-right: 20px;">组员</label>

							</div>
							<div class="item mb15 leader_view dn">
								<span class="__layer_title">选择团长：</span>
								<span id="leader" style="margin-right: 20px;" class="dn"></span>
								<button class="layui-btn layui-btn-normal layui-btn-sm select_leader" data-type="2">
									选择团长
								</button>
							</div>
							<div class="item mb15 group_leader_view dn">
								<span class="__layer_title">选择组长：</span>
								<span id="group" style="margin-right: 20px;" class="dn"></span>
								<button class="layui-btn layui-btn-normal layui-btn-sm select_leader" data-type="3">
									选择组长
								</button>
							</div>
							<div class="item mb0">
								<span class="__layer_title">微信返点比例：</span>
								<select class="__layer_input wechat_rebate"></select>
								<span class="__layer_tips">请选择微信返点比例</span>
							</div>
						</div>
					`,
					success: () => {
						const rebateList = this.$store.getters.getRebateList;
						// 渲染返点比例
						const renderRebates = ({wx_rebate = Infinity, ali_rebate  = Infinity} = {}) => {
							const wxRebateArr = rebateList.filter(item => (wx_rebate >= item.value));
							const wxHtml = wxRebateArr.map(item => `<option value="${item.value}">${item.name}</option>`)
							$('.add_code .wechat_rebate').html(wxHtml.join(''));

							/* const aliRebateArr = rebateList.filter(item => (ali_rebate >= item.value));
							const aliHtml = aliRebateArr.map(item => `<option value="${item.value}">${item.name}</option>`)
							$('.add_code .alipay_rebate').html(aliHtml.join('')); */
						}
						renderRebates()

						/**
						 * 重置选项
						 */
						const reload = () => {
							__data.leader = null;
							__data.group = null;

							$('.add_code #leader, .add_code #group').addClass('dn').html('');
						}

						/**
						 * 获取码户返点比例并渲染
						 */
						const getRebates = (cp_account) => {
							this.$axios.post('Code_provider/sub_rebate', {
								cp_account,
							}).then(res => {
								if (res.error) return;
								renderRebates(res);
							})
						}

						// 批量增加功能------------------
						$('.add_code [name="batch_add"]').on('change', function() {
							const val = $(this).val();
							__data.isBatch = val === '1';
							if (val === '1') {
								__data.lineNum++;
								$('.add_code .sort_view').removeClass('dn');
							} else {
								__data.lineNum--;
								$('.add_code .sort_view').addClass('dn');
							}
						})
						$('.add_code .code_account').on('input', function() {
							$('.add_code .code_account_content').html($(this).val());
						})
						// 批量增加功能------------------


						
						// 账号类型变化功能------------------
						const changeOBj = {
							'1': () => {
								$('.add_code .group_leader_view').addClass('dn');
								$('.add_code .leader_view').removeClass('dn');
								__data.isBatch ? __data.lineNum = 2 : __data.lineNum = 1;
							},
							'2': () => {
								$('.add_code .group_leader_view').addClass('dn');
								$('.add_code .leader_view').removeClass('dn');
								__data.isBatch ? __data.lineNum = 2 : __data.lineNum = 1;
							},
							'3': () => {
								$('.add_code .leader_view').removeClass('dn');
								$('.add_code .group_leader_view').removeClass('dn');
								__data.isBatch ? __data.lineNum = 3 : __data.lineNum = 2;
							}
						}
						$('.add_code [name="account_type"]').on('change', (e) => {
							reload();
							
							const VAL = $(e.currentTarget).val();
							__data.type = VAL;
							if (VAL === '0') {
								__data.lineNum = !__data.isBatch ? 0 : 1

								renderRebates();
								$('.add_code .leader_view, .add_code .group_leader_view').addClass('dn');
							} else {
								return changeOBj[VAL]()
							}
						})
						// 账号类型变化功能------------------
						
						// 选择团长和选择组长功能------------------
						$('.add_code .select_leader').on('click', (e) => {
							const TYPE = $(e.currentTarget).data('type');
							// 选择组长操作
							if (TYPE === 3 && !__data.leader) {
								return layer.msg('请先选择团长账号', {icon: 2, time: 1500});
							}
							this.addSelectSup({
								type: TYPE,
								sup_account: TYPE === 3 ? __data.leader : null,
								callBack: (cp_account) => {
									if (TYPE === 2) {
										__data.leader = cp_account;
										$('.add_code #leader').removeClass('dn').html(cp_account)
									} else {
										__data.group = cp_account;
										$('.add_code #group').removeClass('dn').html(cp_account)
									}
									getRebates(cp_account)
								}
							});
						})
						// 选择团长和选择组长功能------------------
					},
					yes: (layIndex) => {
						const passReg = /^[a-zA-Z0-9]{6,15}$/,
							accountReg = /^[A-Za-z0-9_]+$/;
						
						let code_account = $('.add_code .code_account').val(),
							code_nickname = $('.add_code .code_nickname').val(),
							code_password = $('.add_code .code_password').val(),
							wechat_rebate = $('.add_code .wechat_rebate').val(),
							account_type = $('.add_code [name="account_type"]:checked').val(),
							sup_account = '';
						if (__data.type !== '0') {
							sup_account = (__data.type === '1' || __data.type === '2') ? __data.leader : __data.group;

							if (__data.type === '1' && !__data.leader) { return layer.msg('请选择团长账号', {time: 1500, icon: 2}) };
							if (__data.type === '2' && !__data.leader) { return layer.msg('请选择团长账号', {time: 1500, icon: 2}) };
							if (__data.type === '3' && !__data.group) { return layer.msg('请选择组长账号', {time: 1500, icon: 2}) };
						}
						
						// 批量添加
						let batch_add = $('.add_code [name="batch_add"]:checked').val(),	// '1' 要批量，'0' 不用
							start_num = +$('.add_code .start_num').val(),
							end_num = +$('.add_code .end_num').val();

						if (code_account === '') { return layer.msg('请设置码户账号', {time: 1500, icon: 2}) };
						if (code_nickname === '') { return layer.msg('请设置昵称', {time: 1500, icon: 2}) };
						if (code_password === '') { return layer.msg('请设置码户密码', {time: 1500, icon: 2}) };

						if (!accountReg.test(code_account)) return layer.msg('码户账号只能由英文和数字加下划线组成！', {time: 1500, icon: 2});

						if (!passReg.test(code_password)) return layer.msg('密码由6-15位数字或字母组成', {time: 1500, icon: 2});

						const options = {
							layIndex,
						};

						if (batch_add === '1') {
							if (start_num === '') { return layer.msg('请设置开始序号', {time: 1500, icon: 2}) };
							if (end_num === '') { return layer.msg('请设置结束序号', {time: 1500, icon: 2}) };
							if (start_num > end_num) { return layer.msg('开始序号不能大于结束序号', {time: 1500, icon: 2}) };

							let requestArr = [];
							while(start_num <= end_num) {
								requestArr.push({
									cp_account: code_account + start_num++,
									cp_nickname: code_nickname,
									cp_password: code_password,
									wx_rebate: wechat_rebate,
									sup_account,
									cp_account_type: account_type,
								})
							}
							this.addRequest(requestArr, options);
						} else {
							this.addRequest({
								cp_account: code_account,
								cp_nickname: code_nickname,
								cp_password: code_password,
								wx_rebate: wechat_rebate,
								prompt: true,
								sup_account,
								cp_account_type: account_type,
							}, options);
						}

					}
				})
			},

			/**
			 * 添加账号请求
			 * @param {Object | Array} requestData 请求数据
			 * @param {Object} options 配置
			 */
			addRequest(requestData, options = {}) {
				let interval_id = null;

				if (Array.isArray(requestData)) {
					layer.open({
						type: 1,
						closeBtn: 2,
						area: ['325px', '160px'],			
						content: `
						<div class="loadingBar_layer">
							<div class="loading_bar">
								<div class="yet_loading"></div>
								<span class="load_num">0%</span>
								<span class="tips_text">正在添加账号，请稍后.....</span>
							</div>
						</div>
						`,
						title: '添加账号',
						success: (layer_id, loadingLayerId) => {
							let per = 0,				// 进度条百分比
								currentIndex = 0;		// 当前上传完成的二维码数

							let renderLoadBar = (reload) => {
								if (reload) {
									per = Math.floor(100 / requestData.length) * (currentIndex);
								}
								if (per >= Math.floor(100 / requestData.length) * (currentIndex + 1)) {
									return;
								}
								per += 1;
								$('.loadingBar_layer .yet_loading').css('width', `${per}%`);
								$('.loadingBar_layer .load_num').html(per + '%')
								if (per >= 99) {
									clearInterval(interval_id)
								}
							}

							interval_id = setInterval(() => {
								renderLoadBar();
							}, 500)


							let addAccount = (item) => {
								return new Promise(async (resolve, reject) => {
									this.$axios.post('Code_provider/code_provider_add', item).then(res => {
										currentIndex++;

										if (res && res.error) {
											clearInterval(interval_id)
											layer.close(loadingLayerId);
											throw new Error('上传失败');
										}

										if (res === 'OK' && currentIndex != requestData.length) {
											renderLoadBar(true);
											$('.loadingBar_layer .tips_text').html(`已添加<span class="red f_bold">${currentIndex}</span>个账号，请稍后...`);
											resolve();
										}

										if(currentIndex == requestData.length) {
											per = 100;
											layer.msg('添加成功', {icon: 1, time: 1500})
											setTimeout(() => {
												clearInterval(interval_id)
												layer.close(loadingLayerId);
												layer.close(options.layIndex);
												this.request_data();
											}, 1500);
											resolve();
										}
									})
								})
							}

							(async () => {
								for(const item of requestData) {
									await addAccount(item);
								}
							})();
						},
						end: () => {
							clearInterval(interval_id)
							$('.loadingBar_layer .yet_loading').css('width', `0%`);
							$('.loadingBar_layer .load_num').html(0 + '%')
						}
					})
				} else {
					this.$axios.post('Code_provider/code_provider_add', requestData).then(res => {
						if (res === 'OK') {
							layer.msg('添加成功', {icon: 1, time: 1500, zIndex: 99999999 })
							setTimeout(() => {
								layer.close(options.layIndex);
								this.request_data();
							}, 1500)
						}
					})
				}
			},

			/**
			 * 选择上级弹框
			 * 
			 */
			addSelectSup({type = 2, sup_account = '', callBack = () => {}} = {}) {
				window.__selectSupData = {type, sup_account};

				layer.open({
					type: 2,
					title: '选择上级',
					shade: [0],
					area: ['1000px', '680px'],
					time: false, //2秒后自动关闭
					anim: 2,
					id: 'addSelectSup',
					content: `${window.location.pathname}#/select_sup`,
					success: (__layer, layerIndex) => {
						$('#addSelectSup').find('iframe').contents().find('body').css('overflowY', 'auto')
						window.__selectSupOver = (cp_account) => {
							callBack(cp_account)
							layer.msg('选择成功', {icon: 1, time: 1000});

							setTimeout(() => {
								layer.close(layerIndex);
							}, 1000)
						}
					}
				});	
			},
			

			async edit(dataObj) {
				const AREA = dataObj.is_alter_gal_type ? ['500px', '420px'] : ['500px', '370px'];
				let disabledArgs = null;

				const MAXREBARE = await this.getTopRebate(dataObj.cp_account);
				const WECHATREBATELIST = this.$store.getters.getRebateList.filter(item => item.value <= MAXREBARE.wx_rebate);
				// const ALIPAYREBATELIST = this.$store.getters.getRebateList.filter(item => item.value <= MAXREBARE.ali_rebate);
				
				/* 
				<div class="item mb15">
					<span class="__layer_title">支付宝返点比例：</span>
					<select class="__layer_input alipay_rebate"></select>
					<span class="__layer_tips">请选择支付宝返点比例</span>
				</div>
				*/
				

				layer.open({
					type: 1,
					area: AREA,
					btn: ['确认'],
					title: '编辑码户',
					content: `
						<div class="__layer edit_code">
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<input class="__layer_input code_account" value="${dataObj.cp_account}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入码户账号</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">昵称：</span>
								<input class="__layer_input code_nickname" value="${dataObj.cp_nickname}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入昵称</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">码户密码：</span>
								<input class="__layer_input code_password" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入码户密码</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">微信返点比例：</span>
								<select class="__layer_input wechat_rebate"></select>
								<span class="__layer_tips">请选择微信返点比例</span>
							</div>
							
							<div class="item mb15 ${!dataObj.is_alter_gal_type ? 'dn' : ''}">
								<span class="__layer_title">收款额度类型：</span>

								<input type="radio" class="__layer_radio" id="receipt_1" name="receipt" value="0" ${dataObj.gal_type == '0' ? 'checked' : ''}>
								<label for="receipt_1" style="margin-right: 20px;">共享上级额度</label>

								<input type="radio" id="receipt_2" class="__layer_radio" name="receipt" value="1" ${dataObj.gal_type == '1' ? 'checked' : ''}>
								<label for="receipt_2"> 使用自身额度</label>
							</div>
							<div class="item mb0">
								<span class="__layer_title">状态：</span>

								<input type="radio" id="radio_status_0" class="__layer_radio" name="cp_type" value="0" ${dataObj.status == '3' ? 'disabled' : '' } ${dataObj.status == '0' ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="radio_status_0">启用</label>

								<input type="radio" id="radio_status_1" class="__layer_radio" name="cp_type" value="1" ${dataObj.status == '1' ? 'checked' : ''}> 
								<label style="margin-right: 30px;" for="radio_status_1">禁用</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="cp_type" value="2" ${dataObj.status == '2' ? 'checked' : ''}> 
								<label class="${dataObj.status == '3' || dataObj.status == '4' ? 'dn' : '' }" for="radio_status_2">系统暂停</label>

								<input type="radio" id="radio_status_3" class="__layer_radio" name="cp_type" value="3" ${dataObj.status == '3' ? 'checked' : ''}> 
								<label class="${dataObj.status != '3' ? 'dn' : '' }" for="radio_status_3">团长暂停</label>

								<input type="radio" id="radio_status_4" class="__layer_radio" name="cp_type" value="4" ${dataObj.status == '4' ? 'checked' : ''}> 
								<label class="${dataObj.status != '4' ? 'dn' : '' }" for="radio_status_4">风控暂停</label>
							</div>
						</div>
					`,
					success: () => {
						let wechatRebateHtmlList = WECHATREBATELIST.map(item => `<option value="${item.value}" ${(item.value / 10) == dataObj.wx_rebate ? 'selected' : ''}>${item.name}</option>`)
						$('.edit_code .wechat_rebate').html(wechatRebateHtmlList.join(''));

						// let alipayRebateHtmlList = ALIPAYREBATELIST.map(item => `<option value="${item.value}" ${(item.value / 10) == dataObj.ali_rebate ? 'selected' : ''}>${item.name}</option>`)
						// $('.edit_code .alipay_rebate').html(alipayRebateHtmlList.join(''));

						$('.edit_code [name="cp_type"]').on('change', () => {
							let value = $('.edit_code [name="cp_type"]:checked').val();
							if (value != 1) return;

							layer.open({
								type: '1',
								title: '禁用账号',
								area: ['515px', '290px'],
								btn: ['确认'],
								content: `
									<div class="__layer disabled_view">
										<div class="item mb15">
											<span class="__layer_title">禁用时长：</span>
											<input type="radio" id="disabled_status_1" class="__layer_radio" name="account_status" checked value="0"> 
											<label style="margin-right: 10px;" for="disabled_status_1">永久</label>

											<input type="radio" id="disabled_status_2" class="__layer_radio" name="account_status" value="1"> 
											<label style="margin-right: 10px;" for="disabled_status_2">按天禁用</label>

											<input type="radio" id="disabled_status_3" class="__layer_radio" name="account_status" value="2"> 
											<label style="margin-right: 10px;" for="disabled_status_3">按时禁用</label>

											<input type="radio" id="disabled_status_4" class="__layer_radio" name="account_status" value="3"> 
											<label for="disabled_status_4">按分禁用</label>
										</div>
										<div class="item mb10">
											<span class="__layer_title">禁用时间：</span>
											<input class="__layer_input disabled_time" type="number" disabled autocomplete="off"/>
											<span class="__layer_tips unit"></span>
										</div>
										<div class="item mb0">
											<span class="__layer_title">禁用原因：</span>
											<textarea class="__layer_textarea remark" style="width: 340px; height: 70px;"></textarea>
										</div>
									</div>`,
								success: () => {
									$('.disabled_view [name="account_status"]').on('change', function() {
										const val = $(this).val();
										if(val === '0') {
											$('.disabled_view .disabled_time').val('').prop('disabled', true);
											$('.disabled_view .unit').html('');
											return;
										};
										$('.disabled_view .disabled_time').prop('disabled', false);
										const tgObj = {
											'1': '天',
											'2': '小时',
											'3': '分钟',
										};
										$('.disabled_view .unit').html(tgObj[val]);
									})
								},
								yes: (layIndex) => {
									const time_type = $('.disabled_view [name="account_status"]:checked').val();
									const time = $('.disabled_view .disabled_time').val();
									const remark = $('.disabled_view .remark').val();
									
									if (time_type !== '0' && time == '') {
										return layer.msg('请输入需要禁用的时间', {icon: 2, time: 1500});
									}
									if (remark === '') {
										return layer.msg('禁用原因不能为空', {icon: 2, time: 1500});
									}
									disabledArgs = {
										time_type, time, remark,
									};
									layer.close(layIndex);
								}
							})
						})
					},
					yes: (layIndex) => {
						let code_account = $('.edit_code .code_account').val(),
							code_nickname = $('.edit_code .code_nickname').val(),
							code_password = $('.edit_code .code_password').val(),
							wechat_rebate = $('.edit_code .wechat_rebate').val(),
							// alipay_rebate = $('.edit_code .alipay_rebate').val(),
							status = $('.edit_code [name="cp_type"]:checked').val(),
							receipt = $('.edit_code [name=receipt]:checked').val();


						if (code_account === '') { return layer.msg('请输入码户账号', {time: 1500, icon: 2}) };
						if (code_nickname === '') { return layer.msg('请输入昵称', {time: 1500, icon: 2}) };

						let reqObj = {
							cp_account: code_account,
							cp_nickname: code_nickname,
							cp_password: code_password,
							wx_rebate: wechat_rebate,
							// ali_rebate: alipay_rebate,
							id: dataObj.id,
							gal_type:receipt,
							status,
						};

						if (status == 1) {
							Object.assign(reqObj, disabledArgs);
						}

						this.$axios.post('Code_provider/code_provider_edit', reqObj).then(res => {
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
			 * 获取上级返点
			 */
			getTopRebate(cp_account) {
				return new Promise(resolve => {
					this.$axios.post('Code_provider/sub_rebate', {
						cp_account,
						is_self: true
					}).then(res => {
						if (res.error) return;
						resolve(res);
					})
				})
			},

			// 更改上级
			changeSuper(id) {
				let __data = {
					leader: null,		// 团长账号
					group: null,		// 组长账号
				}
				layer.open({
					type: 1,
					area: ['410px', '206px'],
					btn: ['确认'],
					title: '更改上级',
					content: `
						<div class="__layer change-super">
							<div class="item mb15 leader_view">
								<span class="__layer_title">选择团长：</span>
								<span id="leader" style="margin-right: 20px;" class="dn"></span>
								<button class="layui-btn layui-btn-normal layui-btn-sm select_leader" data-type="2">
									选择团长
								</button>
							</div>
							<div class="item mb0 group_leader_view">
								<span class="__layer_title">选择组长：</span>
								<span id="group" style="margin-right: 20px;" class="dn"></span>
								<button class="layui-btn layui-btn-normal layui-btn-sm select_leader" data-type="3">
									选择组长
								</button>
							</div>
						</div>
					`,
					success: () => {
						$('.change-super .select_leader').on('click', (e) => {
							const TYPE = $(e.currentTarget).data('type');
							// 选择组长操作
							if (TYPE === 3 && !__data.leader) {
								return layer.msg('请先选择团长账号', {icon: 2, time: 1500});
							}
							this.addSelectSup({
								type: TYPE,
								sup_account: __data.leader,
								callBack: (cp_account) => {
									if (TYPE === 2) {
										__data.leader = cp_account;
										$('.change-super #leader').removeClass('dn').html(cp_account)
									} else {
										__data.group = cp_account;
										$('.change-super #group').removeClass('dn').html(cp_account)
									}
								}
							});
						})
					},
					yes: (layIndex) => {
						if (!__data.leader) return layer.msg('请选择团长账号', {icon: 2, time: 1500});
						if (!__data.group) return layer.msg('请选择组长账号', {icon: 2, time: 1500});
						this.$axios.post('Code_provider/alter_sup', {
							id,
							cp_account: __data.group,
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

			// 查询对应用户订单
			selectOrder(codeAccount) {
				this.$router.push({path: '/admin/mch/mch_order', query: {'cp_account': codeAccount}});
			},

			disabled(id) {
				layer.open({
					type: '1',
					title: '禁用账号',
					area: ['515px', '285px'],
					btn: ['确认'],
					content: `
						<div class="__layer disabled_view">
							<div class="item mb10">
								<span class="__layer_title">禁用时长：</span>
								<input type="radio" id="radio_1" class="__layer_radio" name="account_status" checked value="0"> 
								<label style="margin-right: 10px;" for="radio_1">永久</label>

								<input type="radio" id="radio_2" class="__layer_radio" name="account_status" value="1"> 
								<label style="margin-right: 10px;" for="radio_2">按天禁用</label>

								<input type="radio" id="radio_3" class="__layer_radio" name="account_status" value="2"> 
								<label style="margin-right: 10px;" for="radio_3">按时禁用</label>

								<input type="radio" id="radio_4" class="__layer_radio" name="account_status" value="3"> 
								<label for="radio_4">按分禁用</label>
							</div>
							<div class="item mb10">
								<span class="__layer_title">禁用时间：</span>
								<input class="__layer_input disabled_time" type="number" disabled autocomplete="off"/>
								<span class="__layer_tips unit"></span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">禁用原因：</span>
								<textarea class="__layer_textarea remark" style="width: 340px; height: 70px;"></textarea>
							</div>
						</div>`,
					success: () => {
						$('.disabled_view [name="account_status"]').on('change', function() {
							const val = $(this).val();
							if(val === '0') {
								$('.disabled_view .disabled_time').val('').prop('disabled', true);
								$('.disabled_view .unit').html('');
								return;
							};
							$('.disabled_view .disabled_time').prop('disabled', false);
							const tgObj = {
								'1': '天',
								'2': '小时',
								'3': '分钟',
							};
							$('.disabled_view .unit').html(tgObj[val]);
						})
					},
					yes: (layIndex) => {
						const time_type = $('.disabled_view [name="account_status"]:checked').val();
						const time = $('.disabled_view .disabled_time').val();
						const remark = $('.disabled_view .remark').val();

						if (time_type !== '0' && time == '') {
							return layer.msg('请输入需要禁用的时间', {icon: 2, time: 1500});
						}
						if (remark === '') {
							return layer.msg('禁用原因不能为空', {icon: 2, time: 1500});
						}
						
						this.$axios.post('Code_provider/status_edit', {
							time_type, time, id, remark,
							status: 1,
						}).then(res => {
							if(!res) {
								setTimeout(() => {
									layer.close(layIndex);
									this.request_data();
								}, 1500)
							}
						})
					}
				})
			},

			enabled(id) {
				layer.confirm('是否要启用选中的成员账号？', {title: '启用', icon: 7}, layIndex => {
					this.$axios.post('Code_provider/status_edit', {
						id,
						status: 0
					}).then(data => {
						if (!data) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500)
						}
					})
				})
			},

			/**
			 * 设置店员操作
			 */
			setClerk(id) {
				let get_clerk = this.$axios.post('Assis/get_assis_nickname');
				layer.open({
					type: 1,
					area: ['440px', '160px'],
					id: 'add_code',
					btn: ['确认'],
					title: '设置店员操作',
					content: `
						<div class="__layer set-clerk">
							<div class="item mb0">
								<span class="__layer_title">微信店员：</span>
								<select class="__layer_input" id="wechat-clerk"></select>
								<span class="__layer_tips">请选择微信店员</span>
							</div>
						</div>
					`,
					success: async () => {
						let clerk_data = await get_clerk;
						const SELECTARR = clerk_data.map(item => (`<option value="${item.id}">${item.wx_nickname}</option>`))
						$('.set-clerk #wechat-clerk').html(SELECTARR.join(''));
					},
					yes: (layIndex) => {
						const WECHATID = $('.set-clerk #wechat-clerk').val();
						this.$axios.post('Assis/set_assis', {
							wx_assis_id: WECHATID,
							cp_id: id,
							prompt: true,
						}).then(data => {
							if (!data) {
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
			 * 取消分配
			 */
			cancelClerk(id) {
				layer.confirm('是否要取消选中码户所绑定的微信店员？', {title: '启用', icon: 7}, layIndex => {
					this.$axios.post('Assis/cancel_assis', {
						cp_id: id,
					}).then(data => {
						if (!data) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500)
						}
					})
				})
			},


			/**
			 * 显示时间
			 */
			showTime(id) {
				let timeId;
				layer.open({
					type: 1,
					title: '禁用时间',
					area: ['300px', '170px'],
					btn: ['确定'],
					skin: 'layui-layer-rim', //加上边框
					content: `
						<div class="__layer diabled_view">
							<div class="item mb0">
								<span class="__layer_title fl" style="width: 80px;">禁用时间：</span>
								<span style="width: 140px;" class="__layer_content diabled_time fl"></span>
							</div>
						</div>
					`,
					success: () => {
						this.$axios.post('Code_provider/residue_time', {id}).then(res => {
							if (!res) return;
							if (res.type == 'perpetual') {
								$('.diabled_view .diabled_time').html('永久')
							} else {
								const {day, hour, minute} = res;
								$('.diabled_view .diabled_time').html(`${day} 天 ${hour} 小时 ${minute} 分`)
								timeId = setInterval(() => {
									$('.diabled_view .diabled_time').html(`${day} 天 ${hour} 小时 ${minute} 分`)
								}, 60000);
							}
						})
					},
					end: () => {
						clearInterval(timeId);
					}
				});
			},

			/**
			 * 修改收款金额
			 * @param 
			 */
			/* updataAmountMoney(cp_account, gather_amount_limit) {
				layer.open({
					type: 1,
					area: ['400px', '320px'],
					btn: ['确认'],
					title: '修改收款金额',
					content: `
						<div class="__layer amount-view">
							<div class="item mb15">
								<span class="__layer_title">码户账号：</span>
								<span class="__layer_content">${cp_account}</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">收款额度：</span>
								<span class="__layer_content">${gather_amount_limit}</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">额度操作：</span>

								<input type="radio" class="__layer_radio" id="checkbox_1" name="limit_control" value="1" checked>
								<label for="checkbox_1" style="margin-right: 20px;">增加额度</label>

								<input type="radio" id="checkbox_2" class="__layer_radio" name="limit_control" value="2">
								<label for="checkbox_2"><span id="other_radio">减少额度</span></label>
							</div>
							<div class="item mb0">
								<span class="__layer_title">金额：</span>
								<input class="__layer_input money" type="number" autocomplete="off"/>
							</div>
						</div>
					`,
					yes: (layIndex) => {
						let type = $('.amount-view [name=limit_control]:checked').val(),
							deposit_money = $('.amount-view .money').val();


						if (deposit_money === '') return layer.msg('请输入操作的金额', {time: 1500, icon: 2});
						if (deposit_money < 0)  return layer.msg('操作的金额不能小于 0', {time: 1500, icon: 2});

						this.$axios.post('Code_provider/deposit_operation', {
							deposit_money,
							type,
							cp_account,
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
			}, */

			/**
			 * 额度配置	
			 * @param {Number} id 操作数据的id
			 * @param {Number} limit_type 0无限制 1有限制
			 */
			limit(dataObj) {
				let radioHtml;

				const isLimit = dataObj.gal_personal === '无限制';

				if (isLimit) {
					radioHtml = `
						<input class="__layer_radio" id="limit_type_1" type="radio" name="handle" value="3"/>
						<label style="margin-right: 15px;" for="limit_type_1"> 有限制</label>

						<input class="__layer_radio" id="limit_type_2" type="radio" name="handle" value="2" checked/>
						<label for="limit_type_2"> 无限制</label>`

				} else {
					radioHtml = `
						<input class="__layer_radio" id="limit_type_3" type="radio" name="handle" value="0" checked/>
						<label style="margin-right: 15px;" for="limit_type_3"> 增加</label>

						<input class="__layer_radio" id="limit_type_4" type="radio" name="handle" value="1"/>
						<label style="margin-right: 15px;" for="limit_type_4"> 减少</label>

						<input class="__layer_radio" id="limit_type_5" type="radio" name="handle" value="2"/>
						<label for="limit_type_5"> 无限制</label>
					`
				}

				layer.open({
					type: 1,
					area: ['370px', '210px'],
					btn: ['确定'],
					title: '额度设置',
					content: `
						<div class="__layer limit_view">
							<div class="item mb15">
								<span class="__layer_title">额度操作：</span>
								${radioHtml}
							</div>
							<div class="item mb0">
								<span class="__layer_title">金额：</span>
								<input class="__layer_input amount" style="width: 100px;" type="text" autocomplete="off"/> 元
							</div>
						</div>
					`,
					success: () => {
						if (isLimit) {
							$('.limit_view .amount').prop('disabled', true);
						};

						$('.limit_view [name="handle"]').on('change', () => {

							let val = $('.limit_view [name="handle"]:checked').val();
							if (val == 2) {
								$('.limit_view .amount').val('').prop('disabled', true);
							} else {
								$('.limit_view .amount').val('').prop('disabled', false);
							}
						})
					},
					yes: (layIndex) => {
						let limit_type = $('.limit_view [name="handle"]:checked').val(),
							amount = $('.limit_view .amount').val();

						if (limit_type !== '2' && amount === '') { return this.$m.hint_layer('请输入金额', 2) };

						this.$axios.post('Code_Provider/cp_limit_money', {
							id: dataObj.id,
							amount, limit_type,
						}).then(data => {
							if (!data) {
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
	}
</script>