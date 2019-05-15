<template>
	<div>
		<div class="content_item">
			<div class="item_title">
				<span>挖矿记录</span>

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
						<input v-model="reqData.cp_account" type="text" autocomplete="off" class="layui-input">
					</div>
				</div>

                <!-- <div class="layui-inline">
					<label class="layui-form-label">商户订单号：</label>
					<div class="layui-input-inline">
						<input v-model="reqData.mch_order_number" type="text" autocomplete="off" class="layui-input">
					</div>
				</div> -->

                <!-- <div class="layui-inline">
                    <label class="layui-form-label">支付状态：</label>
                    <div class="layui-input-inline">
                        <select lay-filter="payType">
                            <option value="">全部状态</option>
                            <option value="0">正常</option>
                            <option value="1">超时</option>
                            <option value="2">废弃</option>
                        </select>
                    </div>
                </div> -->

                <!-- <div class="layui-inline">
                    <label class="layui-form-label">支付方式：</label>
                    <div class="layui-input-inline">
                        <select lay-filter="payWay">
                            <option value="">全部方式</option>
                            <option value="0">微信定额收款码</option>
                            <option value="1">微信不定额收款码</option>
                            <option value="2">支付宝定额收款码</option>
                            <option value="3">支付宝不定额收款码</option>
                        </select>
                    </div>
                </div> -->

                <div class="layui-inline">
					<button @click="selectData()" style="padding: 0 20px; margin-left: 25px;" class="layui-btn layui-btn-sm layui-btn-normal">查询</button>
                </div>

				<div class="connect_div">
					<table class="layui-table">
						<thead>
							<tr>
								<th>账号</th>
								<th>昵称</th>
								<th>矿单编号</th>
								<th>已收款</th>
								<th>利润</th>
								<th>下单时间</th>
								<th>支付方式</th>
								<!-- <th>二维码</th>
								<th>上传二维码</th> -->
								<!-- <th>支付成功</th> -->
								<th>状态</th>
							</tr>
						</thead>
						<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
							<tr v-for="(item, index) in dataList.list" :key="index">
								<td v-text="item.cp_account"></td>
								<td v-text="item.cp_nickname"></td>
								<td v-text="item.cp_order_no"></td>
								<td class="red f_bold" v-text="item.pay_money"></td>
								<td class="red f_bold">{{ (+item.pay_money - +item.return_money).toFixed(2) }}</td>
								<td v-text="item.create_time"></td>
								<td v-text="item.pay_mode"></td>
								<!-- <td>
		                            <span v-if="item.qr_code" class="_info cp" @click="look(item.qr_code)">查看</span>
		                        </td>
								<td :class="$d.tg['has_upload_color'][item.has_upload]" v-text="$d.tg['has_upload'][item.has_upload]"></td> -->
								<td :class="$d.tg['has_pay_color'][item.has_pay]" v-text="$d.tg['has_pay'][item.has_pay]"></td>
								<!-- <td :class="$d.tg['pay_status_color'][item.status]" v-text="$d.tg['pay_status'][item.status]"></td> -->
								<!-- <td>
									<button class="layui-btn layui-btn-xs" @click="editAccount(item)"><i class="layui-icon">&#xe642;</i> 编辑</button>
									<button class="layui-btn layui-btn-xs layui-btn-del auth_del" @click="delAccount([item.id])"><i class="layui-icon">&#xe640;</i> 删除</button>
								</td> -->
							</tr>
							
							<tr>
								<td>本页合计</td>
								<td></td>
								<td></td>
								<td class="red f_bold">{{ dataList.page_sum.pay_money }}</td>
								<td class="red f_bold">{{ dataList.page_sum.profit_money }}</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>总合计</td>
								<td></td>
								<td></td>
								<td class="red f_bold">{{ dataList.count.pay_money }}</td>
								<td class="red f_bold">{{ dataList.count.profit_money }}</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>

						<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
							<tr class="no_data">
								<td colspan="99">
									<img src="../../assets/images/icon/nodate.png">
									<p>暂时没有挖矿记录！</p>
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
			dataList: {},
			reqData: {
				prompt: true,
				start_time: this.$m.getRangeTime(0).t1,	// 开始时间
				end_time: this.$m.getRangeTime(0).t1,	// 结束时间

				cp_account: '',			// 账号
				mch_order_number: '',	// 商户订单号
				status: '0',			// 状态（0正常1超时2废弃）
				pay_mode: '',			// 支付方式

				page: 1,
				pageSize: 100,
			}
		};
	},
	created() {
		this.requestList();
	},
	mounted() {
		this.layui_init();
	},
	updated() {
        this.layForm && this.layForm.render();
    },

	methods: {
		/**
         * layui初始化
         */
        layui_init() {
            layui.use(["form", "laydate"], () => {
                let form = layui.form;
				this.layForm = form;
				
				// form.on('select(payType)', (data) => {
				// 	this.reqData.status = data.value;
				// });
				// form.on('select(payWay)', (data) => {
				// 	this.reqData.pay_mode = data.value;
				// });

				form.render();

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
		 * 请求挖矿记录
		 * closePrompt: 是否关闭加载页面
		 */
		requestList(closePrompt) {
			this.reqData.prompt = closePrompt ? false : true;
			
			this.$axios.post("Mining/mining_list", this.reqData).then(data => {
				if(data.status == 'error') return;
				this.dataList = data.dataList;
			});
		},

		look(imgId) {
            this.$axios.post(`Mining/qrcode_images`, {
                qr_code: imgId
            }) .then(data => {
				if (data.status === 'error') return;
				
				const dataList = data.dataList;

                const JSON = {
                    title: "支付二维码", //相册标题
					id: 123, //相册id
                    data: [
                        {
                            alt: "支付二维码",
                            pid: 666, //图片id
                            src: dataList.url, //原图地址
                            thumb: dataList.url //缩略图地址
                        }
                    ]
                };
                layer.photos({
					photos: JSON,
					shade: 0.5,
                    anim: 5
                });
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