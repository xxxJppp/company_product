// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import plugins from './plugins';
import router from './router'
import store from './vuex';

import './assets/css/me_iconfont/iconfont.css'

Vue.config.productionTip = false;

window.getContextPath = function() {
	return `${location.protocol}//${location.host}/`;
}
window.$hhyangUtil={
	showPhotos:(photos)=> {
		photos= JSON.parse(JSON.stringify(photos));
		layer.photos({
			photos,
			zIndex:99999999999999
		});
	}
}

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})