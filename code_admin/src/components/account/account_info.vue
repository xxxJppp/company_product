<template>
	<div>
		<!-- <div class="content_item">
			<div class="item_title">
				<span>团队成员列表</span>
			</div>
			
		</div> -->
		<div class="content_item">
			<div class="item_title">
				<span>充值记录</span>
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
                        <input type="text" class="layer-time layui-input" id="endTime" autocomplete="off" readonly>
                    </div>
                </div>


				<div class="layui-inline">
					<label class="layui-form-label" style="width: 70px">账号：</label>
					<div class="layui-input-inline">
						<input @keyup.enter="selectData" v-model="reqData.cp_account" type="text" autocomplete="off" class="layui-input">
					</div>
				</div>

				 <div class="layui-inline">
					<button @click="selectData()" style="padding: 0 20px; margin-left: 25px;" class="layui-btn layui-btn-sm layui-btn-normal">查询</button>
                </div>

				<div class="connect_div">
					<table class="layui-table">
						<thead>
							<tr>
								<th>账号</th>
								<th>昵称</th>
								<th>类型</th>
								<th>时间</th>
								<th>变动</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="index">
								<td v-text="item.cp_account"></td>
								<td v-text="item.cp_nickname"></td>
								<td v-text="item.pay_mode"></td>
								<td v-text="item.change_time"></td>
								<td :class="+item.change_money > 0 ? 'green' : 'red'" v-text="+item.change_money > 0 ? `+${item.change_money}` : item.change_money"></td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>暂时没有账户明细列表！</p>
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
					    :total="dataList.sum">
					    </el-pagination>
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
			layForm: null,
			dataList: {list:[]},
			rebateList: [],	// 返点列表
			reqData: {
				prompt: true,
				start_time: this.$m.getRangeTime(0).t1,	// 开始时间
				end_time: this.$m.getRangeTime(0).t1,	// 结束时间
				cp_account: '',
				page: 1,
				pageSize: 100,
			}
		};
	},
	created() {
		this.requestList();

		this.intervalId = setInterval(() => {
			this.requestList();
		}, 60000)
	},
	mounted() {
		this.layui_init();
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
	},
	methods: {
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
		 * 请求商户订单列表
		 * closePrompt: 是否关闭加载页面
		 */
		requestList(closePrompt) {
			this.reqData.prompt = closePrompt ? false : true;
			
			this.$axios.post("Money_Change/money_change", this.reqData).then(data => {
				this.dataList = data.dataList;
			});
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