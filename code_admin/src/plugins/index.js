import Vue from 'vue';

// 导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '../assets/css/iconfont/iconfont.css';	// 字体css


// 导入 jquery
import $ from 'jquery';
// 导入jquery.cookie
import '../assets/jsplugins/jquery.cookie.js';
// 导入样式
import '../assets/css/common.css';

import '../assets/css/style.scss';

// 导入layui
import layui from '../assets/jsplugins/layui/layui.all.js';
import '../assets/jsplugins/layui/css/layui.css';
import '../assets/jsplugins/layui/css/modules/laydate/default/laydate.css';
import '../assets/jsplugins/layui/css/modules/layer/default/layer.css';



// 导入公用数据
import data from '../data/data.js'
Vue.prototype.$d = new data(Vue);
// 导入公用方法
import methods from '../data/methods.js'
Vue.prototype.$m = new methods(Vue);