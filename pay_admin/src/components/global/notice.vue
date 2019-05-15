<template>
    <div>
        <div class="listbiaoti am-cf">
            <dl class="am-icon-home" style="float: left;">
                当前位置： 全局管理 >
                <span>公告管理</span>
            </dl>
        </div>
        <form class="am-form am-g">
            <!-- 头部 -->
            <div class="common_title clearfix">
				<!-- 新增商户 -->
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button @click="add" class="auth_add" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>

                <!-- 时间 -->
                <div class="time_container fl clearfix">
                    <span class="demonstration">日期：</span>
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        size="small"
                        v-model="form.date"
                        type="daterange"
                        :picker-options="pickerOptions2"
                        range-separator="至"
                        align="right"
                    ></el-date-picker>
                </div>

                <!-- 支付状态 -->
                <div class="lottery_status fl ml10">
                    <el-form :inline="true" size="small" :model="form">
                        <el-form-item>
                            <el-select v-model="form.belong_type" placeholder="所属类型">
                                <el-option label="码户" value="0"></el-option>
                                <el-option label="商户" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 搜索按钮 -->
                <a @click="select_data" href="javascript:void(0)" class="select_btn">
                    <i class="el-icon-search"></i> &nbsp;搜索
                </a>
            </div>

            <table width="100%" class="common_table">
                <!-- <colgroup>
					<col width="25" />
                </colgroup>-->
                <thead>
                    <tr>
                        <!-- <th>
							<input type="checkbox" @click="checked_all" v-model="is_select_all"/>
                        </th>-->
                        <th>ID</th>
                        <th>标题</th>
                        <th>添加时间</th>
                        <th class="control_T">操作</th>
                    </tr>
                </thead>

                <tbody class="common_tbody">
                    <tr
                        v-if="dataList.list"
                        v-show="dataList.list.length > 0"
                        v-for="(item, index) in dataList.list"
                        :key="index"
                    >
                        <!-- <td>
							<input type="checkbox" :value="item.id" @change="checked_one" v-model="checked_data"/>
                        </td>-->
                        <td>{{ item.id }}</td>
                        <td>
                            <span @click="noticeLayer(item)" class="_info">{{ item.title }}</span>
                        </td>
                        <td>{{ item.create_time }}</td>
                        <td class="control_C">
							<span class="auth_eduit editor_btn cp ml5" @click="edit(item)"><i class="el-icon-edit-outline"></i> 编辑</span>
							<span class="auth_del remove_btn cp ml5" @click="remove([item.id])"><i class="el-icon-delete"></i> 删除</span>
                        </td>
                    </tr>

                    <tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
                        <td colspan="99">
                            <img src="../../statics/images/icon/nodate.png">
                            <p>暂时没有公告记录</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="am-btn-group am-btn-group-xs"></div>

            <div class="fr">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="form.page"
                    :page-sizes="$cm_d.pageSize"
                    :page-size="form.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataList.sum"
                ></el-pagination>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: {}, // 列表数据

            is_select_all: false, // 是否选择全部
            checked_data: [], // 选择数据
            // 时间
            pickerOptions2: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            let time1 = new Date();
                            let Y1 = time1.getFullYear();
                            let M1 =
                                time1.getMonth() + 1 >= 10
                                    ? time1.getMonth() + 1
                                    : "0" + (time1.getMonth() + 1);
                            let D1 =
                                time1.getDate() >= 10
                                    ? time1.getDate()
                                    : "0" + time1.getDate();
                            let timer1 = Y1 + "-" + M1 + "-" + D1; // 当前时间
                            const start = timer1;
                            const end = timer1;
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            let time2 = new Date();
                            time2.setTime(
                                time2.getTime() - 24 * 60 * 60 * 1000 * 1
                            );
                            let Y2 = time2.getFullYear();
                            let M2 =
                                time2.getMonth() + 1 >= 10
                                    ? time2.getMonth() + 1
                                    : "0" + (time2.getMonth() + 1);
                            let D2 =
                                time2.getDate() >= 10
                                    ? time2.getDate()
                                    : "0" + time2.getDate();
                            let timer2 = Y2 + "-" + M2 + "-" + D2; // 之前的7天或者30天
                            const start = timer2;
                            const end = timer2;
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "前天",
                        onClick(picker) {
                            let time2 = new Date();
                            time2.setTime(
                                time2.getTime() - 24 * 60 * 60 * 1000 * 2
                            );
                            let Y2 = time2.getFullYear();
                            let M2 =
                                time2.getMonth() + 1 >= 10
                                    ? time2.getMonth() + 1
                                    : "0" + (time2.getMonth() + 1);
                            let D2 =
                                time2.getDate() >= 10
                                    ? time2.getDate()
                                    : "0" + time2.getDate();
                            let timer2 = Y2 + "-" + M2 + "-" + D2; // 之前的7天或者30天
                            const start = timer2;
                            const end = timer2;
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            form: {
                prompt: true, // 加载层
                date: [
                    this.$cm_m.getRangeTime(0).t2,
                    this.$cm_m.getRangeTime(0).t2
                ], // 时间

                belong_type: "0", // 商户账号

                page: 1, // 页数
                pageSize: 100 // 页容量
            }
        };
    },
    created() {
        this.request_data();
    },
    computed: {},
    methods: {
        // 请求列表数据
        request_data() {
            this.$cm_m.toggle_time(this);
            this.$axios.post("Notice/notice_list", this.form).then(res => {
                console.log(res);
                this.dataList = res;
                this.$cm_m.auth_btn();
            });
        },

        // 查询数据
        select_data() {
            this.form.page = 1;
            this.request_data();
        },

        // 全选按钮
        checked_all() {
            this.is_select_all = !this.is_select_all;
            if (this.is_select_all) {
                this.dataList.list.forEach(item => {
                    if (!this.checked_data.includes(item.id))
                        this.checked_data.push(item.id);
                });
            } else this.checked_data = [];
        },
        // 单选按钮
        checked_one() {
            if (this.dataList.list.length === this.checked_data.length)
                this.is_select_all = true;
            else this.is_select_all = false;
		},
		
		/**
		 * 添加公告
		 */
		add() {
			layer.open({
				type: 1,
				title: '添加公告',	
				area: ['780px', '430px'],
				btn: ['添加'],
				content: `
					<div class="__layer add_notice">
						<div class="item mb15">
							<span class="__layer_title" style="width: 80px;">所属类型：</span>
							<input type="radio" id="radio_status_1" class="__layer_radio" name="notice_status" value="0"> 
							<label style="margin-right: 20px;" for="radio_status_1">码户</label>

							<input type="radio" id="radio_status_2" class="__layer_radio" name="notice_status" value="1"> 
							<label for="radio_status_2">商户</label>
						</div>
						<div class="item mb15">
							<span class="__layer_title" style="width: 80px;">标题：</span>
							<input class="__layer_input title" type="text" autocomplete="off"/>
						</div>
						<div class="item mb0">
							<span class="__layer_title" style="width: 80px;">内容：</span>
							<textarea class="content" style="line-height: 18px; width: 637px; height: 200px; padding: 8px;"></textarea>
						</div>
					</div>
				`,
				yes: (lay_index) => {
					let type = $('.add_notice [name=notice_status]:checked').val(),
						title = $('.add_notice .title').val(),
						content = $('.add_notice .content').val();

					if (type == '') {return layer.msg('请选择公告所属类型', {time: 1500, icon: 2})};
					if (title == '') {return layer.msg('请输入公告标题', {time: 1500, icon: 2})};
					if (content == '') {return layer.msg('请输入公告内容', {time: 1500, icon: 2})};

					this.$axios.post('Notice/notice_add', {
						title,
						content,
						belong_type: type
					}).then(res => {
						if (!res) {
							setTimeout(() => {
								layer.close(lay_index);
								this.request_data();
							}, 1500)
						}
					})
				}
			})
		},

		

		/**
		 * 编辑公告
		 */
		edit(dataObj) {
			layer.open({
				type: 1,
				title: '编辑公告',	
				area: ['780px', '430px'],
				btn: ['确定'],
				content: `
					<div class="__layer edit_notice">
						<div class="item mb15">
							<span class="__layer_title" style="width: 80px">标题：</span>
							<input class="__layer_input title" value="${dataObj.title}" type="text" autocomplete="off"/>
						</div>
						<div class="item mb0">
							<span class="__layer_title fl" style="width: 80px">内容：</span>
							<div contenteditable="true" class="div_text_content">${dataObj.content}</div>
						</div>
					</div>
				`,
				yes: (lay_index) => {
					let title = $('.edit_notice .title').val(),
						content = $('.edit_notice .div_text_content').html();

					if (title == '') {return layer.msg('请输入公告标题', {time: 1500, icon: 2})};
					if (content == '') {return layer.msg('请输入公告内容', {time: 1500, icon: 2})};

					this.$axios.post('Notice/notice_edit', {
						id: dataObj.id,
						title,
						content,
					}).then(res => {
						if (!res) {
							setTimeout(() => {
								layer.close(lay_index);
								this.request_data();
							}, 1500)
						}
					})
				}
			})
		},

		/**
		 * 删除公告
		 */
		remove(delArr) {
			layer.confirm('是否删除所选公告？', {icon: 7, title: '删除'}, lay_index => {
				this.$axios.post('Notice/notice_del', {
					id: delArr
				}).then(res => {
					if (!res) {
						setTimeout(() => {
							this.select_data();
						}, 1500)
					}
				})
			})
		},

        /**
         * 公告弹框
         */
        noticeLayer(item) {
            if (item.is_read == "0") {
                item.is_read = "1";
                this.yetRead(item.id);
            }
            layer.open({
                type: 1,
                title: false, //不显示标题栏
                closeBtn: 1,
                area: "700px;",
                shade: 0.7,
                id: "LAY_layuipro", //设定一个id，防止重复弹出
                btn: false,
                btnAlign: "c",
                moveType: 1, //拖拽模式，0或者1
                content: `
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
};
</script>