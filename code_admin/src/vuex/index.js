import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

// 导入公用方法
import methods from '../data/methods.js'
const $m = new methods(Vue);

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},
		rebate: {},
	},
	getters: {
		userInfo: state => state.userInfo,
	},
	mutations: {
		setUserInfo(state, data) {
			state.userInfo = data;
		},
	},
	actions: {
		getUserInfo({commit, dispatch}) {
			axios.post("Admin/user_info").then(data => {
				commit('setUserInfo', data.dataList)
			});
		},
	}
})

export default store;