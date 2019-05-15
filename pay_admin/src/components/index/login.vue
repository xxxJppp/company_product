<template>
    <div>
        <div id="login" class="container">
            <div class="login_container">
                <div class="message">后台登录</div>
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
    mounted() {
        this.getCode();
    },
    methods: {
        // 获取验证码
        getCode() {
            let self = this;

            const get_token = new Promise((res, rej) => {
                $.ajax({
                    url: `${window.location_url}/Login/getToken`,
                    type: "get",
                    success(data) {
                        self.form.token = data.token;
                        res(data.token);
                    }
                });
            });

            get_token.then(token => {
                $(".code")
                    .attr(
                        "src",
                        window.location_url +
                            `/Login/verify?token=${token}&time=${+new Date()}`
                    )
                    .css({
                        width: 140,
                        height: 50
                    });
            });
        },
        // 登录
        loginIn() {
            let self = this;
            const userInfo = new Promise((resolve, reject) => {
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
                            $.cookie("pay_token", data.token, {
                                path: "/"
                            });
                            resolve(true);
                        } else {
                            self.form.entry = "";
                            self.getCode();
                            layer.msg(data.errorMsg, {
                                icon: "2",
                                time: 1000
                            });
                            resolve(false);
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
            });

            const chatInfo = new Promise((resolve, reject) => {
                if (this.$store.getters.openChat) {
                    //聊天用户登录
                    $.ajax({
                        url: `${window.location_url}Login/chat_pwd`,
                        data: this.form,
                        processData: true,
                        contentType: "application/x-www-form-urlencoded",
                        dataType: "json",
                        type: "post",
                        cache: false,
                        success: data => {
                            if (data.status === "OK") {
                                if (!(data.dataList instanceof Array)) {
                                    $.cookie("chat-user", data.dataList.username, {
                                        path: "/"
                                    });
                                    $.cookie("chat-pwd", data.dataList.pwd, {
                                        path: "/"
                                    });
                                }
                            } else {
                                layer.msg(data.errorMsg, {
                                    icon: "2",
                                    time: 1000
                                });
                            }
                            resolve(data);
                        },
                        error: data => {
                            reject(data);
                        }
                    });
                } else {
                    resolve();
                }
            }); 

            Promise.all([userInfo,chatInfo])
                .then(data => {
                    if (data[0] === true) {
                        if (this.$store.getters.openChat) {
                            $.cookie("userId", data[1].dataList.username, {
                                path: "/"
                            });
                            $.cookie("userName", data[1].dataList.username, {
                                path: "/"
                            });
                            localStorage.removeItem("layim");
                        }
                        layer.msg('登录成功', {icon: 1, time: 1500});
                        this.$router.push("/admin/index");
                    }
                })
                .catch(data => {
                    new Error("登录失败！");
                });
        }
    }
};
</script>
