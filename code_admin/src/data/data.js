export default class Data {
	constructor(Vue) {
		this.Vue = Vue;

		// 转换
		this.tg = {
			has_pay: {
				0: '未支付',
				1: '支付成功',
			},
			has_pay_color: {
				0: 'red',
				1: 'green'
			},
			has_upload: {
				0: '未上传',
				1: '已上传',
			},
			has_upload_color: {
				0: 'red',
				1: 'green'
			},
			pay_status: {
				0: '正常',
				1: '超时',
				2: '废弃'
			},
			pay_status_color: {
				0: '',
				1: 'red',
				2: 'gray'
			},
			leader_status: {
				0: '整团正常接单',
				1: '系统禁用',
				3: '整团暂停接单',
			},
			leader_status_c: {
				0: 'green',
				1: 'red',
				3: 'red',
			},
			group_status: {
				0: '整组正常接单',
				1: '系统禁用',
				3: '整组暂停接单',
			},
			group_status_c: {
				0: 'green',
				1: 'red',
				3: 'red',
			},
			account_status: {
				0: '正常接单',
				1: '系统禁用',
				2: '系统暂停',
				3: '手动暂停',
				4: '风控暂停',
			},
			account_status_color: {
				0: 'green',
				1: 'red',
				2: 'gray',
				3: 'gray',
				4: 'gray',
			},
			wallet_status_c: {
				0: 'red',
				1: 'green',
			},
			wallet_status: {
				0: '未结算',
				1: '已结算',
			},

		}


		// 统一页容量
		this.pageSizes = [100, 200, 500, 1000];


		// 正则
		this.reg = {
			ip: /^(0|\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(0|\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(0|\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(0|\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		}
	}
}
