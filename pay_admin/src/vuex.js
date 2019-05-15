import Vue from 'vue';

import Vuex from 'Vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},		// 个人信息
		rebateList: [],
		hasQrcode: false,
		orderDate: [],	// 商户订单查询时间
		openChat: true,// 是否开启聊天
	},
	getters: {
		getUserInfo: state => state.userInfo,
		getRebateList: state => state.rebateList.map(item => item),
		getQrcode: state => state.hasQrcode,
		getOrderDate: state => state.orderDate.map(item => item),
		openChat: state => state.openChat,
	},
	mutations: {
		setRebateList(state, rebate) {
			state.rebateList = rebate.list;
		},
		setQrcode(state, bool) {
			state.hasQrcode = bool;
		},
		setOrderDate(state, date) {
			state.orderDate = date;
		},
		setuserInfo(state, data) {
			state.userInfo = data;
		}
	}
})

export default store;