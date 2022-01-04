const {
	plugins: analysisPlugins
} = require('./analysis.config')
const {
	entry,
	output,
	_resolve: resolve,
	_module,
	plugins: basicPlugins
} = require('./basic.config')
const {
	devCache,
	devOpt,
	devServer,
	plugins: deveplomentPlugins
} = require('./development.config')
const {
	prodCache,
	prodOpt,
	plugins: productionPlugins
} = require('./production.config')
const {
	DEVELOPMENT,
	PRODUCTION,
	isAnls,
	isDev,
	isProd
} = require('./environment.config')

let cache, mode, stats, devtool, optimization, plugins = []


// 分析和生产模式共有的
if (isAnls || isProd) {
	cache = prodCache
	devtool = false
	mode = PRODUCTION
	_module['rules'][3]['use'].unshift(require('mini-css-extract-plugin').loader)
	optimization = prodOpt
	// 分析生产包才有价值，除了分析专用插件，其它插件 prod 有的 anls 也要有
	plugins.push(...productionPlugins)
}
// 特定于某一个环境的
switch (true) {
	case isAnls:
		plugins.push(...analysisPlugins)
		break
	// 开发模式
	case isDev:
		cache = devCache
		// 方便开发定位代码
		devtool = 'eval-cheap-source-map'
		mode = DEVELOPMENT
		// contenthash 导致抽取 css 会使 HMR 失效，不抽取热加载还快一点
		_module['rules'][3]['use'].unshift('style-loader')
		optimization = devOpt
		// 不需要优化，不开可以缩短启动和热更新时间
		plugins.push(...deveplomentPlugins)
		stats = 'errors-warnings'
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