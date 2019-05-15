import Vue from 'vue';

import Router from 'vue-router';
Vue.use(Router)

// 导入 axios
import axios from 'axios'
import login from '@/components/login.vue';		// 登录页面
import layout from '@/components/layout.vue';	// 布局界面
import index from '@/components/index.vue';		// 首页


// 团队管理
import team_list from '@/components/team/team_list.vue';		// 团队列表
import team_report from '@/components/team/team_report.vue';		// 团队列表
import leader_list from '@/components/team/leader_list.vue';		// 团长列表
import group_list from '@/components/team/group_list.vue';			// 组长列表
import crew_list from '@/components/team/crew_list.vue';			// 组员列表
// import team_online from '@/components/team/team_online.vue';		// 在线会员

import mining_recode from '@/components/mining/mining_recode.vue';		// 挖矿记录
import account_info from '@/components/account/account_info.vue';		// 账户明细
import handle_help from '@/components/account/handle_help.vue';			// 操作说明
import wallet from '@/components/account/wallet.vue';					// 我的钱包列表

// 二维码管理
import qrcode_manage from '@/components/qrcode/qrcode_manage.vue';	// 二维码管理

// import web_notice from '@/components/notice/web_notice.vue';		// 站内公告

// 安全中心
import update_login_pass from '@/components/safe/update_login_pass.vue';	// 修改登录密码


// router配置
const router = new Router({
	routes: [
		{ path: '/login', component: login },
		{
			path: '/admin', component: layout, children: [
				{
					path: 'index', component: index
				},
				{
					path: 'team_list', component: team_list
				},
				{
					path: 'team_report', component: team_report
				},
				{
					path: 'leader_list', component: leader_list
				},
				{
					path: 'group_list', component: group_list
				},
				{
					path: 'crew_list', component: crew_list
				},
				// {
				// 	path: 'team_online', component: team_online
				// },
				{
					path: 'update_login_pass', component: update_login_pass
				},
				{
					path:'mining_recode', component: mining_recode
				},
				{
					path: 'account_info', component: account_info
				},
				{
					path: 'handle_help', component: handle_help
				},
				{
					path: 'wallet', component: wallet	
				},
				// {
				// 	path: 'web_notice', component: web_notice
				// },
				{
					path: 'qrcode_manage', component: qrcode_manage	
				},
				{
					// 匹配所有路径
					path: '*',
					redirect: '/admin/index'
				},
			]
		},
		{
			// 匹配所有路径
			path: '*',
			redirect: '/login'
		}
	]
})



// 配置 axios
axios.defaults.baseURL = window.location_url;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截
axios.interceptors.request.use(
	config => {
		if (!config.data) {
			config.data = {};
		}
		if (config.data.prompt === true) {
			config.data.__closeIndex = layer.msg('加载中请稍后...', { icon: 16, shade: 0.01, time: 0 });
		};

		if ($.cookie('code_token')) {
			config.data.token = $.cookie('code_token');
		};
		// config.data.moduleId = $('.sideMenu a.router-link-active').parent().data('id')
		return config
	}, function (error) {
		return Promise.reject(error)
	}
)
// 返回拦截
axios.interceptors.response.use(function (response) {

	if (response.config.data) {
		layer.close(JSON.parse(response.config.data).__closeIndex);
	}

	if (response.data.status == 'OK') {

		if (response.data.successMsg) {
			layer.msg(response.data.successMsg, {
				icon: '1'
				, time: 1500
			})
		}

		return response.data;
	} else {
		// 返回异常
		layer.msg(response.data.errorMsg, {
			icon: '2'
			, time: 1800
		})

		if (response.data.loginOut) {
			$.cookie('code_token', '', { expires: -1, path: '/' });
			setTimeout(() => {
				router.replace('/login')
			}, 2000)
		}

		console.error('服务器开了个小差~')

		return { status: 'error' };
	}
}, function (error) {
	layer.closeAll()

	// 返回报错
	layer.msg('服务器异常', {
		icon: '2'
		, time: 1500
	})

	return { status: 'error' };
})
Vue.prototype.$axios = axios


// 配置路由守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/' || to.path === '/login') {
		window.$__addroutes = null;
		$.cookie('code_token', '', { expires: -1, path: '/' }); 	// 删除 cookie
		$.cookie('userId', '', { expires: -1, path: '/' }); 	// 删除 cookie
		$.cookie('userName', '', { expires: -1, path: '/' }); // 删除 cookie
		layer.closeAll();
		next();
	}
	if ($.cookie('code_token') && $.cookie('code_token').length > 0) {
		next();
	} else {
		router.replace('/login');
		layer.closeAll();
	}
})

export default router;