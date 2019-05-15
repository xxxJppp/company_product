// 导入vue
import Vue from 'vue';

import store from './vuex.js';


// 导入路由组件
import {router} from './router.js';

// 导入element-ui
import './ElementUI.js';

// 导入根组件
import App from './app.vue';


// 引用全局属性
import base_data from './base_data.js'
Vue.prototype.$cm_d = base_data.baseData;
Vue.prototype.rootPath=location.protocol+'//'+location.host+location.pathname;


// 引用全局方法
import base_methods from './base_methods.js';
// 将全局函数当做插件来进行注册
Vue.prototype.$cm_m = new base_methods.base_methods(base_data.baseData, Vue);



// 导入 jquery
import $ from 'jquery'
// 导入jquery.cookie
import './statics/js/plugins/jquery.cookie.js'

// 引入模板自带css
import './statics/css/plugins/amazeui.css'
import './statics/css/plugins/admin.css'
// 引入自写css样式
import './statics/css/style/style.scss'
// 引入layer.css
import './statics/js/plugins/layer/theme/default/layer.css';

// 引入layui.css
import './statics/css/plugins/layer/css/layui.css';

// 引入layer.js
import layer from './statics/js/plugins/layer/layer.js';
// 引入jquery.cookie
import cookie from './statics/js/plugins/jquery.cookie.js';


new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
})