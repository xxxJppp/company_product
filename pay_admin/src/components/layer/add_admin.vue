<template>
	<div class="eduit_container">
		<div class="ele_form" style="width: 400px;">
			<el-form ref="form" :model="form" label-width="140px">
				<el-form-item label="用户账号：" required>
					<el-input v-model.trim="form.account"></el-input>
				</el-form-item>
				<el-form-item label="用户昵称：" required>
					<el-input v-model.trim="form.nickName"></el-input>
				</el-form-item>
				<el-form-item label="用户登录密码：" required>
					<el-input v-model.trim="form.password"></el-input>
					<span class="sub_msg" style="position: absolute; top: 34px; left: 0; color: red;">密码长度为6-14位</span>
				</el-form-item>
				<!-- 用户组 -->
				<el-form-item label="用户组：" required>
					<el-select v-model="form.groupId">
						<el-option v-for="(item, index) in group" :key="index" :label="item.group_name" :value="item.group_id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>

		<div class="btns-container">
			<el-button type="primary" @click="submit_data">确认</el-button>
		</div>
	</div>
</template>


<style scoped>
	.eduit_container {
		padding: 20px;
	}

	.ele_form {
		width: 500px;
	}

	.components-container {
		padding-left: 80px;
	}
	.btns-container {
		margin-left: 80px;
		margin-top: 15px;
	}

	.input_ele {
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
		transition: border-color .2s cubic-bezier(.645,.045,.355,1);
		width: 100%;
	}
</style>

<script>
	export default {
		data() {
			return {
				group: [],
				form: {
					account: '',		// 用户账号
					nickName: '',		// 用户昵称
					password: '',		// 用户密码
					groupId: '',		// 分组id
					status: 1			// 用户状态
				}
			}
		},
		created() {
			this.req_data();
		},
		methods: {
			// 请求数据
			req_data() {
				this.group = parent.window.admin_group;
			},
			// 提交数据
			submit_data() {
				if(!this.form.account || !this.form.nickName || !this.form.password || !this.form.groupId || !this.form.status) {
					layer.msg('请将资料完善', {
						icon: '2'
					})
				} else {
					if(`${this.form.password}`.length < 6 || `${this.form.password}`.length > 14) {
						layer.msg('密码长度有误,请重新输入', {icon: 2, time: 1000});
						return;
					}

					this.$axios.post('Admin/add_admin', this.form).then((res) => {
						parent.window.can_close_iframe();
					})
				}
			}
		}
	}
</script>