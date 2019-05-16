<template>
    <div id="index_container">
        <el-row :gutter="15">
            <el-col :span="12">
                <div class="module">
                    <div class="module-title">
                        <span class="vertical-lines"></span>
                        <span class="title-text">我的团数据统计</span>
                    </div>
                    <div class="module-content">
                        <ul class="module-content-list">
                            <li>
                                <div>
                                    <p>今日总订单</p>
                                    <h1>{{ pandectData.my_today_order_money }}</h1>
                                </div>

                                <div>
                                    <p>今日总单数</p>
                                    <h1>{{ pandectData.my_today_order_sum }}</h1>
                                </div>

                                <div>
                                    <p>今日利润</p>
                                    <h1>{{ pandectData.my_today_order_profit }}</h1>
                                </div>

                                <div>
                                    <p>团队人数</p>
                                    <h1>{{ pandectData.my_all_number }}</h1>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>昨日总订单</p>
                                    <h1>{{ pandectData.my_yesterday_order_money }}</h1>
                                </div>

                                <div>
                                    <p>昨日总单数</p>
                                    <h1>{{ pandectData.my_yesterday_order_sum }}</h1>
                                </div>

                                <div>
                                    <p>昨日利润</p>
                                    <h1>{{ pandectData.my_yesterday_order_profit }}</h1>
                                </div>

                                <div>
                                    <p>可用人数</p>
                                    <h1>{{ pandectData.my_usable_number }}</h1>
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
                        <span class="title-text">下级团数据统计</span>
                    </div>
                    <div class="module-content">
                        <ul class="module-content-list">
                            <li>
                                <div>
                                    <p>今日总订单</p>
                                    <h1>{{ pandectData.sub_today_order_money }}</h1>
                                </div>

                                <div>
                                    <p>今日总单数</p>
                                    <h1>{{ pandectData.sub_today_order_sum }}</h1>
                                </div>

                                <div>
                                    <p>今日利润</p>
                                    <h1>{{ pandectData.sub_today_order_profit }}</h1>
                                </div>

                                <div>
                                    <p>团队人数</p>
                                    <h1>{{ pandectData.sub_all_number }}</h1>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>昨日总订单</p>
                                    <h1>{{ pandectData.sub_yesterday_order_money }}</h1>
                                </div>

                                <div>
                                    <p>昨日总单数</p>
                                    <h1>{{ pandectData.sub_yesterday_order_sum }}</h1>
                                </div>

                                <div>
                                    <p>昨日利润</p>
                                    <h1>{{ pandectData.sub_yesterday_order_profit }}</h1>
                                </div>

                                <div>
                                    <p>可用人数</p>
                                    <h1>{{ pandectData.sub_usable_number }}</h1>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
        </el-row>

        <div class="module one-line" style="margin-top: 20px;">
            <div class="module-title">
                <span class="vertical-lines"></span>
                <span class="title-text">团长可用额度</span>
            </div>
            <div class="module-content scroll">
                <ul class="module-content-list">
                    <li>
                        <div class="data1" v-for="(item, index) in leaderData" :key="index">
                            <p>团长：{{ item.cp_account }}</p>
                            <h1>￥{{ item.gather_amount_limit }}</h1>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="module special">
            <div class="module-title">
                <span class="vertical-lines"></span>
                <span class="title-text">APP下载</span>
            </div>
            <div class="module-content">
                <el-row :gutter="15" class="qrcode_container" v-if="Object.keys(downloadData).length > 0">
					<el-col :span="8">
                        <el-card shadow="never" :body-style="elCardStyle">
                            <img
                                :src="downloadData.ios.config_value"
                                class="image"
                            >
                            <div style="padding: 14px;">
                                <span>{{ downloadData.ios.config_desc }}</span>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card shadow="never" :body-style="elCardStyle">
                            <img
                                :src="downloadData.android.config_value"
                                class="image"
                            >
                            <div style="padding: 14px;">
                                <span>{{ downloadData.android.config_desc }}</span>
                            </div>
                        </el-card>
                    </el-col>
                    
                    <el-col :span="8">
                        <el-card shadow="never" :body-style="elCardStyle">
                            <img
                                :src="downloadData.app.config_value"
                                class="image"
                            >
                            <div style="padding: 14px;">
                                <span>{{ downloadData.app.config_desc }}</span>
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
            elCardStyle: {
                padding: "0px",
                "text-align": "center",
                "font-size": "16px",
                color: "rgb(30, 159, 255)"
            },
            leaderData: [],
            pandectData: {},
            dataList: {}, // 个人数据

            downloadData: {}
        };
    },
    created() {
        // this.requestInfo();
        this.init();
        this.getAppDownload();
    },
    mounted() {},
    methods: {
        init() {
            this.getPandect();
            this.getLeaderLimit();
        },

        /**
         * 获取个人信息
         */
        requestInfo() {
            this.$axios.post("Team_Data/team_data").then(data => {
                this.dataList = data.dataList;
            });
        },

        /**
         * 获取app下载的数据
         */
        getAppDownload() {
            this.$axios.post("Team_Data/app_images_url").then(data => {
                if (data.status === "error") return;

                const simple_key = {
                    codeadmin_android_images_url: "android",
                    codeadmin_app_images_url: "app",
                    codeadmin_ios_images_url: "ios"
                };

                let __downloadData = {};

                for (const [keys, values] of Object.entries(data.dataList)) {
                    __downloadData[simple_key[keys]] = values;
                }

                this.downloadData = __downloadData;
            });
        },

        /**
         * 获取团长可用额度
         */
        getLeaderLimit() {
            this.$axios.post("Team_Data/leader").then(data => {
                if (data.status === "error") return;
                this.leaderData = data.dataList.list;
            });
        },

        /**
         * 获取总览数据
         */
        getPandect() {
            this.$axios.post("Team_Data/team_data").then(data => {
                if (data.status != "OK") return;
                this.pandectData = data.dataList;
            });
        }
    }
};
</script>