<template>
	<div id="team_report">
		<div class="content_item">
			<div class="item_title">
				<span>二维码管理</span>
			</div>
			<div class="layui-form item_content">

				<div class="layui-inline fl" style="margin-left: 15px; margin-right: -20px;">
					<button class="layui-btn layui-btn-sm" @click="add()">
						<i class="layui-icon">&#xe608;</i> 添加二维码
					</button>
				</div>

				<div class="layui-inline">
					<label class="layui-form-label">账号：</label>
					<div class="layui-input-inline">
						<input @keyup.enter="selectData" v-model="reqData.cp_account" type="text" autocomplete="off" class="layui-input">
					</div>
				</div>

				 <div class="layui-inline">
					<button @click="selectData()" style="padding: 0 20px; margin-left: 25px;" class="layui-btn layui-btn-sm layui-btn-normal">查询</button>
                </div>

            </div>
		</div>
		<div class="content_item">
			<div class="item_title">
				<span>列表</span>
			</div>
			<div class="layui-form item_content" style="padding: 15px 15px 40px;">
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
							<th>码户账号</th>
							<th>账号类型</th>
							<th>支付方式</th>
							<th>支付金额</th>
							<th>支付二维码</th>
						</tr>
					</thead>
					<tbody v-if="dataList.list" v-show="dataList.list.length > 0">
						<tr v-for="(item, index) in dataList.list" :key="index">
							<td v-text="item.cp_account"></td>
							<td v-text="item.account_type"></td>
							<td v-text="item.pay_mode"></td>
							<td v-text="item.pay_money"></td>
							<td>
								<span class="_info cp" @click="look(item.pay_url)">查看</span>
							</td>
						</tr>
					</tbody>

					<tbody v-if="dataList.list" v-show="dataList.list.length <= 0">
						<tr class="no_data">
							<td colspan="99">
								<img src="../../assets/images/icon/nodate.png">
								<p>暂时没有二维码列表信息！</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
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
</template>

