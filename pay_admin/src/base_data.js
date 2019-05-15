class base_data {
	constructor () {
		this.pageSize = [100, 300, 500, 1000];

		
		this.tg = {
			'index_icon': {
				'index': 'am-icon-home',			
				'mch': 'am-icon-users',	
				'global': 'el-icon-setting',
				'code': 'am-icon-users',
				'risk': 'am-icon-gears',

				'member': 'am-icon-flag',			// 会员管理
				'business': 'am-icon-cart-plus',	// 业务管理
				'pay': 'am-icon-volume-up',			// 充提管理
				'gamesControl': 'el-icon-menu',		// 游戏管理
				'pageControl': 'el-icon-tickets',	// 页面管理
				'passwordControl': 'am-icon-gears'	// 密码控制
			},
			mch_withdraw: {
				0: '审核中',
				1: '待出款',
				2: '已出款',
				3: '已拒绝'
			},
			mch_withdraw_color: {
				'0': 'gray',
				'1': 'red f_bold',
				'2': 'green',
				'3': 'red'
			},
			mch_status: {
				0: '正常',
				1: '禁用'
			},
			mch_status_color: {
				0: 'green',
				1: 'red'
			},
			close_status: {
				0: '正常',
				1: '禁用'
			},
			close_status_color: {
				0: 'green',
				1: 'red'
			},
			aisle_status: {
				0: '正常',
				1: '禁用'
			},
			aisle_status_color: {
				0: 'green',
				1: 'red'
			},
			order_status: {
				0: '未支付',
				1: '已支付',
				2: '支付失败',
				3: '拉起失败',
				4: '用户取消',
				5: '补单充值',
			},
			order_status_color: {
				0: 'gray',
				1: 'green f_bold',
				2: 'red',
				3: 'red',
				4: 'gray',
				5: 'green f_bold',
			},
			has_upload: {
				0: '未上传',
				1: '已上传',
			},
			has_upload_color: {
				0: 'red',
				1: 'green'
			},
			has_pay: {
				0: '未确认',
				1: '已确认',
			},
			has_pay_color: {
				0: 'red',
				1: 'green'
			},
			mining_status: {
				0: '正常',
				1: '超时',
				2: '废弃',
			},
			mining_status_color: {
				0: '',
				1: 'red',
				2: 'gray',
			},
			pay_mode: {
				0: '微信定额收款码',
				1: '微信不定额收款码',
				2: '支付宝定额收款码',
				3: '支付宝不定额收款码',
			},
			has_send: {
				0: '未发送',
				1: '已发送',
			},
			has_send_color: {
				0: 'red',
				1: 'green'
			},
			account_status: {
				0: '正常',
				1: '禁用',
				2: '系统暂停',
				3: '团长暂停',
				4: '风控暂停',
			},
			account_status_color: {
				0: 'green',
				1: 'red',
				2: 'red',
				3: 'red',
				4: 'red',
			},
			admin_type: {
				'0': '禁用',
				'1': '正常'
			},
			admin_type_c: {
				'0': 'red',
				'1': 'green'
			},
			cash_status: {
				0: '正常',
				1: '已退还'
			},
			cash_status_color: {
				0: 'green',
				1: 'red'
			},
			mch_type: {
				0: '普通',
				1: '代收款'
			},
			collection_status: {
				0: '等待充值',
				1: '充值成功',
				2: '充值失败',
			},
			collection_status_color: {
				0: 'gray',
				1: 'green',
				2: 'red',
			},
			pay_status: {
				0: '启用',
				1: '禁用',
			},
			pay_status_color: {
				0: 'green',
				1: 'red',
			},
			event_type: {
				0: '通过店员申请',
				1: '取消店员通知',
			},
			wechat_status: {
				0: '正常',
				1: '禁用'
			},
			wechat_status_color: {
				0: 'green',
				1: 'red'
			},
			bill_change: {
				0: '未知',
				1: '订单支付',
				2: '提现出款',
			},
			code_bill_type: {
				0: '未知',
				1: '订单支付',
				2: '账户充值',
				3: '账户扣款',
			},
			code_bill_status: {
				0: '正常',
				1: '超时',
				2: '废弃',
			},
			code_bill_status_c: {
				0: 'green',
				1: 'red',
				2: '',
			},
			leader_profit_status: {
				0: '未结算',
				1: '已结算',
			},
			leader_profit_status_c: {
				0: 'red',
				1: 'green',
			},
			withdraw_mode: {
				0: '手动',
				1: '自动',
			},
		}
	}
}

const baseData = new base_data();
export default {
	baseData
}