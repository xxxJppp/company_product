<template>
    <div>
        <div class="listbiaoti am-cf">
            <dl class="am-icon-home" style="float: left;">
                当前位置： 风险控制 >
                <span>码户成功率</span>
            </dl>
        </div>
        <form class="am-form am-g">
            <div class="common_title clearfix">
                <!-- 支付状态 -->
                <!-- <div class="lottery_status fl" style="width: 160px;">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.type" placeholder="排序类型">
								<el-option label="成功比例" value="1"></el-option>
								<el-option label="连续不成功单数" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
                </div>-->

                <div class="fl" style="width: 275px;">
                    <el-form :inline="true" size="small" :model="form" @submit.native.prevent>
                        <el-form-item label="连续不成功单数大于：">
                            <el-input style="width: 100px;" v-model.number="errorNums"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <a @click="checkData" href="javascript:void(0)" class="fl select_btn">
                    <i class="el-icon-search"></i> &nbsp;选中
                </a>

                <div class="fl" style="margin-top: 4px; margin-left: 20px;">
                    <div class="am-btn-group am-btn-group-xs">
                        <button type="button" class="am-btn am-btn-default" @click="checked_stop">
                            <span class="el-icon-close"></span> 暂停选中用户
                        </button>
                    </div>
                </div>
            </div>

            <table width="100%" class="common_table">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" @click="checked_all" v-model="is_select_all">
                        </th>
                        <th>码户账号</th>
                        <th>昵称</th>
                        <th>今日累计收款</th>
                        <th>连续不成功单数</th>
                        <th>最近订单二维码</th>
                        <th class="control_T">操作</th>
                    </tr>
                </thead>

                <tbody class="common_tbody">
                    <tr
                        v-if="dataList.list"
                        v-show="dataList.list.length > 0"
                        v-for="(item, index) in dataList.list"
                        :key="index"
                    >
                        <td>
                            <input
                                type="checkbox"
                                :value="item.id"
                                @change="checked_one"
                                v-model="checked_data"
                            >
                        </td>
                        <td>{{ item.cp_account }}</td>
                        <td>{{ item.cp_nickname }}</td>
                        <td>{{ item.today_pay_money }}</td>
                        <td :class="item.checked ? 'red' : ''">{{ item.fail_count }}</td>
                        <td>
                            <span
                                class="_info"
                                @click="look({url:item.qrcode_url, money: item.pay_money, nickname: item.cp_nickname})"
                            >{{ item.qrcode_url == '' ? '' : '查看' }}</span>
                        </td>
                        <td class="control_C">
                            <span class="close_btn cp auth_stopReceipt" @click="stopReceipt(item)">
                                <i class="el-icon-close"></i>风控暂停
                            </span>
                        </td>
                    </tr>

                    <tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
                        <td colspan="12">
                            <img src="../../statics/images/icon/nodate.png">
                            <p>暂时没有码户成功率信息</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errorNums: 0, // 连续不成功单数

            is_select_all: false, // 是否选择全部
            checked_data: [], // 选择数据

            dataList: { list: [] },

            form: {
                prompt: true,
                type: "1"
            }
        };
    },
    created() {
        this.request_data();
    },
    methods: {
        request_data() {
            this.$axios.post("Risk/cp_success_rate", this.form).then(res => {
                if (res.error) {
                    return;
                }
                res.list.forEach(item => (item.checked = false));
                this.dataList = res;
                this.$cm_m.auth_btn();
            });
        },

        select_data() {
            this.request_data();
        },

        /**
         * 查看二维码图片
         * @param {String} url 二维码地址
         * @param {Number} money 对应二维码的金额
         * @param {Number} nickname 昵称
         */
        look({ url, money, nickname }) {
            this.$axios
                .post(`Code_provider/qrcode_images`, {
                    url: url
                })
                .then(data => {
                    const JSON = {
                        data: [
                            {
                                alt: false,
                                src: data.url, //原图地址
                                thumb: data.url //缩略图地址
                            }
                        ]
                    };

                    layer.photos({
                        title: [
                            `￥${money} ${
                                nickname == "" ? "" : `(${nickname})`
                            }`,
                            "font-size:20px; font-weight: bold; text-align: center; padding: 0"
                        ],
                        area: ["300px", "350px"],
                        photos: JSON,
                        shade: 0.5,
                        anim: 5
                    });
                });
        },

        /**
         * 暂停收款
         */
        stopReceipt(dataObj) {
            layer.open({
                type: 1,
                area: ["370px", "295px"],
                btn: ["暂停", "取消"],
                title: "暂停支付账号",
                content: `
					<div class="__layer edit_payaccount">
						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<span>${dataObj.cp_account}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<span>${dataObj.cp_nickname}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">备注：</span>
							<input class="__layer_input remark" value="${
                                dataObj.remark
                            }" type="text" autocomplete="off"/>
						</div>
					</div>
				`,
                yes: layIndex => {
                    let remark = $(".edit_payaccount .remark").val();

                    this.$axios
                        .post("Risk/payaccount_ban", {
                            cp_id: dataObj.id,
                            remark,
                            prompt: true
                        })
                        .then(res => {
                            if (!res) {
                                setTimeout(() => {
                                    layer.close(layIndex);
                                    this.request_data();
                                }, 1500);
                            }
                        });
                }
            });
        },

        checked_stop() {
			if (this.checked_data.length <= 0) return layer.msg("请选择需要暂停的用户", { icon: 2, time: 1500 });
			
			layer.open({
                type: 1,
                area: ["370px", "250px"],
                btn: ["暂停", "取消"],
                title: "暂停支付账号",
                content: `
					<div class="__layer stop_payaccount">
						<div class="item mb0">
							<span class="__layer_title" style="width: 80px;">备注：</span>
							<textarea class="__layer_textarea remark" style="width: 230px; height: 120px;"></textarea>
						</div>
					</div>
				`,
                yes: layIndex => {
                    let remark = $(".stop_payaccount .remark").val();

                    this.$axios
		                .post("Risk/payaccount_ban", {
		                    cp_id: this.checked_data,
		                    remark,
		                    prompt: true
		                })
		                .then(res => {
		                    if (!res) {
		                        setTimeout(() => {
		                            this.checked_data = [];
		                            layer.close(layIndex);
		                            this.request_data();
		                        }, 1500);
		                    }
						});
						
                }
			});
			
            
        },

        // 全选按钮
        checked_all() {
            this.is_select_all = !this.is_select_all;
            if (this.is_select_all) {
                this.dataList.list.forEach(item => {
                    if (!this.checked_data.includes(item.id))
                        this.checked_data.push(item.id);
                });
            } else {
                this.checked_data = [];
            }
        },

        // 单选按钮
        checked_one() {
            if (this.dataList.list.length === this.checked_data.length) {
                this.is_select_all = true;
            } else {
                this.is_select_all = false;
            }
        },

        /**
         * 选中
         */
        checkData() {
            this.checked_data = [];
            this.dataList.list.forEach(item => {
                if (+item.fail_count >= this.errorNums) {
                    this.checked_data.push(item.id);
                    item.checked = true;
                } else {
                    item.checked = false;
                }
			});
			this.is_select_all = this.checked_data.length === this.dataList.list.length
        }
    }
};
</script>