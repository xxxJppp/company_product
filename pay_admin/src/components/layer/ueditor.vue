<template>
    <div class="ueditor_container">
        <div class="ele_form">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标题名：">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <!-- <el-form-item label="日期：">
                    <el-date-picker
                        v-model="form.adddate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item> -->
				<el-form-item label="所属类型：">
                    <el-radio v-model="form.belong_type" label="0">码户</el-radio>
                    <el-radio v-model="form.belong_type" label="1">商户</el-radio>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio v-model.number="form.status" :label="0">正常</el-radio>
                    <el-radio v-model.number="form.status" :label="1">隐藏</el-radio>
                </el-form-item>
            </el-form>
        </div>

        <div class="components-container">
            <div class="editor-container">
                <UE :defaultMsg="form.content" :config="config" ref="ue"></UE>
            </div>
        </div>

        <div class="btns-container">
            <el-button type="primary" @click="submitData">确认</el-button>
        </div>
    </div>
</template>

<script>
import UE from "./UE.vue";

export default {
    components: { UE },
    data() {
        return {
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350
            },
            form: {
				belong_type: '0',	// 所属类型（0码户1商户）
                status: 0, // 0正常，1隐藏
				title: "", // 标题名
				content: "", // 修改的内容
				id: "", // 修改的id
                // adddate: "", // 时间
            }
        };
    },
    created() {
        this.init();
    },
    methods: {
        // 获取值
        init() {
			let _form = Object.assign(this.form, parent.window.__acticle_data);
			this.form = _form;
        },
        // 提交数据
        submitData() {
			this.form.content = this.$refs.ue.getUEContent();
			
			let req_url = "";
			
            switch (this.form.flag) {
                case "1":
                    req_url = "Notice/notice_add";
                    break;
                case "2":
                    req_url = "Notice/notice_edit";
                    break;
            }
            this.$axios.post(req_url, this.form).then(res => {
                if (!res) {
                    parent.window.__closeUeditor();
                }
            });
        }
    }
};
</script>