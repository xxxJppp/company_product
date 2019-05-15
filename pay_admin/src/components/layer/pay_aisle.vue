<template>
	<div class="allot_container" style="padding: 20px;">
		<!-- <div style="margin-bottom: 10px;">
			<el-button size="small" type="success" @click="add_user">添加成员</el-button>
		</div> -->
		<div>
			<table class="common_table" style="width: 100%">
				<thead>
					<tr>
						<th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th>
						
						<th>商户账号</th>
						<th>支付类型</th>
						<th>手续费比率</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="index">
						<td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td>

						<td>{{ item.mch_account }}</td>
						<td>{{ item.product_desc }}</td>
						<td>{{ item.fee }}</td>
						<td :class="$cm_d.tg['aisle_status_color'][item.status]">{{ $cm_d.tg['aisle_status'][item.status] }}</td>
						<td>
							<span class="editor_btn cp" style="margin-right: 5px;" @click="edit(item)"><i class="el-icon-edit-outline"></i>编辑</span>
							<span v-if="item.status != 0" class="open_btn cp" @click="on_off(item.id, 0)"><i class="el-icon-check"></i>启用</span>
							<span v-if="item.status == 0" class="close_btn cp" @click="on_off(item.id, 1)"><i class="el-icon-close"></i>禁用</span>
						</td>
					</tr>
				</tbody>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length <= 0">
					<tr>
						<td colspan="99">该用户暂时没有支付管理通道</td>
					</tr>
				</tbody>
			</table>
			<div class="am-btn-group am-btn-group-xs">
				<button type="button" class="am-btn am-btn-default" @click="checked_all">
					<span class="am-icon-plus"></span> 全选</button>
				<button type="button" class="am-btn am-btn-default open_btn" @click="on_off(checked_data, 0)">
					<span class="el-icon-check"></span> 启用</button>
				<button type="button" class="am-btn am-btn-default close_btn" @click="on_off(checked_data, 1)">
					<span class="el-icon-close"></span> 禁用</button>
			</div>

		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据

				mch_id: '',
				dataList: {},
			}
		},
		created() {
			this.request_data();
		},
		methods: {
			// 请求数据
			request_data() {
				this.mch_id = parent.window.__mch_id;
				this.$axios.post('Merchant/aisle', {
					mch_id: this.mch_id,
					prompt: true
				}).then(res => {
					this.dataList = res;
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

			/**
			 * 编辑
			 */
			edit(dataObj) {
				layer.open({
					type: 1,
					area: ['360px', '220px'],
					btn: ['确认'],
					title: '编辑商户',
					content: `
						<div class="__layer edit_aisle">
							<div class="item mb15">
								<span class="__layer_title">手续费比率：</span>
								<input class="__layer_input fee" style="width: 100px;" value="${ ((100 * 100) - (100 * parseFloat(dataObj.fee))) / 100}" type="number" autocomplete="off"/> %
							</div>
							<div class="item mb0">
								<span class="__layer_title">状态：</span>
								<input type="radio" id="radio_status_1" class="__layer_radio" name="aisle_status" value="0" ${dataObj.status == '0' ? 'checked' : ''}> 
								<label style="margin-right: 20px;" for="radio_status_1">正常</label>
								<input type="radio" id="radio_status_2" class="__layer_radio" name="aisle_status" value="1" ${dataObj.status == '1' ? 'checked' : ''}> 
								<label for="radio_status_2">禁用</label>
							</div>
						</div>
					`,
					yes: (lay_index) => {
						let fee = $('.edit_aisle .fee').val(),
							status = $('.edit_aisle [name="aisle_status"]:checked').val();

						if (fee === '') { return layer.msg('手续费比率不能为空', {time: 1500, icon: 2}) };


						this.$axios.post('Merchant/aisle_edit', {
							fee,
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
			 * 开关
			 */
			on_off(id, status) {
				const textObj = {
					1: '禁用',
					0: '启用'
				}

				layer.confirm(`是否要${textObj[status]}该支付通道`, {
					title: '编辑',
					icon: 7
				}, index => {
					this.$axios.post('Merchant/aisle_edit_status', {
						status,
						id: id,
						mch_id: this.mch_id,
					}).then(data => {

						if(!data) {
							this.checked_data = [];
							this.is_select_all = false;
							setTimeout(() => {
								this.request_data();
							}, 1500)
						}
					})
				})
				
			}
		}
	}
</script>