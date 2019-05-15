<template>
	<div>
		<!-- <div class="content_item">
			<div class="item_title">
				<span>团队成员列表</span>
			</div>
			
		</div> -->
		<div class="content_item">
			<div class="item_title">
				<span>在线成员</span>
			</div>
			<div class="layui-form item_content">
				<div class="layui-inline">
					<label class="layui-form-label" style="width: 70px">账号：</label>
					<div class="layui-input-inline">
						<input @keyup.enter="selectData" v-model="reqData.cp_account" type="text" autocomplete="off" class="layui-input">
					</div>
				</div>

				 <div class="layui-inline">
					<button @click="selectData()" style="padding: 0 20px; margin-left: 25px;" class="layui-btn layui-btn-sm layui-btn-normal">查询</button>
                </div>

            </div>
		</div>
		<div class="content_item">
			<div class="item_title">
				<span class="fl">在线成员列表</span>
			</div>
			
			<div class="layui-form item_content" style="padding: 15px 15px 40px;">
				<table class="layui-table">
					<thead>
						<tr>
							<th>账号</th>
							<th>上级账号</th>
							<th>返点/微信</th>
							<th>返点/支付宝</th>
							<th>押金数额</th>
							<th>收款额度</th>
							<th>创建时间</th>
							<th>最后登录时间</th>
						</tr>
					</thead>
					<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
						<tr v-for="(item, index) in dataList.list" :key="index">
							<td v-text="item.cp_account"></td>
							<td v-text="item.cp_top_account"></td>
							<td v-text="item.wx_rebate"></td>
							<td v-text="item.ali_rebate"></td>
							<td class="red" v-text="item.deposit_amount"></td>
							<td class="red f_bold" v-text="item.gather_amount_limit"></td>
							<td v-text="item.create_time"></td>
							<td v-text="item.last_login_time"></td>
						</tr>
					</tbody>

					<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
						<tr class="no_data">
							<td colspan="99">
								<img src="../../assets/images/icon/nodate.png">
								<p>暂时没有在线成员！</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
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
				cp_account: '',
				page: 1,
				pageSize: 100,
			}
		};
	},
	created() {
		this.requestList();
		this.getRebate();

		this.intervalId = setInterval(() => {
			this.requestList();
		}, 60000)
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
	},
	methods: {
		/**
		 * 请求商户订单列表
		 * closePrompt: 是否关闭加载页面
		 */
		requestList(closePrompt) {
			this.reqData.prompt = closePrompt ? false : true;
			
			this.$axios.post("Code_provider/code_provider_online", this.reqData).then(data => {
				this.dataList = data.dataList;
			});
		},

		/**
		 * 获取返点比例下拉
		 */
		getRebate() {
			// this.$axios.post('Code_provider/cp_rebate').then(data => {
			// 	if(data.status == 'error') return;
			// 	this.rebateList = data.dataList.list;
			// })
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