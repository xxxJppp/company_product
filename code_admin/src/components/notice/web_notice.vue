<template>
	<div id="web_notice">
		<div class="content_item">
			<div class="item_title">
				<span>站内公告</span>
			</div>
			<div class="layui-form item_content" style="padding: 15px 15px 40px;">
				<!-- <el-collapse accordion style="margin-top: -1px;" @change="collapseChange" v-if="dataList.list.length > 0">
					<el-collapse-item v-for="(item, index) in dataList.list" :key="index" :name="item.id">
						<template slot="title"> 
							<span class="collapse_title">{{ item.title }}</span>
							<span style="font-size: 12px; margin-left: 10px;">{{ item.create_time }}</span>
						</template>
						<div style="padding: 0 20px;" v-html="item.content"></div>
					</el-collapse-item>
				</el-collapse>-->
				<ul class="msg_list">
					<li
						v-show="dataList.list.length > 0"
						v-for="(item, index) in dataList.list"
						:key="index"
						:class="{
							unRead: item.is_read == '0',
						}"
						@click="collapseChange(item)"
					>
						<div class="c">
							<div class="title_c">
								<p class="title">{{ item.title }}</p>
								<span class="list_time">{{ item.create_time }}</span>
							</div>
						</div>
					</li>

					<li
						v-show="dataList.list.length <= 0"
						style="text-align: center; padding: 60px 0;"
					>
						<img src="../../assets/images/icon/nodate.png" alt="">
						<p style="margin-top: 15px;">暂时没有站内公告信息</p>
					</li>

				</ul>
			</div>
			<div id="page" class="fr" style="bottom: 4px;">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="reqData.page"
					:page-sizes="$d.pageSizes"
					:page-size="reqData.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="dataList.sum"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dataList: { list: [] },

			reqData: {
				prompt: true,
				page: 1,
				pageSize: 100
			}
		};
	},
	created() {

		this.requestList();
	},
	methods: {
		/**
		 * 请求列表数据
		 */
		requestList() {
			this.$axios.post("Notice/notice_list", this.reqData).then(data => {
				this.dataList = data.dataList;
			});
		},

		/**
		 * 当消息展开时触发
		 * @param {string,number} id
		 * @param {object} e 当前事件对象
		 */
		collapseChange(item) {
			if(item.is_read == '0') {
				item.is_read = '1';
				this.yetRead(item.id);
			}
			layer.open({
				type: 1
				,title: false //不显示标题栏
				,closeBtn: 1
				,area: '700px;'
				,shade: 0.7
				,id: 'LAY_layuipro' //设定一个id，防止重复弹出
				,btn: false
				,btnAlign: 'c'
				,moveType: 1 //拖拽模式，0或者1
				,content: `
				<div style="line-height: 22px; font-weight: 300; font-size: 14px; color: #000;">
					<div style="text-align: center; line-height: 40px; background-color: #efebef; color: #000; font-weight: bold; font-size: 16px;">
						公告 ${item.title}
					</div>
					<div style="padding: 25px 20px;">
						<div style="border-bottom: 1px dashed #a09e9e; padding-bottom: 10px;">
							<i class="layui-icon">&#xe63c;</i>
							发布时间：${item.create_time}
						</div>
						<div class="custom_bar" style="margin-top: 20px; padding-right: 15px; min-height: 200px; max-height: 660px; overflow: auto">
							${item.content}
						</div>
					</div>
					
				</div>`
		  	});
		},

		/** 
		 * 已读取消息
		 * @param {string,number} id
		*/
		yetRead(id) {
			this.$axios.post('Notice/notice_read', {
				id
			}).then(res => {
			})
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