const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { loopWhile } = require('deasync')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const MiniSVGDataURI = require('mini-svg-data-uri')
const { networkInterfaces } = require('os')
const { resolve } = require('path')
const { getPort } = require('portfinder')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const [HTMLPlugins, Entries] = require('./pages.config')

const PRODUCTION = 'production', DEVELOPMENT = 'development', ANALYSIS = 'analysis'
const isAnls = process.env.NODE_ENV === ANALYSIS
const isDev = process.env.NODE_ENV === DEVELOPMENT
const isProd = process.env.NODE_ENV === PRODUCTION
const IP = networkInterfaces()['en0'][1]['address']

let port = 9000, done = false
getUsablePort(port)

const basic = {
	entry: Entries,
	output: {
		filename: '[name]/index[contenthash].js',
		assetModuleFilename: 'assets/[contenthash][ext]',
		clean: true
	},
	resolve: {
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
}

const devServer = {
	port,
	static: './dist'
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
				dataUrlCondition: {
					maxSize: 12 * 1024
				}
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
					maxSize: 12 * 1024
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
	new FriendlyErrorsWebpackPlugin({
		compilationSuccessInfo: {
			messages: [
				`Local: http://localhost:${port}`,
				`Network: http://${IP}:${port}`
			]
		}
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

let optimization = {
	minimize: true,
	minimizer: [
		new CssMinimizerPlugin(),
		new TerserPlugin()
	],
	splitChunks: {
		chunks: 'all'
	}
}

function getUsablePort(customPort) {
	getPort(
		{
			port: customPort,
			stopPort: customPort + 999
		},
		(err, usablePort) => {
			if (err) throw new Error('portFinder error', err)
			done = true
			port = usablePort
		}
	)
	loopWhile(() => !done)
}

switch (true) {
	case isAnls:
		basic.mode = DEVELOPMENT,
		plugins.push(new BundleAnalyzerPlugin())
		_module['rules'][3]['use'].unshift(MiniCSSExtractPlugin.loader)
		break
	// 开发模式
	case isDev:
		basic.mode = DEVELOPMENT,
		basic.stats = 'errors-warnings'
		// 方便开发定位代码
		basic.devtool = 'eval'
		// contenthash 导致抽取 css 会使 HMR 失效
		_module['rules'][3]['use'].unshift('style-loader')
		// 不需要优化，不开可以缩短启动和热更新时间
		optimization = {}
		break
	case isProd:
		basic.mode = PRODUCTION
		_module['rules'][3]['use'].unshift(MiniCSSExtractPlugin.loader),
		plugins.unshift(
			new CompressionPlugin(),
			new ImageMinimizerPlugin({
				minimizerOptions: {
					plugins: [
						['gifsicle', { interlaced: true }],
						['mozjpeg', { quality: 80 }],
						['pngquant', { quality: [0.6, 0.8] }]
					]
				}
			})
		)
		break
}

module.exports = {
	...basic,
	devServer,
	module: _module,
	optimization,
	plugins
}