<script>
export default {
	data() {
		return {
			layForm: null,
			dataList: { list: [] },
			selectArr: [],
			reqData: {
				prompt: true,
				cp_account: '',			// 账号
				page: 1,
				pageSize: 100,
			}
		};
	},
	created() {
		this.requestList();
	},
	mounted() {
	},
	updated() {
        this.layForm && this.layForm.render();
    },

	methods: {
		/**
		 * 请求团队报表信息
		 * closePrompt: 是否关闭加载页面
		 */
		requestList() {
			this.$axios.post("Qrcode/qr_code_manage", this.reqData).then(data => {
				if(data.status == 'error') return;
				this.dataList = data.dataList;
			});
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

		add() {
			const containerHeight = 160;
			let isShow = false,
				dataArr = [],
				interval_id,
				overload = false;

			function hideList() {
				isShow = false;
				$('.addQrcode .hidden_container > .item').css({
					'visibility': 'hidden',
					'height': 0 + 'px'
				});
				$('#add_qrcode').css({ 'height': $('#add_qrcode').outerHeight(true) - containerHeight + 'px' });
				$('#add_qrcode').parents('.layui-layer').css({ 'height': $('#add_qrcode').parents('.layui-layer').outerHeight(true) - containerHeight + 'px' });
			};

			function showList() {
				if (isShow) { return };
				isShow = true;
				$('.addQrcode .hidden_container > .item').css({
					'visibility': 'initial',
					'height': containerHeight + 'px'
				});
				$('#add_qrcode').css({ 'height': $('#add_qrcode').outerHeight(true) + containerHeight + 'px' });
				$('#add_qrcode').parents('.layui-layer').css({ 'height': $('#add_qrcode').parents('.layui-layer').outerHeight(true) + containerHeight + 'px' });
			};

			layer.open({
				type: 1,
				area: ['500px', '250px'],
				offset: '250px',
				btn: ['添加'],
				id: 'add_qrcode',
				title: '添加二维码',
				content: `
					<div class="__layer addQrcode">
					
						<div class="item mb15">
							<span class="__layer_title">账号类型：</span>
							<label style="margin-right: 20px;">
								<input type="radio" class="__layer_radio" name="account_type" value="0" checked> 微信
							</label>
							<label>
								<input type="radio" class="__layer_radio" name="account_type" value="1"> 支付宝
							</label>
						</div>

						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<label style="margin-right: 20px;">
								<input type="radio" class="__layer_radio" name="code_account" value="${$.cookie('code_name')}" checked> 自己
							</label>
							<label>
								<input type="radio" id="other_input" class="__layer_radio" name="code_account" value="other">
								<span id="other_radio"> 其他</span>
							</label>
							<button class="layui-btn layui-btn-normal layui-btn-sm select_other" style="margin-left: 15px; display: none;">
								选择用户
							</button>
						</div>

						<div class="item mb15">
							<span class="__layer_title fl">支付二维码：</span>
							<form id="file_form" class="fl">
								<input style="vertical-align: baseline; display: inline-block; width: 180px;" class="qrcode" type="file" autocomplete="off" multiple/>
							</form>
							<span class="__layer_tips">最多只能上传10个文件</span>
						</div>

						<div class="hidden_container">
							<div class="item mb0 clearfix" style="height: auto;">
								<span class="fl __layer_title">文件列表：</span>
								<div class="fl fileData" style="padding-left: 4px; width: 320px;">
								</div>
							</div>
						</div>
					</div>
				`,
				success: () => {
					

					function readFile(file) {
						const reader = new FileReader();
						reader.onload = function(e) {
							dataArr.push({
								base64: [e.target.result],
								name: file.name
							});
						}
						reader.readAsDataURL(file);
					};

					function formatName(name) {
						const lastPointIndex = name.lastIndexOf('.');
						const fileName = name.slice(0, lastPointIndex);

						if (fileName.length > 8) {
							return fileName.slice(0, 8) + '...';
						} else {
							return fileName + name.slice(lastPointIndex);
						}
					};

					// 渲染上级账号
					$('.addQrcode [name=code_account]').on('change', function() {
						if ($(this).val() == 'other') {
							$('.addQrcode .select_other').show();
						} else {
							$('.addQrcode .select_other').hide();
						}
					})

					$('.addQrcode .qrcode').on('change', (e) => {
						let files = $(e.currentTarget)[0].files;
						if (files.length > 10) {
							hideList();
							$('.addQrcode #file_form')[0].reset();
							return layer.msg('最多只能上传10个文件', {icon: 2, time: 1500});
						}

						dataArr = [];
						let fileHtml = '';
						[...files].forEach(item => {
							fileHtml += `<span class="file_item">${formatName(item.name)}</span>`
							readFile(item);
						})
						$('.addQrcode .fileData').html(fileHtml);

						if(files.length > 0) {
							showList();
						} else {
							hideList();
						}
					})

					$('.addQrcode .select_other').on('click', () => {
						layer.open({
							type: '1',
							area: ['400px', '155px'],
							btn: ['确定'],
							title: '选择账号',
							content: `
								<div class="__layer select_view">
									<div class="item mb0">
										<span class="__layer_title" style="width: 60px;">账号：</span>
										<input class="__layer_input code_account" type="text" autocomplete="off"/>
										<span class="__layer_tips">请输入账号</span>
									</div>
								</div>
							`,
							yes: (layerIndex) => {
								const codeAccount = $('.select_view .code_account').val();
								if (codeAccount === '') return layer.msg('请输入账号！', { icon: 2, time: 1500 });
								this.$axios.post('Code_provider/sub_rebate', {
									cp_account: codeAccount
								}).then(res => {
									if (res.status === 'error') return;
									const {dataList} = res;
									$('.addQrcode #other_radio').html(codeAccount);
									layer.close(layerIndex);
								})
							}
						})
					})
				},
				yes: (layIndex) => {
					const files = $('.addQrcode .qrcode')[0].files[0],

						code_account_radio = $('.addQrcode [name=code_account]:checked').val(),
						code_account_name = $('.addQrcode #other_radio').html(),
						code_account = code_account_radio == 'other' ? code_account_name : code_account_radio,

						account_type = $('.addQrcode [name="account_type"]:checked').val();

					if (code_account === '') return layer.msg('请选择码户账号', { time: 1500, icon: 2 });
					if (!files) return layer.msg('请选择支付二维码文件', { time: 1500, icon: 2 });


					layer.open({
						type: 1,
						closeBtn: 2,
						area: ['325px', '160px'],			
						content: `
						<div class="loadingBar_layer">
							<div class="loading_bar">
								<div class="yet_loading"></div>
								<span class="load_num">0%</span>
								<span class="tips_text">正在添加二维码，请稍后.....</span>
							</div>
						</div>
						`,
						title: '添加二维码',
						success: (layer_id, index) => {
							let per = 0,
								currentIndex = 0;

							interval_id = setInterval(() => {
								per += 1;
								$('.loadingBar_layer .yet_loading').css('width', `${per}%`);
								$('.loadingBar_layer .load_num').html(per + '%')
								if (per >= 100) {
									clearInterval(interval_id)
								}
							}, 500)


							dataArr.forEach(item => {
								item.account_type = account_type;
								item.cp_account = code_account;
							})

							let addQrcode = (item) => {
								return new Promise((resolve, reject) => {
									this.$axios.post('Qrcode/qr_code_add', item).then((res) => {
										currentIndex++;

										if (res.status == 'error') {
											per = 0;
											clearInterval(this.interval_id)
											hideList();
											$('.addQrcode #file_form')[0].reset();
											dataArr = [];
											overload = true;
											clearInterval(interval_id)
											layer.close(index);
											throw new Error('上传失败');
										}

										if(res.dataList === 'OK' && currentIndex != dataArr.length) {
											resolve();
										}

										if (currentIndex == dataArr.length) {
											per = 100;
											layer.msg('添加成功', {icon: 1, time: 1500})
											setTimeout(() => {
												clearInterval(interval_id)
												layer.close(index);
												layer.close(layIndex);
												this.requestList();
											}, 1500);
											resolve();
										}
									})
								})
							}
							

							let req = async () => {
								for(const item of dataArr) {
									await addQrcode(item);
								}
							}

							req();
						},
						end() {
							$('.loadingBar_layer .yet_loading').css('width', `0%`);
							$('.loadingBar_layer .load_num').html(0 + '%')
						}
					})
				},
				end: () => {
					if (overload) {
						this.requestList();
					}
				}
			})
		},

		look(imgId) {
			this.$axios
				.post(`Qrcode/qrcode_images`, {
					url: imgId
				})
				.then(data => {
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