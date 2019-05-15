<template>
    <div id="team_report">
        <div class="content_item">
            <div class="item_title">
                <span>我的钱包</span>
                <ul class="fr total_data" style="margin-right: 10px;">
                    <li class="red f_bold">
                        当前钱包可用余额：
                        <i>￥ {{ walletMoney }} 元</i>
                    </li>
                </ul>
            </div>
            <div class="layui-form item_content">
                <div class="layui-inline">
                    <label class="layui-form-label">起始时间：</label>
                    <div class="layui-input-inline">
                        <input
                            type="text"
                            class="layer-time layui-input"
                            id="startTime"
                            autocomplete="off"
                            readonly
                        >
                    </div>
                </div>

                <div class="layui-inline">
                    <label class="layui-form-label">结束时间：</label>
                    <div class="layui-input-inline">
                        <input
                            type="text"
                            class="layer-time layui-input"
                            id="endTime"
                            autocomplete="off"
                            readonly
                        >
                    </div>
                </div>

                <div class="layui-inline">
                    <button
                        @click="selectData()"
                        style="padding: 0 20px; margin-left: 25px;"
                        class="layui-btn layui-btn-sm layui-btn-normal"
                    >查询</button>
                </div>

                <div class="connect_div">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th>团长账号</th>
                                <th>昵称</th>
                                <th>返点</th>
                                <th>利润点位</th>
                                <th>成交总量</th>
                                <th>利润金额</th>
                                <th>日期</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody v-if="dataList.list" v-show="dataList.list.length > 0">
                            <tr v-for="(item, index) in dataList.list" :key="index">
                                <td class="f_bold" v-text="item.sub_cp_account"></td>
                                <td v-text="item.cp_nickname"></td>
                                <td v-text="item.sub_cp_fee"></td>
                                <td v-text="item.profit_point"></td>
                                <td class="red" v-text="item.sub_cp_total_money"></td>
                                <td class="red" v-text="item.profit_money"></td>
                                <td v-text="item.profit_date"></td>
                                <td
                                    :class="$d.tg['wallet_status_c'][item.status]"
                                    v-text="$d.tg['wallet_status'][item.status]"
                                ></td>
                            </tr>
                        </tbody>

                        <tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
                            <tr class="no_data">
                                <td colspan="99">
                                    <img src="../../assets/images/icon/nodate.png">
                                    <p>暂时没有我的钱包信息！</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="page" class="fr">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="reqData.page"
                            :page-sizes="$d.pageSizes"
                            :page-size="reqData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="dataList.sum"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
			getTime: 60000,
			timeId: null,

			walletMoney: '0.00',		// 钱包金额
            dataList: { list: [] },
            reqData: {
                prompt: true,
                start_time: this.$m.getRangeTime(0).t1, // 开始时间
                end_time: this.$m.getRangeTime(0).t1, // 结束时间
                page: 1,
                pageSize: 100
            }
        };
    },
    created() {
		this.init();
        this.requestList();
    },
    mounted() {
        this.layui_init();
	},
	beforeDestroy() {
		clearInterval(this.timeId)
	},
    methods: {
		/**
		 * 初始化 
		 */
		init() {
			this.getWalletMoney();
			this.timeId = setInterval(() => {
				this.getWalletMoney();
			}, this.getTime)
		},

        /**
         * layui初始化
         */
        layui_init() {
            layui.use(["form", "laydate"], () => {
                let laydate = layui.laydate;

                const today = this.$m.getRangeTime(0).t1;
                //日期时间选择器
                laydate.render({
                    elem: "#startTime",
                    type: "date",
                    min: this.$m.getRangeTime(30).t2,
                    max: today,
                    value: today,
                    done: (value, date, endDate) => {
                        this.reqData.start_time = value;
                    }
                });

                laydate.render({
                    elem: "#endTime",
                    type: "date",
                    min: this.$m.getRangeTime(30).t2,
                    max: today,
                    value: today,
                    done: (value, date, endDate) => {
                        this.reqData.end_time = value;
                    }
                });
                laydate.render();
            });
        },

        /**
         * 请求团队报表信息
         * closePrompt: 是否关闭加载页面
         */
        requestList() {
            this.$axios.post("Wallet/wallet_list", this.reqData).then(data => {
                if (data.status == "error") return;
                this.dataList = data.dataList;
            });
		},
		
		getWalletMoney() {
			this.$axios.post('Wallet/wallet_money').then(data => {
				if (data.status === 'error') return;
				this.walletMoney = data.dataList.wallet;
			})
		},

        /**
         * 查询数据
         */
        selectData() {
            this.reqData.page = 1;
            this.requestList();
        },

        /**
         * 页容量变化
         */
        handleSizeChange(val) {
            this.reqData.pageSize = val;
            this.reqData.page = 1;
            this.requestList();
        },
        /**
         * 页码变化
         */
        handleCurrentChange(val) {
            this.reqData.page = val;
            this.requestList();
        }
    }
};
</script>