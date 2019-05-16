<template>
	<div>
		<div class="content_item">
			<div class="item_title">
				<span>组长列表</span>
			</div>
			<div class="layui-form item_content">
				<div class="layui-inline" style="margin-left: 20px;">
                    <button
                     class="layui-btn layui-btn-sm"
                     @click="addMyGroup()"
                     >新增我的组长</button>
                </div>

				<div class="layui-inline">
					<label class="layui-form-label w80">账号：</label>
					<div class="layui-input-inline">
						<input
							@keyup.enter="selectData"
							v-model="reqData.cp_account"
							type="text"
							autocomplete="off"
							class="layui-input"
						>
					</div>
				</div>
				<div class="layui-inline">
					<label class="layui-form-label w80">昵称：</label>
					<div class="layui-input-inline">
						<input
							@keyup.enter="selectData"
							v-model="reqData.cp_nickname"
							type="text"
							autocomplete="off"
							class="layui-input"
						>
					</div>
				</div>

				<div class="layui-inline">
					<button
						@click="selectData()"
						style="padding: 0 20px; margin-left: 30px;"
						class="layui-btn layui-btn-sm layui-btn-normal"
					>查询</button>
				</div>

				<div class="connect_div">
					<table class="layui-table">
						<thead>
							<tr>
								<th>组长账号</th>
								<th>昵称</th>
								<th>点位</th>
								<th>人数</th>
								<th>可用额度</th>
								<th>限制额度</th>
								<th>状态</th>
								<th>备注</th>
								<th>创建时间</th>
								<th width="300">操作</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="item.id">
								<td class="f_bold" v-text="item.cp_account"></td>
								<td v-text="item.cp_nickname"></td>
								<td v-text="item.wx_rebate"></td>
								<td style="color: #4ab2ff;" class="f_bold" v-text="item.team_number"></td>
								<!-- <td v-text="item.ali_rebate"></td> -->
								<td class="red f_bold" v-text="item.gather_amount_limit"></td>
								<td class="red" v-text="item.gal_personal"></td>
								<td>
									<span
										:class="$d.tg['group_status_c'][item.status]"
										v-text="$d.tg['group_status'][item.status]"
									></span>
								</td>

								<td>
									<span
										v-if="item.is_alter"
										class="info_"
										@click="$m.remarkLayer('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, callback: requestList})"
									>{{ item.remark == '' ? '填写' : '查看' }}</span>

									<span v-else class="info_" @click="$m.remarkLayer('Code_provider/remark_edit', {remark: item.remark, mustArgs: {id: item.id}, disabled: true, callback: requestList})">
										查看
									</span>
								</td>
								<td v-text="item.create_time"></td>

								<td>
									<button
                                        v-if="item.status == 1"
                                        class="layui-btn layui-btn-xs disabled"
                                    >整组启用接单</button>

                                    <button
                                        v-if="item.status == 3"
                                        class="layui-btn layui-btn-xs layui-btn-open"
                                        @click="enabled(item.id, item.wx_pay_openid)"
                                    >整组启用接单</button>

                                    <button
                                        v-if="(item.status != 3 && item.status == 0)"
                                        class="layui-btn layui-btn-xs layui-btn-close"
                                        @click="stop(item.id)"
                                    >整组暂停接单</button>

                                    <button
                                        v-if="!item.oneself"
                                        class="layui-btn layui-btn-xs"
                                        @click="editAccount(item)"
                                    >编辑</button>
                                    <button v-else class="layui-btn layui-btn-xs disabled">编辑</button>

                                    <button
                                        class="layui-btn layui-btn-xs"
                                        @click="addAccount(item)"
                                    >新增下级组员</button>


									<button v-if="item.is_alter" class="layui-btn layui-btn-xs" @click="limit(item)">
										限额
									</button>
								</td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>您暂时没有开组！</p>
								</td>
							</tr>
						</tbody>
					</table>
					<div id="page" class="fr">
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="reqData.page"
							:page-sizes="$d.pageSizes"
							:page-size="reqData.pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="dataList.sum"
						></el-pagination>
					</div>
				</div>
			</div>
		</div>

		<div id="addAccountLayer" style="display: none;">
			<div class="__layer">
				<!-- <div class="item three_input mb15">
					<span class="__layer_title">组员账号：</span>
					<input class="__layer_input account" type="text" placeholder="请输入账号" autocomplete="off"/>
					<input class="__layer_input nickname" type="text" placeholder="请输入昵称" autocomplete="off"/>
					<input class="__layer_input password" type="text" placeholder="密码默认：123456" autocomplete="off"/>
					<i class="el-icon-circle-plus three_input_icon add_input"></i>
				</div>
				<div class="item mb0">
					<span class="__layer_title">点位：</span>
					<select class="__layer_input wechat_rebate"></select>
					<span class="__layer_tips">请设置点位</span>
				</div> -->
				<span class="red f_bold">当前正在操作：（{{currentSup.cp_account}}）组添加成员</span>
				<table class="layui-table layer_table">
					<thead>
						<tr>
							<th>组长账号</th>
							<th>昵称</th>
							<th>点位</th>
							<th>可用额度</th>
							<th>限制额度</th>
							<th>状态</th>
							<th>备注</th>
							<th>创建时间</th>
						</tr>
					</thead>
					<tbody v-if="currentSup">
						<tr>
							<td class="f_bold" v-text="currentSup.cp_account"></td>
							<td v-text="currentSup.cp_nickname"></td>
							<td v-text="currentSup.wx_rebate"></td>
							<!-- <td v-text="currentSup.ali_rebate"></td> -->
							<td class="red f_bold" v-text="currentSup.gather_amount_limit"></td>
							<td class="red" v-text="currentSup.gal_personal"></td>
							<td>
								<span
									:class="$d.tg['group_status_c'][currentSup.status]"
									v-text="$d.tg['group_status'][currentSup.status]"
								></span>
							</td>

							<td>
								<span
									v-if="currentSup.is_alter"
									class="info_"
									@click="$m.remarkLayer('Code_provider/remark_edit', {remark: currentSup.remark, mustArgs: {id: currentSup.id}, callback: requestList})"
								>{{ currentSup.remark == '' ? '填写' : '查看' }}</span>

								<span v-else class="info_" @click="$m.remarkLayer('Code_provider/remark_edit', {remark: currentSup.remark, mustArgs: {id: currentSup.id}, disabled: true, callback: requestList})">
									查看
								</span>
							</td>
							<td v-text="currentSup.create_time"></td>
						</tr>
					</tbody>
				</table>
				<table class="layui-table layer_table">
					<thead>
						<tr>
							<th>账号</th>
							<th>昵称</th>
							<th>密码</th>
							<th>返点</th>
							<th width="88">操作</th>
						</tr>
					</thead>
					<tbody class="addAccountTbody" v-if="dataList.list" v-show="dataList.list.length > 0">
						<tr class="addAccountTr" v-for="(item, index) in addAccountData" :key="index">
							<td>
								<input class="__layer_input" v-model="item.cp_account" type="text" placeholder="请输入账号" autocomplete="off"/>
							</td>
							<td>
								<input class="__layer_input" v-model="item.cp_nickname" type="text" placeholder="请输入昵称" autocomplete="off"/>
							</td>
							<td>
								<input class="__layer_input" v-model="item.password" type="text" placeholder="默认：123456" autocomplete="off"/>
							</td>
							<td>
								<select class="special_select" v-model="addAccountRebate">
									<option value="">请选择返点</option>
									<option :value="item.name" v-for="(item, index) in currentSupRebate" :key="index">{{ item.name }}</option>
								</select>
							</td>
							<td>
								<i class="el-icon-circle-plus three_input_icon add_input"></i>
								<i v-if="index !== 0" :data-index="index" class="el-icon-remove three_input_icon remove_input"></i>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			layForm: null,
			dataList: { list: [] },
			rebateList: [], // 返点列表

			currentSup: {},				// 选中要添加下级的上级
			currentSupRebate: [],		// 选中要添加下级的上级返点
			addAccountRebate: '',		// 添加下级的返点
			addAccountData: [			// 添加下级的数据
				{
					cp_account: '',
					cp_nickname: '',
					password: '',
				}
			],	

			reqData: {
				prompt: true,
				cp_account: "",
				cp_nickname: "",
				status: "",
				type: 2,
				page: 1,
				pageSize: 100
			}
		};
	},
	created() {
		this.requestList();
	},
	methods: {
		/**
		 * 请求商户订单列表
		 * closePrompt: 是否关闭加载页面
		 */
		requestList(closePrompt) {
			this.reqData.prompt = closePrompt ? false : true;

			this.$axios
				.post("Member/member_list", this.reqData)
				.then(data => {
					if (data.status === 'error') return;
					this.dataList = data.dataList;
				});
		},

		selectData() {
			this.reqData.page = 1;
			this.requestList();
		},

		/**
         * 新增我的组长
         */
        addMyGroup() {
            const _userInfo = this.$store.getters.userInfo;
            const wxRebateArr = this.$m.getRebate(_userInfo.wx_rebate);

            layer.open({
                type: 1,
                area: ["500px", "310px"],
                id: "addAccount",
                btn: ["添加"],
                title: "添加账号",
                content: `
                    <div class="__layer addAccount">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<input class="__layer_input code_account" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入账号</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<input class="__layer_input cp_nickname" type="text" autocomplete="off"/>
							<span class="__layer_tips">长度为5个汉字或10个字符</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">密码：</span>
							<input class="__layer_input code_password" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入密码</span>
						</div>

						<div class="item mb0">
							<span class="__layer_title">点位：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请设置点位</span>
						</div>
					</div>
				`,
                success: () => {
                    // 渲染返点比例
                    const renderRebates = () => {
                        const wxHtml = wxRebateArr.map(
                            item =>
                                `<option value="${item.value}">${
                                    item.name
                                }</option>`
                        );
                        $(".addAccount .wechat_rebate").html(wxHtml.join(""));
                    };
                    renderRebates();
                },
                yes: layIndex => {
                    const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

                    // TODO 限制昵称字符长度

                    const code_account = $(".addAccount .code_account").val(),
                        cp_nickname = $(".addAccount .cp_nickname").val(),
                        nickNameLength = this.$m.gblen(cp_nickname),
                        code_password = $(".addAccount .code_password").val(),
                        wechat_rebate = $(".addAccount .wechat_rebate").val(),
                        account_type = '2';

                    if (code_account === "") return this.$m.hint_layer("请输入账号", 2);
                    if (cp_nickname === "") return this.$m.hint_layer("请输入昵称", 2);
                    if (nickNameLength > 10) return this.$m.hint_layer("昵称长度为5个汉字或10个字符", 2);
                    if (code_password === "") return this.$m.hint_layer("请输入密码", 2);
                    if (!PASSREG.test(code_password)) return this.$m.hint_layer("密码由6-15位数字或字母组成", 2);

                    this.$axios
                        .post("Member/member_add", {
                            cp_account_type: account_type,
                            sup_account: _userInfo.cp_account,
                            cp_account: code_account,
                            cp_nickname,
                            cp_password: code_password,
                            wx_rebate: wechat_rebate
                        })
                        .then(data => {
                            if (data.status === "OK") {
                                setTimeout(() => {
                                    layer.close(layIndex);
                                    this.requestList();
                                }, 1500);
                            }
                        });
                }
            });
        },


		/**
		 * 添加账号
		 */
		addAccount(dataObj) {
			this.currentSup = dataObj;
			this.currentSupRebate = this.$m.getRebate(dataObj.wx_rebate);

			layer.open({
				type: 1,
				area: ["930px", "685px"],
				id: "addAccount",
				isOutAnim: false,
				shade: false,
				btn: ['添加', '取消'],
				title: "添加账号",
				content: $('#addAccountLayer'),
				success: () => {
					/**
					 * 添加账号框
					 */
					$('#addAccount').on('click', '.add_input', (e) => {
						if (this.addAccountData.length >= 10) {
							return layer.msg('最多一次性添加10个账号', {icon: 2, time: 1500});
						}
						this.addAccountData.push({	
							account: '',
							nickname: '',
							password: '',
						})
						
					})

					/**
					 * 删除账号框
					 */
					$('#addAccount').on('click', '.remove_input', (e) => {
						const INDEX = $(e.currentTarget).data('index');
						this.addAccountData.splice(INDEX, 1);
					})

				},
				yes: layIndex => {

					for (let item of this.addAccountData) {
						if (item.cp_account === '') return this.$m.hint_layer('账号不能为空', 2);
						if (item.cp_nickname === '') return this.$m.hint_layer('昵称不能为空', 2);
						if (this.addAccountRebate === '') return this.$m.hint_layer('请选择返点', 2);
						if (item.password === '') item.password = '123456';

						item.wx_rebate = this.addAccountRebate;
						item.sup_account = dataObj.cp_account;
					}

					const accountData = this.addAccountData

					let request = ({loadLayerId, loadFinish, loadNext, changeTips, loadError}) => {

						let add = (item) => {
							return new Promise(async(resolve, reject) => {

								this.$axios.post("Member/subordinate_add", item).then(res => {

									if (res.status == 'error') {
										loadError(loadLayerId);
										throw new Error('上传失败');
									};
									
									if(res.status === 'OK') {
										loadNext();
										changeTips(`已添加<span class="red f_bold">{{currentIndex}}</span>个账号，请稍后...`);
										resolve();
									}
								});
							})
						}

						(async () => {
							for(const item of accountData) {
								await add(item);
							}

							this.$m.hint_layer('添加成功', 1);

							setTimeout(() => {
								layer.close(loadLayerId);
								layer.close(layIndex);
								this.requestList();
							}, 1500)
						})();
					}

					this.$m.progressLayer({
						title: '添加账号',
						tips: '正在添加中，请稍后...',
						uploadNum: accountData.length,
						success: request,
					})

				},
				end: () => {
					this.addAccountRebate = '';
					this.addAccountData = [
						{
							account: '',
							nickname: '',
							password: '',
						}
					];

					$('#addAccountLayer').hide();
				}
			});
		},

		

		/**
		 * 编辑账号
		 */
		editAccount(dataObj) {
			const getTopRebate = this.$m.getTopRebate(dataObj.cp_account);

			layer.open({
				type: 1,
				area: ["510px", "310px"],
				btn: ["确定"],
				title: "编辑账号",
				content: `
					<div class="__layer editAccount">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<span class="__layer_content">${dataObj.cp_account}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<input class="__layer_input nickname" value="${
								dataObj.cp_nickname
							}" type="text" autocomplete="off"/>
							<span class="__layer_tips">长度为10个汉字或20个字符</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">密码：</span>
							<input class="__layer_input code_password" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入密码</span>
						</div>
						<div class="item mb0">
							<span class="__layer_title">点位：</span>
							<select class="__layer_input wechat_rebate"></select>
							<span class="__layer_tips">请设置点位</span>
						</div>
					</div>
				`,
				success: async () => {
					const rebateList = await getTopRebate;
					const wxRebate = Number.parseFloat(dataObj.wx_rebate);

					// 渲染返点比例
					const wechat_rebateArr = rebateList.wx.map(
						item =>
							`<option value="${item.value}" ${
								item.value / 10 == wxRebate
									? "selected"
									: ""
							}>${item.name}</option>`
					);
					$(".editAccount .wechat_rebate").html(
						wechat_rebateArr.join("")
					);
				},
				yes: layIndex => {
					const PASSREG = /^[a-zA-Z0-9]{6,15}$/;

					let cp_nickname = $(".editAccount .nickname").val(),
						nickNameLength = this.$m.gblen(cp_nickname),
						code_password = $(".editAccount .code_password").val(),
						wechat_rebate = $(".editAccount .wechat_rebate").val();

					if (cp_nickname === "") return this.$m.hint_layer("请输入昵称", 2);
					if (nickNameLength > 10) return this.$m.hint_layer("昵称长度为10个汉字或20个字符", 2);
					if (code_password !== '' && !PASSREG.test(code_password)) return this.$m.hint_layer("密码由6-15位数字或字母组成", 2);

					let reqObj = {
						cp_nickname,
						cp_password: code_password,
						wx_rebate: wechat_rebate,
						id: dataObj.id,
					};

					this.$axios
						.post("Code_provider/code_provider_edit", reqObj)
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			});
		},

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
						if (data.status === 'OK') {
							setTimeout(() => {
								layer.close(layIndex);
								this.requestList();
							}, 1500)
						}
					})
				}
			})
		},


		/**
		 * 启用账号
		 */
		enabled(id, clerk) {
			layer.confirm(
				"是否要启用选中的组长账号？",
				{ title: "启用", icon: 7 },
				layIndex => {
					this.$axios
						.post("Code_provider/status_edit", {
							id,
							status: 0
						})
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			);
		},

		/**
		 * 暂停收款
		 */
		stop(id) {
			layer.confirm(
				"是否要暂停选中的组长账号？",
				{ title: "暂停收款", icon: 7 },
				layIndex => {
					this.$axios
						.post("Code_provider/status_edit", {
							id,
							status: 3
						})
						.then(data => {
							if (data.status === "OK") {
								setTimeout(() => {
									layer.close(layIndex);
									this.requestList();
								}, 1500);
							}
						});
				}
			);
		},

		/**
		 * 页容量变化
		 */
		handleSizeChange(val) {
			this.reqData.pageSize = val;
			this.reqData.page = 1;
			this.requestList();
		},

		/**
		 * 页码变化
		 */
		handleCurrentChange(val) {
			this.reqData.page = val;
			this.requestList();
		}
	}
};
</script>