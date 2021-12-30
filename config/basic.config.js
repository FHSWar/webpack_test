const { noInlineProjects } = require('../customize.config')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const MiniSVGDataURI = require('mini-svg-data-uri')
const [HTMLPlugins, Entries] = require('./pages.config')
const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

// 当没有声明不能内联且图片小于 4kb 时转为内联图片。
function dataUrlConditionHandler(source, { filename }) {
	const noInline = noInlineProjects.map(project => {
		return resolve(__dirname, `../src/pages/${project}`)
	}).map(abs => filename.includes(abs)).filter(flag => flag === true)[0]
	if (!noInline && source.length < 4 * 1024) {
		return true
	}
}

const entry = Entries
const output = {
	filename: '[name]/index[contenthash].js',
	assetModuleFilename: 'assets/[contenthash][ext]',
	clean: true
}
const cache = {
	type: 'filesystem',
	allowCollectingMemory: true,
}
const _module = {
	rules: [
		{
			test: /\.ejs$/,
			use: {
				loader: 'ejs-compiled-loader',
				options: {
					htmlmin: true,
					htmlminOptions: {
						removeComments: true
					}
				}
			}
		},
		{
			test: /\.(gif|jpe?g|png)$/i,
			type: 'asset',
			parser: {
				dataUrlCondition: dataUrlConditionHandler
			}
		},
		{
			test: /\.(t|j)sx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader'
			}
		},
		{
			test: /\.(s[ac]|c)ss$/i,
			use: ['css-loader', 'postcss-loader', 'sass-loader']
		},
		{
			test: /\.svg$/i,
			type: 'asset',
			parser: {
				dataUrlCondition: {
					maxSize: 8 * 1024
				}
			},
			generator: {
				dataUrl(content) {
					content = content.toString()
					return MiniSVGDataURI(content)
				}
			},
			use: 'svgo-loader'
		},
		{
			test: /.vue$/,
			use: ['vue-loader']
		}
	]
}
const plugins = [
	new ESLintPlugin({
		fix: true,
		extensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'vue']
	}),
	// 用于加速编译
	new ForkTsCheckerWebpackPlugin({
		// 用这插件又用 eslint 就要加这一句
		eslint: { files: './src/**/*.{ts,tsx,js,jsx}' }
	}),
	...HTMLPlugins,
	new MiniCSSExtractPlugin({
		filename: '[name]/[contenthash].css',
		chunkFilename: '[name]/[id]-[contenthash].css'
	}),
	new VueLoaderPlugin(),
	// 不加这个会报警告
	new webpack.DefinePlugin({
		__VUE_OPTIONS_API__: false,
		__VUE_PROD_DEVTOOLS__: false
	})
]
const _resolve = {
	alias: {
		'@': resolve('src'),
		'@fonts': resolve(__dirname, '../src/public/fonts'),
		'@icons': resolve(__dirname, '../src/public/icons'),
		'@images': resolve(__dirname, '../src/public/images'),
		'@styles': resolve(__dirname, '../src/public/styles'),
		'@utils': resolve(__dirname, '../src/public/utils')
	},
	// 用来支持 ts
	extensions: ['.ts', '.tsx', '.js']
}

module.exports = {
	entry,
	output,
	cache,
	_resolve,
	_module,
	plugins
}