<template>
	<div>
		<div class="listbiaoti am-cf">
			<dl class="am-icon-home" style="float: left;">
				当前位置： 码户管理 >
				<span>二维码管理</span>
			</dl>
		</div>
		<form class="am-form am-g">
			<div class="common_title clearfix">


				<!-- 新增 -->
				<div class="add_member fl" style="margin-right: 20px;">
					<el-button @click="add" class="auth_add" type="primary" icon="el-icon-plus" size="small">新增</el-button>
				</div>


				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input
								@keyup.enter.native="request_data"
								v-model="form.cp_account"
								placeholder="码户账号"
							></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="username fl">
					<el-form :inline="true" size="small" :model="form" @submit.native.prevent>
						<el-form-item>
							<el-input
								@keyup.enter.native="request_data"
								v-model.number="form.pay_money"
								placeholder="金额搜索"
							></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="lottery_status fl ml10">
					<el-form :inline="true" size="small" :model="form">
						<el-form-item>
							<el-select v-model="form.account_type" placeholder="账号类型">
								<el-option label="微信" value="0"></el-option>
								<el-option label="支付宝" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>


				<a @click="select_data" href="javascript:void(0)" class="select_btn fl">
					<i class="el-icon-search"></i> &nbsp;搜索
				</a>

				<div class="fl auth_eduit" style="margin-left: 30px; margin-top: 5px;">
					<el-checkbox v-model="mode">编辑模式</el-checkbox>
				</div>
			</div>

			<table width="100%" class="common_table">

				<thead>
					<tr>
						<th>码户账号</th>
						<th>昵称</th>
						<th>账号类型</th>
						<th>支付二维码</th>
						<th class="control_T">操作</th>
					</tr>
				</thead>

				<tbody class="common_tbody" :class="mode ? '': ''">
					<tr
						v-if="dataList.list"
						v-show="dataList.list.length > 0"
						v-for="(item, index) in dataList.list"
						:key="item.id"
					>
						<td>{{ item.cp_account }}</td>
						<td>{{ item.cp_nickname }}</td>
						<td>{{ item.account_type }}</td>
						<td class="table_btn_container" width="800px" style="padding: 8px 0 8px 20px;">
							<span v-for="(subitem, subindex) in item.qr_code_list" :key="subindex" class="table_btn_c">
								<i v-show="mode" class="table_btn_del layui-icon layui-icon-close" @click="removeQrcode(item, subitem.id, subitem.pay_money)"></i>

								<i v-if="subitem.pay_money === '不定额'" v-show="mode" class="table_btn" @click="editDue({id: subitem.id, money: subitem.pay_money, pay_mode: subitem.pay_mode})">{{ subitem.pay_money }}</i>
								<i v-else v-show="mode" class="table_btn" @click="edit({id: subitem.id, money: subitem.pay_money, pay_mode: subitem.pay_mode})">{{ subitem.pay_money }}</i>

								<i v-show="!mode" class="table_btn" style="border-right: 1px solid #ccc;" @click="look({url:subitem.pay_url, money: subitem.pay_money, nickname: item.cp_nickname})">{{ subitem.pay_money }}</i>
							</span>
						</td>
						<td class="control_C">
							<!-- <span class="editor_btn cp auth_eduit" @click="edit(item)"><i class="el-icon-edit-outline"></i> 编辑</span> -->
							<span class="common_btn cp auth_add" @click="addOne(item.cp_account)"><i class="el-icon-plus"></i> 添加</span>
						</td>
					</tr>

					<tr v-if="dataList.list" v-show="dataList.list.length <= 0" class="no_data">
						<td colspan="12">
							<img src="../../statics/images/icon/nodate.png">
							<p>{{ `${form.cp_account == '' ? '暂时没有二维码管理列表' : '该用户暂时没有二维码信息'}` }}</p>
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
			mode: false,		// 模式
			dataList: {},

			addImgArr: [],		// 添加图片base64数组
			interval_id: null,	// 轮询器id

			form: {
				prompt: true,
				cp_account: '',
				pay_money: '',
				account_type: '0',

				page: 1,
				pageSize: 100
			}
		};
	},
	created() {
		if (this.$route.query.cp) {
			this.form.cp_account = this.$route.query.cp;
		}
		this.request_data();
	},
	computed: {},
	methods: {
		request_data() {
			this.$axios
				.post("Code_provider/qr_code_manage", this.form)
				.then(res => {
					this.dataList = res;
					this.$cm_m.auth_btn();
				});
		},

		select_data() {
			this.form.page = 1;
			this.request_data();
		},

		/**
		 * 查看二维码图片
		 * @param {String} url 二维码地址
		 * @param {Number} money 对应二维码的金额
		 * @param {Number} nickname 昵称
		 */
		look({url, money, nickname}) {
			this.$axios
				.post(`Code_provider/qrcode_images`, {
					url: url
				})
				.then(data => {
					const JSON = {
						data: [
							{
								alt: false,
								src: data.url, //原图地址
								thumb: data.url //缩略图地址
							}
						]
					};

					layer.photos({
						title: [`￥${money} ${nickname == '' ? '' : `(${nickname})`}`, 'font-size:20px; font-weight: bold; text-align: center; padding: 0'],
						area: ['300px', '350px'],
						photos: JSON,
						shade: 0.5,
						anim: 5
					});

				});
		},

		/**
		 * 编辑二维码
		 * @param {Number} id 编辑的id
		 * @param {Number} money 对应二维码的金额
		 */
		edit({id, money, pay_mode}) {
			let baseImg;
			layer.open({
				type: 1,
				area: ['500px', '200px'],
				offset: '250px',
				btn: ['确定'],
				id: 'edit_qrcode',
				title: '编辑二维码',
				content: `
					<div class="__layer editQrcode">
						<div class="item mb15">
							<span class="__layer_title" style="width: 95px;">二维码金额：</span>
							<span class="__layer_content" style="width: 115px;">${money} 元</span>
							<span class="__layer_tips">支付二维码收款金额必须与二维码金额一致</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title" style="width: 95px;">支付二维码：</span>
							<input style="vertical-align: baseline; display: inline-block;" class="qrcode" type="file" autocomplete="off"/>
						</div>
						<div class="hidden_container">
							<div class="item mb0" style="text-align: center;">
								<img class="qrcode_img" style="height:180px;" />
							</div>
						</div>
					</div>
				`,
				success: () => {
					const containerHeight = 200;
					let isShow = false;

					function hideList() {
						isShow = false;
						$('.editQrcode .hidden_container').css({
							'visibility': 'hidden',
							'height': 0 + 'px'
						});
						$('#edit_qrcode').css({ 'height': $('#edit_qrcode').outerHeight(true) - containerHeight + 'px' });
						$('#edit_qrcode').parents('.layui-layer').css({ 'height': $('#edit_qrcode').parents('.layui-layer').outerHeight(true) - containerHeight + 'px' });
					};

					function showList() {
						if (isShow) { return };
						isShow = true;
						$('.editQrcode .hidden_container').css({
							'visibility': 'initial',
							'height': containerHeight + 'px'
						});
						$('#edit_qrcode').css({ 'height': $('#edit_qrcode').outerHeight(true) + containerHeight + 'px' });
						$('#edit_qrcode').parents('.layui-layer').css({ 'height': $('#edit_qrcode').parents('.layui-layer').outerHeight(true) + containerHeight + 'px' });
					};

					$('.editQrcode .qrcode').on('change', (e) => {
						const files = $(e.currentTarget)[0].files[0];

						if(files) {
							showList();
						} else {
							return hideList();
						}

						const reader = new FileReader();
						reader.onload = function(e) {
							baseImg = e.target.result;
							console.log($('.editQrcode .qrcode_img'))
							$('.editQrcode .qrcode_img').attr('src', e.target.result);
						}
						reader.readAsDataURL(files);
					})
				},
				yes: async (layIndex) => {

					const files = $('.editQrcode .qrcode')[0].files[0];
					if (!files) return layer.msg('请选择支付二维码文件', { time: 1500, icon: 2 });

					let requestData;
					if (this.$store.getters.getUserInfo.qr_code_url === '') {
						requestData = {
							id: id,
							image: baseImg,
							prompt: true,
						};
					} else {
						requestData = {
							id: id,
							list: await this.requestOuterUrl({baseImg, prompt: false, layerId: layIndex, pay_mode}),
							prompt: true,
						};
					}

					this.$axios.post('Code_provider/qrcode_edit', requestData).then(res => {
						if(!res) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500);
						}
					})
				}
			})
		},

		/**
		 * 编辑不定额二维码
		 */
		editDue({id, money, pay_mode}) {
			let baseImg;
			layer.open({
				type: 1,
				area: ['500px', '260px'],
				offset: '250px',
				btn: ['确定'],
				id: 'edit_qrcode',
				title: '编辑二维码',
				content: `
					<div class="__layer editQrcode">
						<div class="item mb15">
							<span class="__layer_title" style="width: 95px;">二维码金额：</span>
							<span class="__layer_content" style="width: 115px;">${money}</span>
						</div>

						<div class="item mb15">
							<span class="__layer_title">二维码格式：</span>

							<input type="radio" id="qrcode_format_1" class="__layer_radio" name="qrcode_format" value="0" checked> 
							<label style="margin-right: 30px;" for="qrcode_format_1">二维码地址</label>

							<input type="radio" id="qrcode_format_2" class="__layer_radio" name="qrcode_format" value="1" > 
							<label for="qrcode_format_2">二维码图片</label>
						</div>

						<div class="item mb15 qrcode_url_view">
							<span class="__layer_title">二维码地址：</span>
							<input class="__layer_input qrcode_url" type="text" style="width: 310px;" autocomplete="off"/>
						</div>
						
						<div class="item mb15 qrcode_img_view dn">
							<span class="__layer_title" style="width: 95px;">支付二维码：</span>
							<input style="vertical-align: baseline; display: inline-block;" class="qrcode" type="file" autocomplete="off"/>
						</div>
						<div class="hidden_container">
							<div class="item mb0" style="text-align: center;">
								<img class="qrcode_img" style="height:180px;" />
							</div>
						</div>
					</div>
				`,
				success: () => {
					const containerHeight = 200;
					let isShow = false;

					function hideList() {
						isShow = false;
						$('.editQrcode .hidden_container').css({
							'visibility': 'hidden',
							'height': 0 + 'px'
						});
						$('#edit_qrcode').css({ 'height': $('#edit_qrcode').outerHeight(true) - containerHeight + 'px' });
						$('#edit_qrcode').parents('.layui-layer').css({ 'height': $('#edit_qrcode').parents('.layui-layer').outerHeight(true) - containerHeight + 'px' });
					};

					function showList() {
						if (isShow) { return };
						isShow = true;
						$('.editQrcode .hidden_container').css({
							'visibility': 'initial',
							'height': containerHeight + 'px'
						});
						$('#edit_qrcode').css({ 'height': $('#edit_qrcode').outerHeight(true) + containerHeight + 'px' });
						$('#edit_qrcode').parents('.layui-layer').css({ 'height': $('#edit_qrcode').parents('.layui-layer').outerHeight(true) + containerHeight + 'px' });
					};

					$('.editQrcode .qrcode').on('change', (e) => {
						const files = $(e.currentTarget)[0].files[0];

						if(files) {
							showList();
						} else {
							return hideList();
						}

						const reader = new FileReader();
						reader.onload = function(e) {
							baseImg = e.target.result;
							console.log($('.editQrcode .qrcode_img'))
							$('.editQrcode .qrcode_img').attr('src', e.target.result);
						}
						reader.readAsDataURL(files);
					})

					/**
					 * 二维码格式变更
					 */
					$('.editQrcode [name="qrcode_format"]').on('change', (e) => {
						const VAL = $(e.currentTarget).val();
						if (VAL === '0') {
							$('.editQrcode .qrcode_url_view').removeClass('dn');
							$('.editQrcode .qrcode_img_view').addClass('dn');
						} else {
							$('.editQrcode .qrcode_url_view').addClass('dn');
							$('.editQrcode .qrcode_img_view').removeClass('dn');
						}
					})
				},
				yes: async (layIndex) => {
					
					const files = $('.editQrcode .qrcode')[0].files[0],
						qrcode_url = $('.editQrcode .qrcode_url').val(),
						isImg = $('.editQrcode [name="qrcode_format"]:checked').val() === '1';

					if (!files && isImg) return layer.msg('请选择支付二维码文件', { time: 1500, icon: 2 });
					if (qrcode_url === '' && !isImg) return layer.msg('请输入二维码地址', { time: 1500, icon: 2 });

					let requestData;
					if (this.$store.getters.getUserInfo.qr_code_url === '') {
						requestData = {
							id: id,
							image: baseImg,
							qrcode_url,
							prompt: true,
						};
					} else {
						requestData = {
							id: id,
							list: await this.requestOuterUrl({baseImg, prompt: false, qrcode_url, layerId: layIndex, pay_mode}),
							prompt: true,
						};
					}

					this.$axios.post('Code_provider/qrcode_edit', requestData).then(res => {
						if(!res) {
							setTimeout(() => {
								layer.close(layIndex);
								this.request_data();
							}, 1500);
						}
					})
				}
			})
		},

		/**
		 * 添加二维码
		 */
		add() {
			const uploadSum = 20,		// 限制上传的总个数
				lineHeight = 36,		// 行高
				lineSum = 4,			// 一行个数
				showFileLength = 10,	// 没带中文显示出来的文字内容个数
				hasChinesshowFileLength = 6,	// 带着中文的文字内容个数
				chineseReg = /[\u4e00-\u9fa5]/;	// 中文正则

			let isShow = false,			// 是否显示列表
				overload = false,		// 关闭刷新
				addQrcodeHeight,		// 添加二维码界面高度
				layerHeight,			// 弹框高度
				fileLength;				// 上传文件的个数

			function hideList() {
				if (isShow) {
					$('#add_qrcode').css({ 'height': addQrcodeHeight + 'px' });
					$('#add_qrcode').parents('.layui-layer').css({ 'height': layerHeight + 'px' });
				}
				isShow = false;
				$('.add_qrcode .hidden_container > .item').css({
					'visibility': 'hidden',
					'height': 0 + 'px'
				});
			};
			
			/**
			 * 显示文件列表
			 * @param {Number} containerHeight 内容高度
			 */
			function showList(containerHeight) {
				isShow = true;
				$('.add_qrcode .hidden_container > .item').css({
					'visibility': 'initial',
					'height': containerHeight + 'px'
				});

				$('#add_qrcode').css({ 'height': addQrcodeHeight + containerHeight + 'px' });
				$('#add_qrcode').parents('.layui-layer').css({ 'height': layerHeight + containerHeight + 'px' });
			};
			
			layer.open({
				type: 1,
				area: ['490px', '360px'],
				offset: '250px',
				btn: ['确定'],
				title: '新增',
				id: 'add_qrcode',
				content: `
					<div class="__layer add_qrcode">
						<div class="item mb15">
							<span class="__layer_title">二维码类型：</span>

							<input type="radio" id="qrcode_type_1" class="__layer_radio" name="qrcode_type" value="0" checked> 
							<label style="margin-right: 30px;" for="qrcode_type_1">定额</label>

							<input type="radio" id="qrcode_type_2" class="__layer_radio" name="qrcode_type" value="1" > 
							<label for="qrcode_type_2">不定额</label>
						</div>
						<div class="item mb15">
							<span class="__layer_title">账号类型：</span>

							<input type="radio" id="radio_status_1" class="__layer_radio" name="account_type" value="0" checked> 
							<label style="margin-right: 30px;" for="radio_status_1">微信</label>

							<input type="radio" id="radio_status_2" class="__layer_radio" name="account_type" value="1" > 
							<label for="radio_status_2">支付宝</label>
						</div>

						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<input class="__layer_input code_account" type="text" autocomplete="off"/>
						</div>

						<div class="item mb15">
							<span class="__layer_title">二维码格式：</span>

							<input type="radio" id="qrcode_format_1" class="__layer_radio" name="qrcode_format" value="0" checked> 
							<label style="margin-right: 30px;" for="qrcode_format_1">二维码地址</label>

							<input type="radio" id="qrcode_format_2" class="__layer_radio" name="qrcode_format" value="1" > 
							<label for="qrcode_format_2">二维码图片</label>
						</div>

						<div class="item mb15 qrcode_url_view">
							<span class="__layer_title">二维码地址：</span>
							<input class="__layer_input qrcode_url" type="text" style="width: 310px;" autocomplete="off"/>
						</div>
						
						<div class="item mb15 qrcode_img_view dn">
							<span class="__layer_title fl">支付二维码：</span>
							<form id="file_form" class="fl">
								<input style="vertical-align: baseline; display: inline-block; width: 180px;" class="qrcode" type="file" autocomplete="off" multiple/>
							</form>
							<span class="__layer_tips">最多只能上传${uploadSum}个文件</span>
						</div>
						<div class="hidden_container">
							<div class="item mb0 clearfix" style="height: auto;">
								<div class="fl fileData" style="padding-left: 4px;">
								</div>
							</div>
						</div>
					</div>
				`,
				success: () => {
					addQrcodeHeight = $('#add_qrcode').outerHeight(true) + 8;
					layerHeight = $('#add_qrcode').parents('.layui-layer').outerHeight(true) + 5;

					let readFile = (file) => {
						const reader = new FileReader();
						reader.onload = (e) => {
							this.addImgArr.push({
								base64: e.target.result,
								name: file.name,
							})
						}
						reader.readAsDataURL(file);
					};

					function formatName(name) {
						const lastPointIndex = name.lastIndexOf('.');
						const fileName = name.slice(0, lastPointIndex);
						if (chineseReg.test(fileName)) {
							return fileName.slice(0, hasChinesshowFileLength) + '...';
						} else {
							if (fileName.length > showFileLength) {
								return fileName.slice(0, showFileLength) + '...';
							} else {
								return fileName + name.slice(lastPointIndex);
							}
						}
					};

					$('.add_qrcode .qrcode').on('change', (e) => {
						let files = $(e.currentTarget)[0].files;
						if (files.length > uploadSum) {
							hideList();
							$('.add_qrcode #file_form')[0].reset();
							return layer.msg(`最多只能上传${uploadSum}个文件`, {icon: 2, time: 1500});
						}
						this.addImgArr = [];
						
						let fileHtml = '';
						[...files].forEach(item => {
							fileHtml += `<span class="file_item">${formatName(item.name)}</span>`
						
							readFile(item);
						})
						$('.add_qrcode .fileData').html(fileHtml);

						fileLength = files.length;

						if(files.length > 0) {
							const containerHeight = Math.ceil(files.length / lineSum) * lineHeight;
							return showList(containerHeight);
						} else {
							return hideList();
						}
					})


					/**
					 * 二维码格式变更
					 */
					$('.add_qrcode [name="qrcode_format"]').on('change', (e) => {
						const VAL = $(e.currentTarget).val();
						if (VAL === '0') {
							$('.add_qrcode .qrcode_url_view').removeClass('dn');
							$('.add_qrcode .qrcode_img_view').addClass('dn');
						} else {
							$('.add_qrcode .qrcode_url_view').addClass('dn');
							$('.add_qrcode .qrcode_img_view').removeClass('dn');
						}
					})
				},
				
				yes: (layerIndex) => {
					const files = $('.add_qrcode .qrcode')[0].files[0],
						account_type = $('.add_qrcode [name="account_type"]:checked').val(),
						pay_mode = $('.add_qrcode [name="qrcode_type"]:checked').val(),
						code_account = $('.add_qrcode .code_account').val(),
						qrcode_url = $('.add_qrcode .qrcode_url').val(),
						isImg = $('.add_qrcode [name="qrcode_format"]:checked').val() === '1';

					if (code_account == '') return layer.msg('请输入码户账号', { time: 1500, icon: 2 });
					if (!files && isImg) return layer.msg('请选择支付二维码文件', { time: 1500, icon: 2 });
					if (qrcode_url === '' && !isImg) return layer.msg('请输入二维码地址', { time: 1500, icon: 2 });

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

							let renderLoadBar = (reload) => {
								if (reload) {
									per = Math.floor(100 / (isImg ? fileLength : 1)) * (currentIndex);
								}
								if (per >= Math.floor(100 / (isImg ? fileLength : 1)) * (currentIndex + 1)) {
									return;
								}
								if (per >= 99) {
									clearInterval(this.interval_id)
								}

								per += 1;
								$('.loadingBar_layer .yet_loading').css('width', `${per}%`);
								$('.loadingBar_layer .load_num').html(per + '%')
							}

							this.interval_id = setInterval(() => {
								renderLoadBar();
							}, 500)


							let addQrcode = (item) => {
								return new Promise(async (resolve, reject) => {
									if (this.$store.getters.getUserInfo.qr_code_url !== '') {
										item.list = await this.requestOuterUrl({baseImg:item.base64, qrcode_url: item.qrcode_url, prompt: false, layerId: index, pay_mode});
										delete item.base64;
									}
									this.$axios.post('Code_provider/qr_code_add', item).then((res) => {
										console.log(res);
										currentIndex++;

										if (res && res.error) {
											clearInterval(this.interval_id)
											hideList();
											$('.add_qrcode #file_form')[0].reset();
											this.addImgArr = [];
											layer.close(index);
											overload = true;
											throw new Error('上传失败');
										};

										if(res === 'OK' && currentIndex != this.addImgArr.length) {
											renderLoadBar(true);
											$('.loadingBar_layer .tips_text').html(`已添加<span class="red f_bold">${currentIndex}</span>张二维码，请稍后...`);
											resolve();
										}

										if(!isImg || currentIndex == this.addImgArr.length) {
											per = 100;
											layer.msg('添加成功', {icon: 1, time: 1500})
											setTimeout(() => {
												clearInterval(this.interval_id)
												layer.close(index);
												layer.close(layerIndex);
												this.request_data();
											}, 1500);
											resolve();
										}
									})
								})
							}


							if (isImg) {
								this.addImgArr.forEach(item => {
									item.account_type = account_type;
									item.cp_account = code_account;
									item.pay_mode = pay_mode;
								})
								let req = async () => {
									for(const item of this.addImgArr) {
										await addQrcode(item);
									}
								}
								req();
							} else {
								addQrcode({
									account_type: account_type,
									cp_account: code_account,
									pay_mode: pay_mode,
									qrcode_url,
								})
							}
							

							
						},
						end: () => {
							clearInterval(this.interval_id)
							$('.loadingBar_layer .yet_loading').css('width', `0%`);
							$('.loadingBar_layer .load_num').html(0 + '%')
						}
					})
				},
				
				end: () => {
					if (overload) {
						this.request_data();
					}
				},
			})
		},

		/**
		 * 为一个用户添加二维码
		 * @method addOne
		 * @param {string} cp_account 需要添加二维码的码户账号
		 */
		addOne(cp_account) {
			const uploadSum = 20,		// 限制上传的总个数
				lineHeight = 36,		// 行高
				lineSum = 4,			// 一行个数
				showFileLength = 10,	// 没带中文显示出来的文字内容个数
				hasChinesshowFileLength = 6,	// 带着中文的文字内容个数
				chineseReg = /[\u4e00-\u9fa5]/;	// 中文正则

			let isShow = false,			// 是否显示列表
				overload = false,		// 关闭刷新
				addQrcodeHeight,		// 添加二维码界面高度
				layerHeight,			// 弹框高度
				fileLength;				// 上传文件的个数

			function hideList() {
				if (isShow) {
					$('#add_qrcode').css({ 'height': addQrcodeHeight + 'px' });
					$('#add_qrcode').parents('.layui-layer').css({ 'height': layerHeight + 'px' });
				}
				isShow = false;
				$('.add_qrcode .hidden_container > .item').css({
					'visibility': 'hidden',
					'height': 0 + 'px'
				});
			};
			
			/**
			 * 显示文件列表
			 * @param {Number} containerHeight 内容高度
			 */
			function showList(containerHeight) {
				isShow = true;
				$('.add_qrcode .hidden_container > .item').css({
					'visibility': 'initial',
					'height': containerHeight + 'px'
				});

				$('#add_qrcode').css({ 'height': addQrcodeHeight + containerHeight + 'px' });
				$('#add_qrcode').parents('.layui-layer').css({ 'height': layerHeight + containerHeight + 'px' });
			};

			layer.open({
				type: 1,
				area: ['490px', '360px'],
				offset: '250px',
				btn: ['确定'],
				title: '添加二维码',
				id: 'add_qrcode',
				content: `
					<div class="__layer add_qrcode">
						<div class="item mb15">
							<span class="__layer_title">二维码类型：</span>

							<input type="radio" id="qrcode_type_1" class="__layer_radio" name="qrcode_type" value="0" checked> 
							<label style="margin-right: 30px;" for="qrcode_type_1">定额</label>

							<input type="radio" id="qrcode_type_2" class="__layer_radio" name="qrcode_type" value="1" > 
							<label for="qrcode_type_2">不定额</label>
						</div>
						<div class="item mb15">
							<span class="__layer_title">账号类型：</span>

							<input type="radio" id="radio_status_1" class="__layer_radio" name="account_type" value="0" checked> 
							<label style="margin-right: 30px;" for="radio_status_1">微信</label>

							<input type="radio" id="radio_status_2" class="__layer_radio" name="account_type" value="1" > 
							<label for="radio_status_2">支付宝</label>
						</div>

						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<span class="__layer_content code_account">${cp_account}</span>
						</div>

						<div class="item mb15">
							<span class="__layer_title">二维码格式：</span>

							<input type="radio" id="qrcode_format_1" class="__layer_radio" name="qrcode_format" value="0" checked> 
							<label style="margin-right: 30px;" for="qrcode_format_1">二维码地址</label>

							<input type="radio" id="qrcode_format_2" class="__layer_radio" name="qrcode_format" value="1" > 
							<label for="qrcode_format_2">二维码图片</label>
						</div>

						<div class="item mb15 qrcode_url_view">
							<span class="__layer_title">二维码地址：</span>
							<input class="__layer_input qrcode_url" type="text" style="width: 310px;" autocomplete="off"/>
						</div>
						
						<div class="item mb15 qrcode_img_view dn">
							<span class="__layer_title fl">支付二维码：</span>
							<form id="file_form" class="fl">
								<input style="vertical-align: baseline; display: inline-block; width: 180px;" class="qrcode" type="file" autocomplete="off" multiple/>
							</form>
							<span class="__layer_tips">最多只能上传${uploadSum}个文件</span>
						</div>
						<div class="hidden_container">
							<div class="item mb0 clearfix" style="height: auto;">
								<div class="fl fileData" style="padding-left: 4px;">
								</div>
							</div>
						</div>
					</div>
				`,
				success: () => {
					addQrcodeHeight = $('#add_qrcode').outerHeight(true) + 8;
					layerHeight = $('#add_qrcode').parents('.layui-layer').outerHeight(true) + 5;

					let readFile = (file) => {
						const reader = new FileReader();
						reader.onload = (e) => {
							this.addImgArr.push({
								base64: e.target.result,
								name: file.name,
							})
						}
						reader.readAsDataURL(file);
					};

					function formatName(name) {
						const lastPointIndex = name.lastIndexOf('.');
						const fileName = name.slice(0, lastPointIndex);
						
						if (chineseReg.test(fileName)) {
							return fileName.slice(0, hasChinesshowFileLength) + '...';
						} else {
							if (fileName.length > showFileLength) {
								return fileName.slice(0, showFileLength) + '...';
							} else {
								return fileName + name.slice(lastPointIndex);
							}
						}
					};

					$('.add_qrcode .qrcode').on('change', (e) => {
						let files = $(e.currentTarget)[0].files;
						if (files.length > uploadSum) {
							hideList();
							$('.add_qrcode #file_form')[0].reset();
							return layer.msg(`最多只能上传${uploadSum}个文件`, {icon: 2, time: 1500});
						}
						this.addImgArr = [];
						
						let fileHtml = '';
						[...files].forEach(item => {
							fileHtml += `<span class="file_item">${formatName(item.name)}</span>`
						
							readFile(item);
						})
						$('.add_qrcode .fileData').html(fileHtml);

						fileLength = files.length;

						if(files.length > 0) {
							const containerHeight = Math.ceil(files.length / lineSum) * lineHeight;
							return showList(containerHeight);
						} else {
							return hideList();
						}
					})

					/**
					 * 二维码格式变更
					 */
					$('.add_qrcode [name="qrcode_format"]').on('change', (e) => {
						const VAL = $(e.currentTarget).val();
						if (VAL === '0') {
							$('.add_qrcode .qrcode_url_view').removeClass('dn');
							$('.add_qrcode .qrcode_img_view').addClass('dn');
						} else {
							$('.add_qrcode .qrcode_url_view').addClass('dn');
							$('.add_qrcode .qrcode_img_view').removeClass('dn');
						}
					})
				},
				
				yes: (layerIndex) => {
					const files = $('.add_qrcode .qrcode')[0].files[0],
						pay_mode = $('.add_qrcode [name="qrcode_type"]:checked').val(),
						account_type = $('.add_qrcode [name="account_type"]:checked').val(),
						qrcode_url = $('.add_qrcode .qrcode_url').val(),
						isImg = $('.add_qrcode [name="qrcode_format"]:checked').val() === '1';

					if (cp_account == '') return layer.msg('请输入码户账号', { time: 1500, icon: 2 });
					if (!files && isImg) return layer.msg('请选择支付二维码文件', { time: 1500, icon: 2 });
					if (qrcode_url === '' && !isImg) return layer.msg('请输入二维码地址', { time: 1500, icon: 2 });

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
							let per = 0,				// 进度条百分比
								currentIndex = 0;		// 当前上传完成的二维码数

							let renderLoadBar = (reload) => {
								if (reload) {
									per = Math.floor(100 / (isImg ? fileLength : 1)) * (currentIndex);
								}
								if (per >= Math.floor(100 / (isImg ? fileLength : 1)) * (currentIndex + 1)) {
									return;
								}
								per += 1;
								$('.loadingBar_layer .yet_loading').css('width', `${per}%`);
								$('.loadingBar_layer .load_num').html(per + '%')
								if (per >= 99) {
									clearInterval(this.interval_id)
								}
							}

							this.interval_id = setInterval(() => {
								renderLoadBar();
							}, 500)
							
							

							let addQrcode = (item) => {
								return new Promise(async (resolve, reject) => {
									if (this.$store.getters.getUserInfo.qr_code_url !== '') {
										item.list = await this.requestOuterUrl({baseImg:item.base64, qrcode_url: item.qrcode_url, prompt: false, layerId: index, pay_mode});
										delete item.base64;
									}

									this.$axios.post('Code_provider/qr_code_add', item).then((res) => {
										currentIndex++;

										if (res && res.error) {
											clearInterval(this.interval_id)
											hideList();
											$('.add_qrcode #file_form')[0].reset();
											this.addImgArr = [];
											layer.close(index);
											overload = true;
											throw new Error('上传失败');
										};

										if(res === 'OK' && currentIndex != this.addImgArr.length) {
											renderLoadBar(true);
											$('.loadingBar_layer .tips_text').html(`已添加<span class="red f_bold">${currentIndex}</span>张二维码，请稍后...`);
											resolve();
										}

										if(!isImg || currentIndex == this.addImgArr.length) {
											per = 100;
											layer.msg('添加成功', {icon: 1, time: 1500})
											setTimeout(() => {
												clearInterval(this.interval_id)
												layer.close(index);
												layer.close(layerIndex);
												this.request_data();
											}, 1500);
											resolve();
										}
									})
								})
							}


							if (isImg) {
								this.addImgArr.forEach(item => {
									item.account_type = account_type;
									item.pay_mode = pay_mode;
									item.cp_account = cp_account;
								})

								let req = async () => {
									for(const item of this.addImgArr) {
										await addQrcode(item);
									}
								}

								req();
							} else {
								addQrcode({
									account_type: account_type,
									pay_mode: pay_mode,
									cp_account: cp_account,
									qrcode_url,
								})
							}

							
						},
						end: () => {
							clearInterval(this.interval_id)
							$('.loadingBar_layer .yet_loading').css('width', `0%`);
							$('.loadingBar_layer .load_num').html(0 + '%')
						}
					})
				},
				
				end: () => {
					if (overload) {
						this.request_data();
					}
				},
			})
		},

		/**
		 * 删除二维码
		 * @param {Object} dataObj
		 * @param {Number} id
		 * @param {String} money
		 */
		removeQrcode(dataObj, id, money) {
			layer.open({
				type: 1,
				area: ['375px', '260px'],
				offset: '250px',
				btn: ['删除', '取消'],
				title: '编辑',
				id: 'add_qrcode',
				content: `
					<div class="__layer add_qrcode">
						<div class="item mb15">
							<span class="__layer_title">码户账号：</span>
							<span class="__layer_content">${dataObj.cp_account}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">昵称：</span>
							<span class="__layer_content">${dataObj.cp_nickname}</span>
						</div>
						<div class="item mb15">
							<span class="__layer_title">金额：</span>
							<span class="__layer_content">${money}</span>
						</div>
					</div>
				`,
				yes: (layer_index) => {

					this.$axios.post('Code_provider/qr_code_del', {id}).then((res) => {
						if (!res) {
							setTimeout(() => {
								this.request_data();
								layer.close(layer_index);
							}, 1500)
						}
					})
				}
			});
		},

		/**
		 * 请求外部url
		 * @param {String} baseImg 图片的base64格式
		 * @param {Boolean} prompt 是否显示提示框
		 */
		requestOuterUrl({baseImg, qrcode_url, prompt, layerId, pay_mode}) {
			const requestUrl = this.$store.getters.getUserInfo.qr_code_url;
			
			return new Promise((res, rej) => {
				this.$axios.post(requestUrl, {
					base64: baseImg,
					qrcode_url,
					pay_mode,
					prompt,
				}).then(data => {
					if (!data.error) {
						res(data);
					} else {
						layer.close(layerId);
					}
				})
			})
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
};
</script>