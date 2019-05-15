import layout from './components/layout.vue'		// 主页模板
import index from './components/index/index.vue'	// 首页
import login from './components/index/login.vue'	// 登录页


import mch from './components/mch/mch.vue'					// 商户管理模板
import mch_list from './components/mch/mch_list.vue'		// 商户列表
import mch_order from './components/mch/mch_order.vue'		// 商户订单
import mch_income from './components/mch/mch_income.vue'	// 商户收入
import mch_withdraw from './components/mch/mch_withdraw.vue'// 提现管理
import idle_mchlist from './components/mch/idle_mchlist.vue'// 闲置商户
import collection_record from './components/mch/collection_record.vue'// 代收款记录
import mch_billchange from './components/mch/mch_billchange.vue'// 商户账变


import global from './components/global/global.vue'					// 全局管理模板
import notice from './components/global/notice.vue'					// 公告管理模板
import global_config from './components/global/global_config.vue'	// 全局配置
import authority from './components/global/authority.vue'			// 权限管理
import admin_control from './components/global/admin_control.vue'	// 后台管理员
import pay_rate from './components/global/pay_rate.vue'				// 支付频率管理
import pay_url from './components/global/pay_url.vue'				// 充值域名管理
import service_list from './components/global/service_list.vue'		// 客服列表


import code from './components/code/code.vue'						// 码户管理模板
import code_list from './components/code/code_list.vue'				// 码户列表
import code_qrcode from './components/code/code_qrcode.vue'			// 二维码管理
import mining_record from './components/code/mining_record.vue'		// 挖矿记录
import team_report from './components/code/team_report.vue'			// 团队报表
import cash_manage from './components/code/cash_manage.vue'			// 押金管理
import code_online from './components/code/code_online.vue'			// 在线会员
import reconciliation from './components/code/reconciliation.vue'	// 码户对账
import receipt_record from './components/code/receipt_record.vue'	// 收款记录
import wechat_manage from './components/code/wechat_manage.vue'		// 收款记录
import team_reconciliation from './components/code/team_reconciliation.vue'	// 码户团队对账
import code_billchange from './components/code/code_billchange.vue'	// 码户账变记录
import leader_profit from './components/code/leader_profit.vue'		// 团长利润


import risk from './components/risk/risk.vue'							// 风控管理模板
import code_login_list from './components/risk/code_login_list.vue'		// 码户登录列表
import mch_login_list from './components/risk/mch_login_list.vue'		// 商户登录列表
import code_success_risk from './components/risk/code_success_risk.vue'	// 码户成功率
import mch_success_risk from './components/risk/mch_success_risk.vue'	// 商户成功率



export const permission = [

	{
		path: '/admin', layout, children: [
			{
				path: 'index', component: index
			},
			{
				path: 'mch', component: mch, children: [
					{
						path: 'mch_list', component: mch_list
					},
					{
						path: 'mch_order', component: mch_order
					},
					{
						path: 'mch_income', component: mch_income
					},
					{
						path: 'mch_withdraw', component: mch_withdraw
					},
					{
						path: 'idle_mchlist', component: idle_mchlist
					},
					{
						path: 'collection_record', component: collection_record
					},
					{
						path: 'mch_billchange', component: mch_billchange
					},
				]
			},
			{
				path: 'global', component: global, children: [
					{
						path: 'notice', component: notice
					},
					{
						path: 'global_config', component: global_config
					},
					{
						path: 'authority', component: authority
					},
					{
						path: 'admin_control', component: admin_control
					},
					{
						path: 'pay_rate', component: pay_rate	
					},
					{
						path: 'pay_url', component: pay_url
					},
					{
						path: 'service_list', component: service_list
					},
				]
			},
			{
				path: 'code', component: code, children: [
					{
						path: 'code_list', component: code_list
					},
					{
						path: 'code_qrcode', component: code_qrcode
					},
					{
						path: 'mining_record', component: mining_record
					},
					{
						path: 'team_report', component: team_report
					},
					{
						path: 'cash_manage', component: cash_manage
					},
					{
						path: 'code_online', component: code_online
					},
					{
						path: 'reconciliation', component: reconciliation
					},
					{
						path: 'receipt_record', component: receipt_record
					},
					{
						path: 'wechat_manage', component: wechat_manage
					},
					{
						path: 'team_reconciliation', component: team_reconciliation
					},
					{
						path: 'code_billchange', component: code_billchange
					},
					{
						path: 'leader_profit', component: leader_profit
					},
				]
			},
			{
				path: 'risk', component: risk, children: [
					{
						path: 'code_login_list', component: code_login_list
					},
					{
						path: 'mch_login_list', component: mch_login_list
					},
					{
						path: 'code_success_risk', component: code_success_risk
					},
					{
						path: 'mch_success_risk', component: mch_success_risk
					},
				]
			}
		]
	},
	{
		path: '*',
		component: login
	}
];