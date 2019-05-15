<template>
	<div class="admin">
		<div v-if="show_index">
			
		</div>
		<div v-if="!show_index">
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				dataList: {},
				show_index: false
			}
		},
		created () {
			this.request_data();
		},
		mounted () {
			this.flag = true;
			layer.closeAll('loading')
		},
		methods: {
			// 请求数据
			request_data() {
				let self = this;
				this.$axios.post('/Admin/authority', {token: $.cookie('token')}).then( res =>{
					let children = res.children;
					let showIndex = children.some(item => {
						if (item.path === 'index') {
							return true
						}
					});
					this.show_index = showIndex;
				})
			},

		}
	}
</script>