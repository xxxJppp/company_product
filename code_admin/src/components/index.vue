<template>
    <div id="index_container">
        <el-row :gutter="15">
            <el-col :span="6">
                <div class="module">
                    <div class="module-title">
                        <span class="vertical-lines"></span>
                        <span class="title-text">今日数据统计</span>
                    </div>
                    <div class="module-content">
                        <ul class="module-content-list">
                            <li>
                                <div>
                                    <p>今日总订单</p>
                                    <h1>{{ pandectData.today_order_money }}</h1>
                                </div>
                                <div>
                                    <p>昨日总订单</p>
                                    <h1>{{ pandectData.yesterday_order_money }}</h1>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>今日总单数</p>
                                    <h1>{{ pandectData.today_order_sum }}</h1>
                                </div>
                                <div>
                                    <p>昨日总单数</p>
                                    <h1>{{ pandectData.yesterday_order_sum }}</h1>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>今日利润</p>
                                    <h1>{{ pandectData.today_order_profit }}</h1>
                                </div>
                                <div>
                                    <p>昨日利润</p>
                                    <h1>{{ pandectData.yesterday_order_profit }}</h1>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="module">
                    <div class="module-title">
                        <span class="vertical-lines"></span>
                        <span class="title-text">今日数据统计</span>
                    </div>
                    <div class="module-content">
                        <ul class="module-content-list">
                            <li>
                                <div class="data1">
                                    <p>我的钱包</p>
                                    <h1>{{ pandectData.wallet }}</h1>
                                </div>
                                <div class="data2">
                                    <p>与昨日数量比</p>
                                    <h1>5%</h1>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>直属团长</p>
                                    <h1>{{ pandectData.leader }}个</h1>
                                </div>
                                <div>
                                    <p>直属子团长</p>
                                    <h1>{{ pandectData.secondary }}个</h1>
                                </div>
                            </li>
                            <li>
                                <div class="data1">
                                    <p>今日下单商户数</p>
                                    <h1>2</h1>
                                </div>
                                <div class="data2">
                                    <p>与昨日数量相比</p>
                                    <h1>5%</h1>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="module">
                    <div class="module-title">
                        <span class="vertical-lines"></span>
                        <span class="title-text">出单时段统计</span>
                    </div>
                    <div class="module-content">
                        <ul class="module-content-list">
                            <li>
                                <div class="data1">
                                    <p>今日订单总金额</p>
                                    <h1>2</h1>
                                </div>
                                <div class="data2">
                                    <p>与昨日金额比</p>
                                    <h1>5%</h1>
                                </div>
                            </li>
                            <li>
                                <div class="data1">
                                    <p>今日下单商户数</p>
                                    <h1>2</h1>
                                </div>
                                <div class="data2">
                                    <p>与昨日数量相比</p>
                                    <h1>5%</h1>
                                </div>
                            </li>
                            <li>
                                <div class="data1">
                                    <p>平台拥有总商户数</p>
                                    <h1>2564</h1>
                                </div>
                                <div class="data2">
                                    <p>昨日总商户数</p>
                                    <h1>2500</h1>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="module special">
            <div class="module-title">
                <span class="vertical-lines"></span>
                <span class="title-text">APP下载</span>
            </div>
            <div class="module-content">
                <el-row :gutter="15" class="qrcode_container">
                    <el-col :span="8" v-for="(item, index) in qrcodeArr" :key="index" >
                        <el-card shadow="never" :body-style="elCardStyle">
                            <img
                                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                class="image"
                            >
                            <div style="padding: 14px;">
                                <span>{{ item.text }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            qrcodeArr: [
                {
                    text: '苹果'
                },
                {
                    text: '安卓'
                },
                {
                    text: '手机网页'
                },
            ],
            elCardStyle: { 
                padding: '0px',
                'text-align': 'center',
            },
            pandectData: {},
            dataList: {} // 个人数据
        };
    },
    created() {
        this.getPandect();
        // this.requestInfo();
    },
    mounted() {},
    methods: {
        /**
         * 获取个人信息
         */
        requestInfo() {
            this.$axios.post("Team_Data/team_data").then(data => {
                this.dataList = data.dataList;
            });
        },

        /**
         * 获取总览数据
         */
        getPandect() {
            this.$axios.post("Team_Data/team_data").then(data => {
                console.log(data);
                if (data.status != "OK") return;
                this.pandectData = data.dataList;
            });
        }
    }
};
</script>