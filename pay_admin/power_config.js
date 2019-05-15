// 主页模板
var routesObj = { "path": '/admin', component: layout, children: [
	{
		path: 'index', component: index
	},
	// 业务管理
	{
		path: 'business', component: business, children: [
			{
				path: 'bet-record', component: bet_record
			},
			{
				path: 'accountChange', component: account_change
			},
			{
				path: 'chaseRecord', component: chase_record
			},
			{
				path: 'dayRateControl', component: dayRate_control
			},
			{
				path: 'dayRateRecord', component: day_rate_record
			},
			{
				path: 'dividendControl', component: dividend_control
			},
			{
				path: 'dividendRecord', component: dividend_record
			}
		]
	},
	// 会员管理
	{
		path: 'member', component: member, children: [
			{
				path: 'member-online', component: member_online
			},
			{
				path: 'member-list', component: member_list
			},
			{
				path: 'select_ip', component: select_ip
			}
		]
	},
	// 风控管理
	{
		path: 'riskcontrol', component: riskcontrol, children: [
			{
				path: 'select-address', component: select_address
			},
			{
				path: 'abnormalUser', component: abnormalUser
			},
			{
				path: 'cardManage', component: card_manage
			}
		]
	},
	// 充提管理
	{
		path: 'pay', component: pay, children: [
			{
				path: 'withdraw', component: withdraw
			},
			{
				path: 'recharge', component: recharge
			},
			{
				path: 'startRecharge', component: start_recharge
			},
			{
				path: 'repeal', component: repeal
			}
		]
	},
	// 系统配置
	{
		path: 'systemConfig', component: systemConfig, children: [
			{
				path: 'fastMessage', component: fast_message
			},
			{
				path: 'globalConfig', component: globalConfig
			},
			{
				path: 'riskBonus', component: riskBonus
			},
			{
				path: 'lineControl', component: lineControl
			},
			{
				path: 'serviceList', component: service_list
			},
			{
				path: 'noticeControl', component: notice_control
			},
			{
				path: 'commonQuestion', component: common_question
			},
			{
				path: 'hotActivity', component: hot_activity
			},
			{
				path: 'aboutMe', component: about_me
			},
			{
				path: 'setBank', component: set_bank
			},
			{
				path: 'setPay', component: set_pay
			},
			{
				path: 'accountAddress', component: account_address
			}
		]
	},
	// 游戏管理
	{
		path: 'gamesControl', component: games_control, children: [
			{
				path: 'timeControl', component: time_control
			},
			{
				path: 'openNum', component: open_num
			},
			{
				path: 'limitMultiple', component: limit_multiple
			},
			{
				path: 'setCapital', component: set_capital
			},
			{
				path: 'repairOrder', component: repair_order
			}
		]
	},
	// 页面管理
	{
		path: 'pageControl', component: page_control, children: [
			{
				path: 'setTitle', component: set_title
			},
			{
				path: 'bTitleUrl', component: b_title_url
			}
		]
	}
] }