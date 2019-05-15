// 导入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 导入 webpack
const webpack = require("webpack");

// 导入path模块
const path = require('path');

// 打包之前删除 dist 目录 所需包
const CleanWebpackPlugin = require('clean-webpack-plugin')

// 剥离 css 文件插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	entry: './src/main.js',		// 打包的入口文件
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'webpack.bundle.js?v=[hash:5]'
	},
	module: {
		rules: [
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
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
					}
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: {
						loader: "css-loader",
						options: {
							minimize: true	// 压缩抽离出来的css文件
						}
					}
				})
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff|eot|svg|woff2|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4000,		// 阀值
							name: 'statics/[name]-[hash:5].[ext]'
						}
					}
				]
			},
			// exclude排除，对node_modules里面的代码不需要进行转换
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.js$/, exclude: path.resolve(__dirname, '/UE')}
		]
	},
	plugins: [	// 插件中的内容都是 new出来的
		// 打包之前，删除 dist 目录
		new CleanWebpackPlugin('dist'),

		new HtmlWebpackPlugin({
			template: './template.html',		// 参考文件的路径
			filename: 'index.html',				// 要将html写入的文件名字
			version: + new Date(),
			minify: {
				removeComments: true,	// 删除注释
				minifyJS: true,			// 压缩 index.html 中的js
				minifyCSS: true,		// 压缩 index.html 中的css
				collapseWhitespace: true	// 去除空格
			}
		}),
		new webpack.ProvidePlugin({
			jQuery: "jquery",
			$: "jquery"
		}),
		// 设置当前环境为生产环境
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		// 设置压缩js文件
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,	// 去除警告
				drop_debugger: true,
				drop_console: true	// 去除 console.log
			},
			comments: false	// 去掉版权信息等注释
		}),
		// 在 plugins 中添加,括号内为路径
		new ExtractTextPlugin("static/css/styles.css")
	]
}