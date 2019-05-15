<template>
	<div id="layout">
		<div class="hhyang_Mask" id="p_myIframe">
			<div id="myIframe">
				<iframe
					id="chatIframe"
					width="850px"
					height="618px"
					frameborder="0"
					scrolling="no"
					src="../static/newChat/chat.html"
				></iframe>
			</div>
		</div>
		<div id="notification"></div>


		<div class="layui-layout-body">
			<div class="clearfix layui-layout layui-layout-admin">
				<div class="layui-header">
					<div class="layui-logo">
						<img style="width: 130px;" src="../assets/images/icon/title.png" alt>
					</div>
					<!-- 头部区域（可配合layui已有的水平导航） -->
					<ul class="layui-nav layui-layout-right">
						<li class="layui-nav-item" style="margin: 0 15px;">
                            <span>欢迎您：{{ $store.getters.userInfo.cp_account }}</span>
                        </li>

						<li class="layui-nav-item" style="margin: 0 15px;">
                            <span>
								<i class="iconfont icon-huabanfuben" style="vertical-align: top;"></i>
								团队总人数：{{ $store.getters.userInfo.team_number }} 人
							</span>
                        </li>

						<li class="layui-nav-item" style="margin: 0 15px;">
                            <span>
								<i class="layui-icon layui-icon-rmb"></i>
								团队可用额度：{{ $store.getters.userInfo.gather_amount_limit }} 元
							</span>
                        </li>

						<li v-if="showChat" class="layui-nav-item" style="margin: 0 15px;">
                            <el-button type="primary" size="mini"  class="showChat">联系客服</el-button>
                        </li>

						<li class="layui-nav-item" style="margin: 0 15px;">
                            <a href="javascript:;" @click="logout()">退出登录</a>
                        </li>
					</ul>
				</div>

				<div class="layui-side">
                    <el-row class="tac">
                        <el-menu
                            class="el-menu-vertical-demo"
                            :router="true"
                            :default-active="menuActive"
							:default-openeds="['5','6']"
                        >
                            <el-menu-item index="/admin/index" @click="reload('/admin/index')">
                                <i class="iconfont icon-yidongyunkongzhitaiicon01 nav_icon"></i>
                                <span>团队总览</span>
                            </el-menu-item>

							<el-menu-item index="/admin/wallet" @click="reload('/admin/wallet')">
								<i class="iconfont icon-baobiao nav_icon"></i>
                                <span>我的钱包</span>
                            </el-menu-item>

							<el-submenu index="5">
                                <template slot="title">
                                    <i class="iconfont icon-huabanfuben nav_icon"></i>
                                    <span>我的团队</span>
                                </template>
                                <el-menu-item index="/admin/group_list" @click="reload('/admin/group_list')">组长列表</el-menu-item>
                                <el-menu-item index="/admin/crew_list" @click="reload('/admin/crew_list')">组员列表</el-menu-item>
                                <el-menu-item index="/admin/team_report2" @click="reload({path: '/admin/team_report', query: {mode: 2}})">团队报表</el-menu-item>
                                <el-menu-item index="/admin/mining_recode" @click="reload('/admin/mining_recode')">挖矿记录</el-menu-item>
                            </el-submenu>

							<el-submenu index="6" v-if="$store.getters.userInfo.is_show_leader">
                                <template slot="title">
                                    <i class="iconfont icon-huabanfuben nav_icon"></i>
                                    <span>下级团队</span>
                                </template>
                                <el-menu-item index="/admin/leader_list" @click="reload('/admin/leader_list')">团长列表</el-menu-item>
                                <el-menu-item index="/admin/team_report1" @click="reload({path: '/admin/team_report', query: {mode: 1}})">团队报表</el-menu-item>
                            </el-submenu>

							
							
							<el-menu-item index="/admin/account_info" @click="reload('/admin/account_info')">
								<i class="iconfont icon-zhuzhuangtu nav_icon"></i>
                                <span>充值记录</span>
                            </el-menu-item>

							<!-- <el-menu-item index="/admin/team_list" @click="reload('/admin/team_list')">
								<i class="iconfont icon-huabanfuben nav_icon"></i>
                                <span>团队成员</span>
                            </el-menu-item> -->

							<el-menu-item index="/admin/update_login_pass" @click="reload('/admin/update_login_pass')">
								<i class="iconfont icon-mima nav_icon"></i>
                                <span>修改密码</span>
                            </el-menu-item>

							<el-menu-item index="/admin/handle_help" @click="reload('/admin/handle_help')">
								<i class="layui-icon layui-icon-help nav_icon"></i>
                                <span class="red">使用帮助</span>
                            </el-menu-item>
                        </el-menu>
                    </el-row>
                </div>

				<div class="layui-body">
					<!-- 内容主体区域 -->
					<div class="content">
						<router-view></router-view>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {}, 	// 个人信息
			power_list: {}, // 显示的栏目
			showChat: false,// 是否显示聊天
			menuActive: '',	// 当前菜单
		};
	},
	created() {
		this.init();
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
	},
	methods: {
		/**
		 * 初始化
		 */
		init() {
			const route = this.$route;
			if (route.query.mode) {
				this.menuActive = route.path + route.query.mode
			} else {
				this.menuActive = route.path;
			}
			this.$store.dispatch('getUserInfo');
		},
		/**
		 * 点击左侧刷新
		 */
		reload(url) {
			this.$router.push("/admin");
			setTimeout(() => {
				this.$router.push(url);
			});
		},

		/**
		 * 退出登录
		 */
		logout() {
			layer.confirm(
				"请问是否要退出登录？",
				{ icon: 7, title: "退出登录" },
				index => {
					this.$axios.post("admin/loginOut").then(data => {
						if (data.status === "OK") {
							setTimeout(() => {
								$.cookie("code_token", "", { path: "/" });
								this.$router.push("/login");
							}, 1500);
						}
					});
				}
			);
		}
	}
};
</script>