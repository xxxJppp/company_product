<template>
    <div id="index_container">
		<div style="margin-bottom: 15px;">
			<span style="color: #000; font-size: 22px; margin-right: 5px;">今日统计</span>
			<span>实时统计</span>
		</div>
        <el-row :gutter="40">
            <el-col :span="8">
                <div class="grid-content" style="min-height: 220px;">
					<div class="grid-title bg-orange">
						<i class="iconfont icon-zhuzhuangtu grid-icon"></i>
						<span class="grid-name">今日利润</span>
						<span class="grid-sub-name">Today Profit</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>微信盈利：</span>
							<span class="fr">￥{{ pandectData.wx_profit }}</span>
						</li>
						<li>
							<span>支付宝盈利：</span>
							<span class="fr">￥{{ pandectData.ali_profit }}</span>
						</li>
						<!-- <li>
							<span>微信+支付宝总盈利：</span>
							<span class="fr">￥{{ pandectData.total_profit }}</span>
						</li> -->
					</ul>
				</div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content" style="min-height: 220px;">
					<div class="grid-title bg-blue">
						<i class="iconfont icon-emizhifeiji grid-icon"></i>
						<span class="grid-name">今日业绩</span>
						<span class="grid-sub-name">Performance Statistics</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>微信矿单：</span>
							<span class="fr">{{ pandectData.wx_sum }}</span>
						</li>
						<li>
							<span>支付宝矿单：</span>
							<span class="fr">{{ pandectData.ali_sum }}</span>
						</li>
						<!-- <li>
							<span>微信+支付宝总矿单：</span>
							<span class="fr">{{ pandectData.total_sum }}</span>
						</li> -->
					</ul>
				</div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content" style="min-height: 220px;">
					<div class="grid-title bg-green">
						<i class="iconfont icon-yidongyunkongzhitaiicon01 grid-icon"></i>
						<span class="grid-name">今日转换</span>
						<span class="grid-sub-name">Transformaion Statistics</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>已付矿单总数：</span>
							<span class="fr">{{ pandectData.succeed_sum }}</span>
						</li>
						<li>
							<span>未付矿单总数：</span>
							<span class="fr">{{ pandectData.failing_sum }}</span>
						</li>
						<!-- <li>
							<span>矿单合计总数：</span>
							<span class="fr">{{ pandectData.mining_sum }}</span>
						</li> -->
					</ul>
				</div>
            </el-col>
        </el-row>
		<div style="margin-bottom: 15px;">
			<span style="color: #000; font-size: 22px; margin-right: 5px;">数据统计</span>
			<span>汇总统计</span>
		</div>
		<el-row :gutter="40">
            <el-col :span="8">
                <div class="grid-content">
					<div class="grid-title bg-orange">
						<i class="iconfont icon-zhuzhuangtu grid-icon"></i>
						<span class="grid-name">利润统计</span>
						<span class="grid-sub-name">Profit Statistics</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>三天盈利：</span>
							<span class="fr">￥{{ pandectData.three_total_profit }}</span>
						</li>
						<li>
							<span>七天盈利：</span>
							<span class="fr">￥{{ pandectData.seven_total_profit }}</span>
						</li>
						<li>
							<span>三十天盈利：</span>
							<span class="fr">￥{{ pandectData.month_total_profit }}</span>
						</li>
					</ul>
				</div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
					<div class="grid-title bg-blue">
						<i class="iconfont icon-emizhifeiji grid-icon"></i>
						<span class="grid-name">业绩统计</span>
						<span class="grid-sub-name">Performance Statistics</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>微信矿单合计：</span>
							<span class="fr">{{ pandectData.month_wx_sum }}</span>
						</li>
						<li>
							<span>支付宝矿单合计：</span>
							<span class="fr">{{ pandectData.month_ali_sum }}</span>
						</li>
						<li>
							<span>微信+支付宝总矿单合计：</span>
							<span class="fr">{{ pandectData.month_total_sum }}</span>
						</li>
					</ul>
				</div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
					<div class="grid-title bg-green">
						<i class="iconfont icon-yidongyunkongzhitaiicon01 grid-icon"></i>
						<span class="grid-name">转化统计</span>
						<span class="grid-sub-name">Transformaion Statistics</span>
					</div>
					<ul class="grid-list">
						<li>
							<span>三十天已付矿单总数：</span>
							<span class="fr">{{ pandectData.month_succeed_sum }}</span>
						</li>
						<li>
							<span>三十天未付矿单总数：</span>
							<span class="fr">{{ pandectData.month_failing_sum }}</span>
						</li>
						<li>
							<span>三十天矿单合计总数：</span>
							<span class="fr">{{ pandectData.month_mining_sum }}</span>
						</li>
					</ul>
				</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
			pandectData: {},
            dataList: {} // 个人数据
        };
    },
    created() {
		this.getPandect();
        this.requestInfo();
    },
    methods: {
        /**
         * 获取个人信息
         */
        requestInfo() {
            this.$axios.post("Admin/user_info").then(data => {
                this.dataList = data.dataList;
            });
        },

		getPandect() {
			this.$axios.post('admin/admin_info').then(data => {
				if (data.status != 'OK') return;
				this.pandectData = data.dataList;
				console.log(this.pandectData)
			})
		}
    }
};
</script>