<template>
	<div class="allot_container" style="padding: 20px;">
		<div style="margin-bottom: 10px;">
			<el-button size="small" type="success" @click="add_user">添加成员</el-button>
		</div>
		<div>
			<table class="common_table" style="width: 100%">
				<thead>
					<tr>
						<!-- <th>
							<input id="a_checked_all" type="checkbox"/>
						</th> -->
						<th>账号</th>
						<th>状态</th>
					</tr>
				</thead>
				<tbody v-if="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="index">
						<!-- <td><input class="a_checked_one" type="checkbox"/></td> -->
						<td>{{ item.account }}</td>
						<td :class="$cm_d.tg['admin_type_c'][item.status]">{{ $cm_d.tg['admin_type'][item.status] }}</td>
					</tr>
				</tbody>
				<tbody v-if="dataList.list.length <= 0">
					<tr>
						<td colspan="2">该分组暂时没有后台管理员</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>
</template>


<style scoped>
	.allot_container {
		
	}
</style>

<script>
	export default {
		data() {
			return {
				groupId: '',
				dataList: [],
			}
		},
		created() {
			this.req_data();
		},
		methods: {
			// 请求数据
			req_data() {
				this.groupId = parent.window.$allot_data;
				this.$axios.post('Admin/getAdminByGroupId', {groupId: this.groupId}).then(res => {
					console.log(res)
					this.dataList = res;
				})
			},

			// 添加成员
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
							$(res.list).each((index, item) => {
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

						self.$axios.post('Admin/edit_admin_fz', {
							type: 2,
							groupId: self.groupId,
							adminId: arrData.join(',')
						}).then(res => {
							self.req_data();
						})
					}
				})
			},
			
			// 提交数据
			// submit_data() {
			// 	layer.msg('请将资料完善', {
			// 		icon: '2'
			// 	})
			// 	parent.window.is_set_allot = true;
			// }
		}
	}
</script>