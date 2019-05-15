<template>
	<div class="allot_container" style="padding: 20px;">
		<!-- <div style="margin-bottom: 10px;">
			<el-button size="small" type="success" @click="add_user">添加成员</el-button>
		</div> -->
		<div>
			<table class="common_table" style="width: 100%">
				<thead>
					<tr>
						<th>持卡人姓名</th>
						<th>银行名称</th>
						<th>银行卡号</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody v-if="dataList.length > 0">
					<tr v-for="(item, index) in dataList" :key="index">
						<!-- <td><input class="a_checked_one" type="checkbox"/></td> -->
						<td>{{ item.bank_card_person }}</td>
						<td>{{ item.bank_name }}</td>
						<td>{{ item.bank_card_number }}</td>
						<td :class="$cm_d.tg['close_status_color'][item.status]">{{ $cm_d.tg['close_status'][item.status] }}</td>
						<td>
							<span class="editor_btn cp ml5" @click="edit(item)"><i class="el-icon-edit-outline"></i>编辑</span>
							<span class="remove_btn cp ml5" @click="remove(item.id)"><i class="el-icon-delete"></i>删除</span>
						</td>
					</tr>
				</tbody>
				<tbody v-if="dataList.length <= 0">
					<tr>
						<td colspan="99">该用户暂时没有结算账号</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				mch_account: '',
				dataList: [],
			}
		},
		created() {
			this.req_data();
		},
		methods: {
			// 请求数据
			req_data() {
				this.mch_account = parent.window.__mch_account;
				this.$axios.post('Merchant/pay_account', {
					mch_account: this.mch_account,
					prompt: true
				}).then(res => {
					console.log(res);
					this.dataList = res.list;
				})
			},

			/* // 添加成员
			add_user() {
				let self = this;
				layer.open({
					title: '分配',
					area: ['580px', '380px'],
					content: `
						<div id="allot_container">
							<table class="common_table" style="width: 100%">
								<thead>
									<tr>
										<th>
											<input id="a_checked_all" type="checkbox"/>
										</th>
										<th>账号</th>
										<th>状态</th>
										<th>用户组</th>
									</tr>
								</thead>
								<tbody id="allot_tbody"></tbody>
							</table>
						</div>
					`,
					success() {
						// 获取列表
						self.$axios.post('Admin/admin_info', {notInGroupId: self.groupId}).then((res) => {
							this.htmlData = '';
							$(res).each((index, item) => {
								this.htmlData += `
									<tr>
										<td>
											<input class="a_checked_one" value="${item.admin_id}" type="checkbox"/>
										</td>
										<td>${item.account}</td>
										<td class="${self.$cm_d.tg['admin_type_c'][item.status]}">${ self.$cm_d.tg['admin_type'][item.status] }</td>
										<td>${item.group_name}</td>
									</tr>
									`
							})
							$('#allot_tbody').html(this.htmlData)
						})

						// 全选功能
						$('#a_checked_all').on('click', function() {
							console.log(1111)
							$('.a_checked_one').prop('checked', $(this).prop('checked'))
						})
						$('#allot_container').on('click', '.a_checked_one', function() {
							$('#a_checked_all').prop('checked', $('.a_checked_one').length === $('.a_checked_one:checked').length)
						})
					}
					,btn1() {
						if ($('.a_checked_one:checked').length <= 0) {
							layer.msg('请选择分配的账号', { icon: 2, time: 1000})
							return;
						}
						let arrData = [];
						$('.a_checked_one:checked').each((index, item) => {
							arrData.push($(item).val())
						})

						self.$axios.post('Admin/edit_admin', {
							type: 2,
							groupId: self.groupId,
							adminId: arrData.join(',')
						}).then(res => {
							self.req_data();
						})
					}
				})
			}, */

			/**
			 * 编辑成员
			 */
			edit(dataObj) {
				layer.open({
					type: 1,
					area: ['500px', '315px'],
					btn: ['确定'],
					title: '编辑账号',
					content: `
						<div class="__layer edit_account">
							<div class="item mb15">
								<span class="__layer_title">持卡人姓名：</span>
								<input class="__layer_input real_name" value="${dataObj.bank_card_person}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入持卡人姓名</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">银行名称：</span>
								<input class="__layer_input bank_name" value="${dataObj.bank_name}" type="text" autocomplete="off"/>
								<span class="__layer_tips">请输入银行名称</span>
							</div>
							<div class="item mb15">
								<span class="__layer_title">银行卡号：</span>
								<input class="__layer_input bank_num" value="${dataObj.bank_card_number}" type="number" style="width: 200px" autocomplete="off"/>
								<span class="__layer_tips">请输入银行卡号</span>
							</div>
							<div class="item mb0">
								<span class="__layer_title">状态：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="card_status" value="0" ${dataObj.status == '0' ? 'checked' : ''}> 
								<label style="margin-right: 20px;" for="radio_status_1">正常</label>

								<input type="radio" id="radio_status_2" class="__layer_radio" name="card_status" value="1" ${dataObj.status == '1' ? 'checked' : ''}> 
								<label for="radio_status_2">禁用</label>
							</div>
						</div>
					`,
					success: () => {
						
					},
					yes: (layIndex) => {
						const NUMREG = /^[a-zA-Z0-9]{15,24}$/;
						
						let real_name = $('.edit_account .real_name').val(),
							bank_name = $('.edit_account .bank_name').val(),
							bank_num = $('.edit_account .bank_num').val(),
							status = $('.edit_account [name="card_status"]:checked').val();

						
						if (real_name === '') { return this.$cm_m.hint_layer('请输入持卡人姓名', 2) };
						if (bank_name === '') { return this.$cm_m.hint_layer('请输入银行名称', 2) };
						if (bank_num === '') { return this.$cm_m.hint_layer('请输入银行卡号', 2) };
						
						if (!NUMREG.test(bank_num)) { 
							return this.$m.hint_layer('银行卡号格式有误，请重新输入', 2);
						}

						this.$axios.post('Merchant/pay_account_edit', {
							bank_card_person: real_name,
							bank_name,
							bank_card_number: bank_num,
							status,
							id: dataObj.id
						}).then(data => {
							console.log(data);
							if(!data) {
								setTimeout(() => {
									layer.close(layIndex);
									[
										dataObj.bank_card_person,
										dataObj.bank_name,
										dataObj.bank_card_number,
										dataObj.status
									] = [
										real_name,
										bank_name,
										bank_num,
										status
									]
								}, 1500)
							}
						})
					}
				})
			},
			
			/**
			 * 删除结算账号
			 */
			remove(id) {
				layer.confirm('是否要删除此结算账号？', {icon: 7, title:'删除结算账号'}, (index) => {
					this.$axios.post('Merchant/bank_del', { id }).then((res) => {
						if (!res) {
							setTimeout(() => {
								layer.close(index)
								this.req_data()
							}, 1500)
						}
					})
				})
			},
		}
	}
</script>