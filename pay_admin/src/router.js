// 导入vue
import Vue from 'vue'

// 导入 axios
import axios from 'axios'
// 配置 axios
axios.defaults.baseURL = window.location_url;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.withCredentials= false;

// 请求拦截
axios.interceptors.request.use(
	config => {
		if (config.data == undefined) config.data = {};

		// if(config.data && config.data.prompt === true) l_index = layer.load(2, {shade: false,zIndex: 1013});
		if (config.data && config.data.prompt === true) {
			config.data.__closeIndex = layer.msg('加载中请稍后...', { icon: 16, shade: 0.01, time: 0 });
		};

		if (config.data.isForm) return config;

		if ($.cookie('pay_token')) config.data.token = $.cookie('pay_token');
		config.data.moduleId = $('.sideMenu a.router-link-active').parent().data('id')
		return config
	}, function (error) {
		return Promise.reject(error)
	}
)
// 返回拦截
axios.interceptors.response.use(function (response) {
	if(response.config.data.isForm) {
		layer.close(response.config.data.__closeIndex);
	} else {
		layer.close(JSON.parse(response.config.data).__closeIndex);
	}

	if (response.data.status == 'OK') {
		if (response.data.successMsg) {
			layer.msg(response.data.successMsg, {
				icon: '1'
				, time: 1500
			})
		}

		return response.data.dataList
	} else {
		// 返回异常
		layer.msg(response.data.errorMsg, {
			icon: '2'
			, time: 1500
		})
		if (response.data.loginOut) {
			$.cookie('pay_token', '', { expires: -1, path: '/' });

			// Vue.$store.commit('removeInterval');
			
			setTimeout(() => {
				router.replace('/login')
			}, 2000)
		}
		console.error('服务器开了个小差~')

		return { error: true }
	}
}, function (error) {
	// 返回报错
	layer.msg('服务器异常', {
		icon: '2'
		, time: 1500
	})
	return { error: true }
})
Vue.prototype.$axios = axios

// 导入 vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import login from './components/index/login.vue'							// 导入登录页

import layout from './components/layout.vue'							// 导入通用样式
import index from './components/index/index.vue'						// 导入首页
import { permission } from './permission.js'							// 导入需要权限的组件


import close_account_list from './components/layer/close_account_list.vue'	// 结算账号列表
import pay_aisle from './components/layer/pay_aisle.vue'					// 支付通道管理
import all_pay_aisle from './components/layer/all_pay_aisle.vue'			// 全部支付通道管理
import add_admin from './components/layer/add_admin.vue'					// 添加管理员
import allot from './components/layer/allot.vue'							// 成员操作
import eduit_authority from './components/layer/eduit_authority.vue'		// 编辑权限
import select_sup from './components/layer/select_sup.vue'					// 选择上级
import ueditor from './components/layer/ueditor.vue'						// ueditor 富文本编辑器


const routes = [
	{ path: '/', redirect: '/login' },
	// { path: '/', redirect: '/admin/systemConfig/commonQuestion'},
	{ path: '/login', component: login },	// 登录层
	{ path: '/close_account_list', component: close_account_list },	// 结算账号列表
	{ path: '/pay_aisle', component: pay_aisle },	// 支付通道管理
	{ path: '/all_pay_aisle', component: all_pay_aisle },			// 全部支付通道管理
	{ path: '/add_admin', component: add_admin },	// 添加管理员
	{ path: '/eduit_authority', component: eduit_authority },// 编辑权限
	{ path: '/allot', component: allot },			// 成员操作
	{ path: '/select_sup', component: select_sup },	// 选择上级
	{ path: '/ueditor', component: ueditor },		// ueditor 富文本编辑器
]





export const router = new VueRouter({
	routes // (缩写) 相当于 routes: routes
})


// 配置路由守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		window.$cm_addroutes = null;
		return next();
	}
	if ($.cookie('pay_token') && $.cookie('pay_token').length > 0) {
		if (!window.$cm_addroutes)
			if (!window.$cm_addroutes) {
				axios.post('/Admin/authority', { token: $.cookie('pay_token') }).then(res => {
					judge_power(res, permission)
					let a_routes = window.$cm_addroutes
					router.addRoutes(a_routes)
				})
			} else {
				let a_routes = window.$cm_addroutes
				router.addRoutes(a_routes)
			}
		next();
	} else {
		router.replace('/login')
		layer.closeAll();
	}
})

// router.addRoutes()


function judge_power(back, data) {
	let req_data = back.children, sti_data = data[0].children;
	let a_routes = [{
		path: '/admin', component: layout, children: [{
			path: 'index', component: index
		}]
	}];

	let screenArr = [];

	req_data.forEach(req_item => {
		sti_data.forEach(sti_item => {
			if (req_item.path == sti_item.path) {
				screenArr.push(sti_item);
			}
		})
	})

	screenArr.forEach(screen_item => {
		req_data.forEach(req_item => {
			if (req_item.path == screen_item.path) {
				if (screen_item.children && screen_item.children.length && screen_item.children.length > 0) {
					let newArr = [];
					screen_item.children.forEach(screen_subitem => {
						req_item.children.forEach(req_subitem => {
							if (req_subitem.path == screen_subitem.path) {
								newArr.push(screen_subitem);
							}
						})
					})
					screen_item.children = newArr
				}
			}
		})
	})

	screenArr.forEach(item => {
		a_routes[0].children.push(item)
	})

	window.$cm_addroutes = a_routes;
}