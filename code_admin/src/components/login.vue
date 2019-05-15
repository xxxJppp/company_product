<template>
    <div>
        <div id="login" class="container">
            <div class="login_container">
                <div class="message">商务登录</div>
                <div id="darkbannerwrap"></div>
                <div class="layui-form">
                    <input
                        style="margin-top: 30px;"
                        v-model="form.username"
                        placeholder="用户名"
                        type="text"
                        class="layui-input"
                    >
                    <input
                        style="margin-top: 15px;"
                        v-model="form.password"
                        placeholder="密码"
                        type="password"
                        class="layui-input"
                    >
                    <div class="code_c">
                        <input
                            style="margin-top: 15px;"
                            @keydown.enter="loginIn"
                            v-model="form.entry"
                            placeholder="验证码"
                            type="text"
                            class="layui-input"
                        >
                        <img class="code cp" alt @click="getCode">
                    </div>
                    <el-button type="primary" @click="loginIn">登录</el-button>
                    <!-- <el-button @click="resetForm('form')">重置</el-button> -->
                </div>
                <!-- <el-form :model="form" status-icon label-width="60px" class="demo-ruleForm">
					<el-form-item>
						<el-input type="username" v-model="form.username" auto-complete="off"></el-input>
					</el-form-item>	
					<el-form-item>
						<el-input type="password" v-model="form.password" auto-complete="off"></el-input>
					</el-form-item>
					<div class="fl clearfix" style="position: relative; width: 200px; z-index: 9;">
						<el-form-item>
							<el-input type="username" @keydown.enter.native="loginIn" v-model="form.entry" auto-complete="off"></el-input>
						</el-form-item>
					</div>
					<div class="fr clearfix" style="position: relative; height: 67px; width: 90px; z-index: 9;">
						<img class="code cp" alt="" @click="getCode">
					</div>
					
					<el-form-item>
						<el-button type="primary" @click="loginIn">登录</el-button>
						<el-button @click="resetForm('form')">重置</el-button>
					</el-form-item>
                </el-form>-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: "",
                password: "",
                entry: "",
                token: ""
            }
        };
    },
    created() {
        this.getCode();
    },
    methods: {
        // 获取验证码
        getCode() {
            const get_token = new Promise((res, rej) => {
                $.ajax({
                    url: `${window.location_url}/Login/getToken`,
                    type: "get",
                    success: data => {
                        this.form.LoginToken = data.token;
                        res(data.token);
                    }
                });
            });

            get_token.then(token => {
                $(".code")
                    .attr(
                        "src",
                        window.location_url +
                            `/Login/verify?LoginToken=${token}&time=${+new Date()}`
                    )
                    .css({
                        width: 140,
                        height: 50
                    });
            });
        },

        // 登录
        loginIn() {
            //用户登录
            $.ajax({
                url: `${window.location_url}Login/login`,
                data: this.form,
                processData: true,
                contentType: "application/x-www-form-urlencoded",
                dataType: "json",
                type: "post",
                cache: false,
                success: data => {
                    if (
                        data.status === "OK" &&
                        data.successMsg === "登录成功"
                    ) {
                        try {
                            localStorage.removeItem('hhyangHistory');
                        } catch (error) {
                            
                        }
                        $.cookie("code_token", data.token, {
                            path: "/"
                        });
                        $.cookie("code_name", this.form.username, {
                            path: "/"
                        });
                        $.cookie("userName", data.username, {
							path: "/"
						});
                       $.cookie('chat_pwd', data.chat_password, {
							path: '/',
						});
						$.cookie('avatar', data.avatar, {
							path: '/',
						});
						$.cookie('userId', data.me, {
							path: '/',
						});
                        layer.msg("登录成功", { icon: 1, time: 1500 });
                        this.$router.push("/admin/index");
                    } else {
                        this.form.entry = "";
                        this.getCode();
                        layer.msg(data.errorMsg, {
                            icon: "2",
                            time: 1500
                        });
                    }
                },
                error: data => {
                    reject(data);
                },
                complete: (XMLHttpRequest, status) => {
                    if (status === "timeout") {
                        alert("连接超时，请联系管理员或检查网络设置！");
                        reject(data);
                    }
                }
            });
        },

        /**
         * 注册
         */
        register() {
            layer.open({
                type: 1,
                area: ["500px", "420px"],
                btn: ["确认"],
                title: "注册",
                content: `
					<div class="__layer register_view">
						<div class="item mb15">
							<span class="__layer_title">账号：</span>
							<input class="__layer_input account" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入账号</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<input class="__layer_input nickname" type="text" autocomplete="off"/>
							<span class="__layer_tips">请输入昵称或别名</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">密码：</span>
							<input class="__layer_input password" type="password" autocomplete="off"/>
							<span class="__layer_tips">请输入密码</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">确认密码：</span>
							<input class="__layer_input again_password" type="password" autocomplete="off"/>
							<span class="__layer_tips">请重新输入密码</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">QQ：</span>
							<input class="__layer_input qq" type="number" autocomplete="off"/>
							<span class="__layer_tips">请输入QQ号码(<i class="red">可为空</i>)</span>
						</div>
						<div class="item">
							<span class="__layer_title">手机号码：</span>
							<input class="__layer_input tel" type="number" autocomplete="off"/>
							<span class="__layer_tips">请输入手机号码(<i class="red">可为空</i>)</span>
						</div>
					</div>
				`,
                success: () => {},
                yes: layIndex => {
                    let passReg = /^[a-zA-Z0-9]{6,15}$/;

                    let account = $(".register_view .account").val(),
                        nickname = $(".register_view .nickname").val(),
                        password = $(".register_view .password").val(),
                        again_password = $(
                            ".register_view .again_password"
                        ).val(),
                        qq = $(".register_view .qq").val(),
                        tel = $(".register_view .tel").val();

                    if (account === "") {
                        return this.$m.hint_layer("请输入账号", 2);
                    }
                    if (nickname === "") {
                        return this.$m.hint_layer("请输入昵称或别名", 2);
                    }
                    if (password === "") {
                        return this.$m.hint_layer("请输入密码", 2);
                    }
                    if (again_password === "") {
                        return this.$m.hint_layer("请重新输入密码", 2);
                    }

                    if (!passReg.test(password)) {
                        return this.$m.hint_layer(
                            "密码由6-15位数字或字母组成",
                            2
                        );
                    }

                    if (password !== again_password) {
                        return this.$m.hint_layer(
                            "两次输入的密码不一致，请重新输入",
                            2
                        );
                    }

                    this.$axios
                        .post("login/register", {
                            username: account,
                            nickname,
                            password,
                            qq,
                            phone: tel
                        })
                        .then(data => {
                            if (data.status === "OK") {
                                setTimeout(() => {
                                    layer.close(layIndex);
                                }, 1500);
                            }
                        });
                }
            });
        }
    }
};
</script>