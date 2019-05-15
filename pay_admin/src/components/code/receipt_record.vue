<template>
    <div>
        <div class="listbiaoti am-cf">
            <dl class="am-icon-home" style="float: left;">
                当前位置： 码户管理 >
                <span>收款记录</span>
            </dl>
        </div>
        <form class="am-form am-g">
            <div class="common_title clearfix">
                <div class="username fl">
                    <el-form :inline="true" size="small" :model="form" @submit.native.prevent>
                        <el-form-item>
                            <el-input
                                @keyup.enter.native="select_data"
                                v-model="form.receipt_money"
                                placeholder="金额"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="username fl">
                    <el-form :inline="true" size="small" :model="form" @submit.native.prevent>
                        <el-form-item>
                            <el-input
                                @keyup.enter.native="select_data"
                                v-model="form.wx_nickname"
                                placeholder="微信昵称"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="fl clearfix ml10">
                    <span class="demonstration">日期：</span>

                    <el-date-picker
                        size="small"
                        v-model="form.time"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </div>

				<div class="lottery_status fl ml15">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.status" placeholder="支付状态">
								<el-option label="全部状态" value=""></el-option>
								<el-option label="未处理" value="0"></el-option>
								<el-option label="已处理" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>

                <a
                    @click="select_data"
                    href="javascript:void(0)"
                    class="select_btn"
                    style="margin-left: 15px;"
                >
                    <i class="el-icon-search"></i> &nbsp;搜索
                </a>
            </div>

            <table width="100%" class="common_table">
                <thead>
                    <tr>
                        <th>收款时间</th>
                        <th>收款金额</th>
                        <th>微信昵称</th>
                        <th>真实姓名</th>
                        <th>码户昵称</th>
                        <th>码户账号</th>
                        <th>订单号</th>
                    </tr>
                </thead>

                <tbody class="common_tbody">
                    <tr
                        v-if="dataList.list"
                        v-show="dataList.list.length > 0"
                        v-for="(item, index) in dataList.list"
                        :key="index"
                    >
                        <td>{{ item.receipt_date }}</td>
                        <td>{{ item.receipt_money }}</td>
                        <td>{{ item.wx_nickname }}</td>
                        <td>{{ item.real_name }}</td>
                        <td>{{ item.cp_account }}</td>
                        <td>{{ item.cp_nickname }}</td>
						<td>{{ item.mch_order_number }}</td>
                    </tr>

                    <tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
                        <td colspan="12">
                            <img src="../../statics/images/icon/nodate.png">
                            <p>暂时没有收款记录</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="fr">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="form.page"
                    :page-sizes="$cm_d.pageSize"
                    :page-size="form.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataList.sum"
                ></el-pagination>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rebatesList: [],
            dataList: { list: [] },
            is_select_all: false,
            checked_data: [],

            form: {
                prompt: true,
                page: 1,
                pageSize: 100,

                wx_nickname: "",
                receipt_money: "",
				status: '0',
                time: ""
            }
        };
    },
    created() {
		this.request_data();
	},
    computed: {},
    mounted() {
        this.$cm_m.auth_btn();
    },
    methods: {
        request_data() {
            this.$axios
                .post("Code_Provider/receipt_list", this.form)
                .then(res => {
                    if (res.error) {
                        return;
                    }
                    this.dataList = res;
                    this.$cm_m.auth_btn();
                });
        },

        select_data() {
            this.form.page = 1;
            this.request_data();
        },

        handleSizeChange(val) {
            this.form.page = 1;
            this.form.pageSize = val;
            this.request_data();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.request_data();
        }
    }
};
</script>