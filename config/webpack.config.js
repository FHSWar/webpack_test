const {
	plugins: analysisPlugins
} = require('./analysis.config')
const {
	entry,
	output,
	cache,
	_resolve: resolve,
	_module,
	plugins: basicPlugins
} = require('./basic.config')
const {
	devServer,
	plugins: deveplomentPlugins
} = require('./development.config')
const {
	optimization,
	plugins: productionPlugins
} = require('./production.config')
const {
    DEVELOPMENT,
    PRODUCTION,
	isAnls,
	isDev,
	isProd
} = require('./environment.config')

let mode, stats, devtool, plugins = []


// 分析和生产模式共有的
if (isAnls || isProd) {
	mode = PRODUCTION
	_module['rules'][3]['use'].unshift(require('mini-css-extract-plugin').loader)
	// 分析生产包才有价值，除了分析专用插件，其它插件 prod 有的 anls 也要有
	plugins.push(...productionPlugins)
}
// 特定于某一个环境的
switch (true) {
	case isAnls:
		devtool = false
		plugins.push(...analysisPlugins)
		break
	// 开发模式
	case isDev:
		mode = DEVELOPMENT
		stats = 'errors-warnings'
		// 方便开发定位代码
		devtool = 'eval-cheap-source-map'
		// contenthash 导致抽取 css 会使 HMR 失效，不抽取热加载还快一点
		_module['rules'][3]['use'].unshift('style-loader')
		// 不需要优化，不开可以缩短启动和热更新时间
		plugins.push(...deveplomentPlugins)
		break
}

module.exports = {
	cache,
	devServer,
	devtool,
	entry,
	mode,
	output,
	resolve,
	stats,
	module: _module,
	optimization: !isDev ? optimization : {},
	plugins: [...basicPlugins, ...plugins]
}