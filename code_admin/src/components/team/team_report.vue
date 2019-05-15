<template>
	<div id="team_report">
		<div class="content_item">
			<div class="item_title">
				<span>团队报表</span>
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
					<label class="layui-form-label">账号：</label>
					<div class="layui-input-inline">
						<input @keyup.enter="selectData" v-model="reqData.cp_account" type="text" autocomplete="off" class="layui-input">
					</div>
				</div>

				<div v-if="mode !== 1" class="layui-inline" style="margin-left: 30px;">
                    <div class="layui-input-inline button-group" style="font-size: 12px;">
                        <!-- <span
                            class="button-group-btn active"
                            @click="changeUser({status: 1, e: $event})"
                        >团长</span> -->
                        <span
                         class="button-group-btn active"
                         @click="changeUser({status: 2, e: $event})"
                        >组长</span>

						<span
                         class="button-group-btn"
                         @click="changeUser({status: 3, e: $event})"
                        >组员</span>
                    </div>
                </div>

				 <div class="layui-inline">
					<button @click="selectData()" style="padding: 0 20px; margin-left: 25px;" class="layui-btn layui-btn-sm layui-btn-normal">查询</button>
                </div>

				<div class="connect_div">
					<div v-if="selectArr.length > 1" style="margin-bottom: 10px;">
						搜索导航：
						<span
							v-for="(item, index) in selectArr"
							:key="index"
							@click="navClick(index)"
						>
							<i v-if="index !== 0"> > </i>
							<i class="cp underline">{{ item.name }}</i>
						</span>
					</div>

					<table class="layui-table">
						<thead>
							<tr>
								<th>账号</th>
								<th>昵称</th>
								<th>成交总量</th>
								<th>返点</th>
								<th>利润</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="index">
								<!-- <td v-if="item.is_click">
									<span class="account_name">
										<i class="_info" @click="select_sub(item.id, item.cp_account)">{{ item.cp_account }}</i>
										<i class="bubble" v-if="item.sub_count > 0">{{ item.sub_count > 99 ? '99+' : item.sub_count }}</i>
									</span>
								</td>
								<td v-if="!item.is_click">
									<span class="account_name">
										<i>{{ item.cp_account }}</i>
										<i class="bubble" v-if="item.sub_count > 0">{{ item.sub_count > 99 ? '99+' : item.sub_count }}</i>
									</span>
								</td> -->
								<!-- <td>{{ item.cp_nickname }}</td> -->
								<td class="f_bold" v-text="item.cp_account"></td>
								<!-- <td v-text="item.pay_unfinished"></td> -->
								<td v-text="item.cp_nickname"></td>
								<td v-text="item.pay_money"></td>
								<td v-text="item.wx_rebate"></td>
								<td class="red" v-text="item.profit"></td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>暂时没有团队报表信息！</p>
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
			mode: null,

			layForm: null,
			dataList: { list: [] },
			selectArr: [],
			reqData: {
				prompt: true,
				start_time: this.$m.getRangeTime(0).t1,	// 开始时间
				end_time: this.$m.getRangeTime(0).t1,	// 结束时间
				cp_account: '',			// 账号
				id: '',					// 查询下级的id
				type: 1,
				page: 1,
				pageSize: 100,
			}
		};
	},
	created() {
		this.init();
	},
	mounted() {
		this.layui_init();
	},
	updated() {
        this.layForm && this.layForm.render();
    },

	methods: {
		/**
		 * 初始化
		 */
		init() {
			const route = this.$route;
			this.mode = route.query.mode

			if (route.query.mode !== 1) {
				this.reqData.type = 2;
			}

			this.requestList();
			this.selectArr = [
				{
					id: '',
					name: $.cookie('code_name')
				}
			]
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
			this.$axios.post("team/team_list", this.reqData).then(data => {
				if(data.status == 'error') return;
				this.dataList = data.dataList;
			});
		},

		/**
		 * 导航条点击
		 */
		navClick(index) {
			this.selectArr = this.selectArr.slice(0, index + 1);
			this.reqData.id = this.selectArr[index].id;
			this.requestList();	

		},

		/**
		 * 查询数据
		 */
		selectData() {
			this.reqData.page = 1;
			this.reqData.id = '';
			this.selectArr = this.selectArr.slice(0, 1);
			this.requestList();	
		},

		/**
         * 改变用户
         */
        changeUser({ status, e }) {
            this.reqData.type = status;
            $(e.currentTarget)
                .addClass("active")
                .siblings()
                .removeClass("active");
            this.requestList();
        },

		/**
		 * 查询下级
		 */
		select_sub(id, name) {
			this.selectArr.push({
				id, name
			});
			this.reqData.cp_account = '';
			this.reqData.id = id;
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