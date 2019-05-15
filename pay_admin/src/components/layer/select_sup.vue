<template>
	<div class="allot_container" style="padding: 20px;">
		<div style="margin-bottom: 20px;">
			<el-select
			 v-if="showSelect"
			 v-model="form.sup_account"
			 placeholder="总团长"
			 @change="select_data()"
			 style="margin-right: 20px;">
				<el-option label="全部" value=""></el-option>
				<el-option v-for="(item, index) in leaderList" :label="item.cp_account" :value="item.cp_account" :key="index"></el-option>
			</el-select>


			<el-input style="width: 180px;" v-model="form.cp_account" placeholder="码户账号"></el-input>

			<el-button type="primary" class="ml20" @click="select_data">搜索</el-button>
		</div>
		<div>
			<table class="common_table" style="width: 100%">
				<thead>
					<tr>
						<th>码户账号</th>
						<th>昵称</th>
						<th>用户等级</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length > 0">
					<tr v-for="(item, index) in dataList.list" :key="index">
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>
						<td>{{ item.relation }}</td>
						<td>
							<span class="open_btn cp" @click="check(item.cp_account)"><i class="el-icon-check"></i>确认</span>
						</td>
					</tr>
				</tbody>
				<tbody
				 v-if="dataList.list"
				 v-show="dataList.list.length <= 0">
					<tr>
						<td colspan="99">搜索不到该用户</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="fr" style="margin-bottom: 8px;">
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
	</div>
</template>

<script>
	const DATA = top.window.__selectSupData;
	
	export default {
		data() {
			return {
				leaderList: [],			// 总团长列表
				dataList: {},

				showSelect: false,		// 是否显示选择团长

				form: {
					type: null,
					cp_account: '',		// 码户账号
					sup_account: '',	// 总团长账号
					page: 1,
					pageSize: 100,
					prompt: true,
				}
			}
		},
		created() {
			this.init();
			this.request_data();
			this.getLeader();
		},
		methods: {
			/**
			 * 初始化
			 */
			init() {
				this.form.type = DATA.type;
				this.showSelect = DATA.sup_account === null;
				this.form.sup_account = DATA.sup_account;
			},

			/**
			 * 获取总团长
			 */
			getLeader() {
				this.$axios.post('Code_Provider/set_sub_acoount', {
					type: 1,
				}).then(res => {
					this.leaderList = res.list;
				})
			},
			
			// 请求数据
			request_data() {
				this.$axios.post('Code_Provider/set_sub_acoount', this.form).then(res => {
					this.dataList = res;
				})
			},

			select_data() {
				this.form.page = 1;
				this.request_data();
			},

			/**
			 * 确认
			 */
			check(cp_account) {
				top.window.__selectSupOver(cp_account)
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
	}
</script>