<template>
	<div class="eduit_authority">
		<ul class="clearfix">
			<li>
				<dl class="clearfix">
					<dt class="left">名称</dt>
					<dt class="right">用户组权限</dt>
				</dl>
			</li>
			<li v-for="(item, index) in dataList" :key="index" v-if="item.children">
				<dl class="big_class">
					<dd class="target_dom left">
						<i v-show="item.children.length != 0" class="default_shut"></i>
						<span :style="item.children && item.children.length > 0 ? '': 'padding-left: 20px;'" class="name cp">{{item.name}}</span>
					</dd>
					<dd class="auth_s_c right">
						<label class="ml5"><input type="checkbox" class="value_id" :value="item.id" :checked="item.status == 1 ? true : false">{{ item.statusName }}</label>
					</dd>
				</dl>
				<div v-if="item.children && item.children.length > 0" class="dn">				
					<dl class="small_class" v-for="(subitem, subindex) in item.children[0].child" :key="subindex">
						<dd class="small_name left">
							<i class="default_leaf"></i>
							<span class="name cp">{{ subitem.permission_name }}</span>
							<label class="select_all"><input type="checkbox" :checked="subitem.select_all"></label>
						</dd>
						<dd class="auth_s_c right">
							<label class="ml5"><input type="checkbox" :value="subitem.id"  class="value_id" :checked="subitem.status == 1 ? true : false">{{ subitem.statusName }}</label>
							<label class="ml5" v-for="(bitem, bindex) in subitem.child" :key="bindex"><input type="checkbox" class="value_id" :value="bitem.id" :checked="bitem.status == 1 ? true : false">{{ bitem.permission_name }}</label>
						</dd>
					</dl>
				</div>
			</li>
		</ul>
		<div class="btns-container" style="margin-top: 20px;">
			<el-button type="primary" @click="submit_data">确认</el-button>
		</div>
	</div>
</template>

<style scoped>
	.btns-container {
		margin-top:	20px;
		text-align: center;
	}
	.small_class .small_name {
		padding-left: 30px;
		text-align: left;
	}
	.eduit_authority {
		padding: 20px;
	}

	label {
		font-weight: normal;
	}
	input[type="checkbox"] {
		outline: none;
		position: relative;
		top: 2px;
		right: 2px;
	}
	.select_all {
		margin-left: 10px;
	}
	.default_shut, .default_open, .default_leaf {
		display: inline-block;
		position: relative;
		top: 2px;
		right: 3px;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
	.default_shut {
		background: url('./allbgs.png') no-repeat -48px 0px;
	}
	.default_open {
		background: url('./allbgs.png') no-repeat 0px 0px !important;
	}
	.default_leaf {
		background: url('./allbgs.png') no-repeat -16px 0px;
	}

	.left {
		float: left;
		width: 30%;
		height: 36px;
		padding-left: 10px;
		line-height: 36px;
		border: 1px solid #ccc;
	}
	.right {
		float: right;
		margin-left: -1px;
		height: 36px;
		padding-left: 10px;
		line-height: 36px;
		width: 70%;
		border: 1px solid #ccc;
	}
</style>


<script>
	export default {
		data() {
			return {
				dataList: {},
				id: '',
				default_select: []
			}
		},
		created() {
			this.get_data();
		},
		mounted() {
			this.tg_show();
		},
		methods: {
			// 请求数据
			get_data() {
				let id = parent.window.authority_id;
				this.id = id;
				this.$axios.post('Admin/showPermissionList', {
					groupId: id
				}).then(res => {
					res.children.forEach((item, index) => {
						if (item.children.length > 0) {
							item.children[0].child.forEach((subitem, subindex) => {
								let flag = true;
								subitem.child.forEach((b_item, b_index) => {
									if (b_item.status == 0) {
										flag = false;
									}
								})
								if (subitem.status == 0) {
									flag = false;
								}

								if (flag) {
									subitem.select_all = true;
								}
							})
						}
					})
					this.dataList = res.children;
					console.log(this.dataList)
				})
			},
			// 切换
			tg_show() {

				$('.eduit_authority').on('click', '.big_class .target_dom', function() {
					$(this).parent().siblings().toggleClass('dn');
					if ($(this).parent().next().hasClass('dn')) {
						$(this).find('.default_shut').removeClass('default_open')
					} else {
						$(this).find('.default_shut').addClass('default_open')
					}
				})
				$('.eduit_authority').on('click', '.select_all input', function() {
					$(this).parents('dd').siblings().find('input').prop('checked', $(this).prop('checked'))
				})
				$('.eduit_authority').on('click', '.auth_s_c input', function() {
					$(this).parents('dd').siblings().find('input').prop('checked', $(this).parents('.auth_s_c').find('input').length == $(this).parents('.auth_s_c').find('input:checked').length)
				})
			},
			// 提交
			submit_data() {
				let self = this;
				let ids = '';
				$('.value_id:checked').each((index, item) => {
					ids += $(item).val()
					ids += ','
				})
				ids = ids.slice(0, -1)

				this.$axios.post('Admin/setPermission', {
					id: ids,
					groupId: self.id
				}).then(res => {
					if(!res) {
						parent.window.is_set_auth = true;
					}
				})
			}
		}
	}
</script>