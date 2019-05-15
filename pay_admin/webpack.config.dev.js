// 导入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装

// 导入 webpack
const webpack=require("webpack")


module.exports = {
	entry: './src/main.js',		// 打包的入口文件
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					{//loader处理的顺序是该数组中从右到左的顺序
						loader: 'style-loader'//将 JS 字符串生成为 style 节点
					},{
						loader: 'css-loader'//将 CSS 转化成 CommonJS 模块
					},{
						loader: 'sass-loader'//将sass编译成css
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },	
					{ loader: "css-loader" }
				]
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff|eot|svg|woff2|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4000		// 阀值
						}
					}
				]
			}
		]
	},
	plugins: [	// 插件中的内容都是 new出来的
		new HtmlWebpackPlugin({
			template: './template.html',		// 参考文件的路径
			filename: 'index.html',				// 要将html写入的文件名字
		}),
		new webpack.ProvidePlugin({
			jQuery: "jquery",
			$: "jquery"
		})
	]
}