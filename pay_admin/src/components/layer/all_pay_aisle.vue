<template>
	<div class="allot_container" style="padding: 20px;">
		<!-- <div style="margin-bottom: 10px;">
			<el-button size="small" type="success" @click="add_user">添加成员</el-button>
		</div> -->
		<div>
			<table class="common_table" style="width: 100%">
				<thead>
					<tr>
						<th>产品描述</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.product_desc }}</td>
						<td>
							<span class="open_btn cp" @click="on_off(item.product_code, 0)"><i class="el-icon-check"></i>启用</span>
							<span class="close_btn cp ml5" @click="on_off(item.product_code, 1)"><i class="el-icon-close"></i>禁用</span>
						</td>
					</tr>
				</tbody>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length <= 0">
					<tr>
						<td colspan="99">暂无通道列表</td>
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
				this.mch_id = parent.window.__all_mch_id;
				this.$axios.post('Merchant/aisle_list', {
					mch_id: this.mch_id,
					prompt: true
				}).then(res => {
					this.dataList = res;
				})
			},

			/**
			 * 开关
			 */
			on_off(product_code, status) {
				const textObj = {
					1: '禁用',
					0: '启用'
				}

				layer.confirm(`是否要${textObj[status]}该支付通道`, {
					title: '编辑',
					icon: 7
				}, index => {
					this.$axios.post('Merchant/aisle_list_edit', {
						status,
						product_code: product_code,
						mch_id: this.mch_id,
					}).then(data => {

					})
				})
				
			}
		}
	}
</script>