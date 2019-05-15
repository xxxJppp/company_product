<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">当前位置： 商户管理 >
				<span>闲置商户</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<!-- 头部 -->
			<div class="common_title clearfix">

				

				<!-- 商户账号 -->
				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input @keyup.enter.native="request_data" v-model="form.mch_account" placeholder="商户账号"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="fl" style="margin-left: 20px;">
					<span>天数：</span>
			    	<el-radio-group v-model="form.day" size="small" @change="dayChange">
			    		<el-radio label="1" border>一天</el-radio>
			    		<el-radio label="2" border>两天</el-radio>
			    		<el-radio label="3" border>三天</el-radio>
			    		<el-radio label="7" border>一周</el-radio>
			    	</el-radio-group>
			 	</div>

				<!-- 搜索按钮 -->
				<a @click="select_data" href="javascript:void(0)" style="margin-left: 20px;" class="select_btn fl"><i class="el-icon-search"></i> &nbsp;搜索</a>

			</div>

			<table width="100%" class="common_table">
				<!-- <colgroup>
					<col width="25" />
				</colgroup> -->
				<thead>
					<tr>
						<!-- <th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
						</th> -->
						<th>商户ID</th>
						<th>商户账号</th>
						
						<th>创建时间</th>
						<th>最后登录时间</th>
						<th>最后登录ip</th>
						<th>状态</th>
					</tr>
				</thead>

				<tbody class="common_tbody">
					<tr v-if="dataList.list" v-show="dataList.list.length > 0" v-for="(item, index) in dataList.list" :key="index">
						<!-- <td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
						</td> -->
						<td>{{ item.mch_id }}</td>
						<td>{{ item.mch_account }}</td>
						<td>{{ item.create_time }}</td>
						<td>{{ item.last_login_time }}</td>
						<td>{{ item.last_login_ip }}</td>
						<td :class="$cm_d.tg['mch_status_color'][item.status]">{{ $cm_d.tg['mch_status'][item.status] }}</td>
					</tr>
					

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>暂时没有闲置商户列表信息</p>
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
				:total="dataList.sum">
				</el-pagination>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: {},				// 列表数据
				is_select_all: false,		// 是否选择全部
				checked_data: [],			// 选择数据
				disabled_member: false,		// 是否查询禁止登陆用户

				closeList: [],				// 结算方式列表
				form: {
					prompt: true,			// 加载层
					day: '1',				// 天数
					mch_account: '',			// 用户名
					page: 1,					// 页数
					pageSize: 100				// 页容量
				}
			}
		},
		created() {
			this.request_data();
		},
		computed: {
			
		},
		methods: {
			// 请求列表数据
			request_data() {
				this.$axios.post('Merchant/mch_leisure', this.form).then((res) => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				})
			},
			
			// 查询数据
			select_data() {
				this.form.page = 1;
				this.request_data();
			},

			dayChange(val) {
				this.request_data();
			},

			// 分页
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
	}
</script>