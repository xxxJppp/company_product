<template>
    <div>
        <div class="content_item">
            <div class="item_title">
                <span>修改登录密码</span>
            </div>
            <div class="layui-form update_panel" style="padding: 15px 15px 40px;">
                <div style="margin: 50px 0">
					<div class="layui-form-item">
	                    <label class="layui-form-label">当前密码：</label>
	                    <div class="layui-input-inline">
	                        <input
								v-model="old_password"
	                            type="password"
	                            required
	                            lay-verify="required"
	                            placeholder="请输入当前密码"
	                            autocomplete="off"
	                            class="layui-input"
	                        >
	                    </div>
	                </div>
					<div class="layui-form-item">
	                    <label class="layui-form-label">新密码：</label>
	                    <div class="layui-input-inline">
	                        <input
								v-model="password"
	                            type="password"
	                            required
	                            lay-verify="required"
	                            placeholder="请输入要改的新密码"
	                            autocomplete="off"
	                            class="layui-input"
	                        >
	                    </div>
	                </div>
					<div class="layui-form-item">
	                    <label class="layui-form-label">确认新密码：</label>
	                    <div class="layui-input-inline">
	                        <input
								v-model="again_password"
	                            type="password"
	                            required
	                            lay-verify="required"
	                            placeholder="请重新输入新密码"
	                            autocomplete="off"
	                            class="layui-input"
	                        >
	                    </div>
	                </div>

					<button @click="updatePass()" style="margin-left: 135px; margin-top: 10px;" class="layui-btn layui-btn-normal" lay-submit>立即修改</button>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
			password: '',
			again_password: '',
			old_password: '',
			passReg: /^[a-zA-Z0-9]{6,15}$/,
		};
    },
    methods: {
		/**
		 * 更改密码
		 */
		updatePass() {
			if (!this.passReg.test(this.password)) {
				return this.$m.hint_layer('密码由6-15位数字或字母组成', 2);
			}
			if (this.password !== this.again_password) {
				return this.$m.hint_layer('新密码输入不一致，请重新输入', 2);
			}
			
			this.$axios.post('Code_Provider/password_edit', {
				password: this.password,
				old_password: this.old_password
			}).then(data => {
				if(data.status === 'OK') {
					this.password = '';
					this.again_password = ''
					this.old_password = '';
				}
			})
		},
    }
};
</script>