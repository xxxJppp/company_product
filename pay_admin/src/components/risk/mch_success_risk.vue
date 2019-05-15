<template>
    <div>
        <div class="listbiaoti am-cf">
            <dl class="am-icon-home" style="float: left;">
                当前位置： 风险控制 >
                <span>商户成功率</span>
            </dl>
        </div>
        <form class="am-form am-g">
            <div class="common_title clearfix datetimerange">

				<div class="time_container fl clearfix">
					<span class="demonstration">日期：</span>
					<el-date-picker
					size="small"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
					v-model="form.date"
					type="datetimerange"
					:picker-options="pickerOptions"
					range-separator="至"
					align="right">
					</el-date-picker>
				</div>

                <!-- 支付状态 -->
                <div class="lottery_status ml20 fl" style="width: 120px;">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.product_code" placeholder="支付类型">
								<el-option label="全部" value=""></el-option>
								<el-option label="扫码支付" value="101"></el-option>
								<el-option label="WAP" value="102"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
                </div>

				<a @click="select_data" href="javascript:void(0)" class="select_btn fl ml15"><i class="el-icon-search"></i> &nbsp;搜索</a>
               
            </div>

			<div
			 class="fl"
			 style="margin: -5px 0 12px 0"
			 v-if="dataList.sum">
				总计：
				成功单数 <i class="red f_bold">{{ dataList.sum.pay_order }}</i> 笔，
				总单数 <i class="red f_bold">{{ dataList.sum.sum_order }}</i> 笔，
				成功率 <i class="red f_bold">{{ dataList.sum.ratio }}</i>
			</div>

            <table width="100%" class="common_table">
                <thead>
                    <tr>
                        <th>商户ID</th>
                        <th>商户账号</th>
                        <th>成功单数</th>
                        <th>总单数</th>
                        <th>成功率</th>
                    </tr>
                </thead>

                <tbody class="common_tbody">
                    <tr
                        v-if="dataList.list"
                        v-show="dataList.list.length > 0"
                        v-for="(item, index) in dataList.list"
                        :key="index"
                    >
                        <td>{{ item.mch_id }}</td>
                        <td>{{ item.mch_account }}</td>
                        <td>{{ item.pay_order }}</td>
                        <td>{{ item.sum_order }}</td>
                        <td>{{ item.ratio }}</td>
                    </tr>

                    <tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
                        <td colspan="12">
                            <img src="../../statics/images/icon/nodate.png">
                            <p>暂时没有商户成功率信息</p>
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
			
			pickerOptions: {
					shortcuts: [
					{
						text: '今天',
						onClick(picker) {
							let time1 = new Date()
							let Y1 = time1.getFullYear()
							let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
							let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
							let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
							const start = timer1 + ' 00:00:00';
							const end = timer1 + ' 23:59:59';
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '昨天',
						onClick(picker) {
							let time2 = new Date()
							time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * 1))
							let Y2 = time2.getFullYear()
							let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
							let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
							let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
							const start = timer2 + ' 00:00:00';
							const end = timer2 + ' 23:59:59';
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
					}]
				},

            form: {
				prompt: true,

				date: [this.$cm_m.getRangeTime(0).t2 + ' 00:00:00', this.$cm_m.getRangeTime(0).t2 + ' 23:59:59'                                                                                                                                                                                                                                      ],			
                product_code: ""
            }
        };
    },
    created() {
        this.request_data();
        console.log(this.form.date)
    },
    methods: {
        request_data() {
			this.$cm_m.toggle_time(this);

            this.$axios.post("Risk/mch_success_rate", this.form).then(res => {
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

    }
};
</script>