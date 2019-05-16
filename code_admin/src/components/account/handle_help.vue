<template>
    <div id="handle_help">
        <el-tabs type="border-card" v-if="dataList.list.length > 0">
            <el-tab-pane v-for="(item, index) in dataList.list" :key="index" :label="item.title" v-html="item.content">
			</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
	data() {
		return {
			dataList: { list: [] },
		}	
	},
	created() {
		this.requestList();
	},
	methods: {
		requestList() {
			this.$axios.post('Help/help_list').then(data => {
				if (data.status === 'error') return;
				this.dataList = data.dataList;
			})
		}
	},
};
</script>