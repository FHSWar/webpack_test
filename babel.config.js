// 转现代语法为旧浏览器兼容语法
module.exports = {
	'presets': [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage', // 按需引入 polyfill
				corejs: 3 // 帮助开发者模拟一个包含众多新特性的运行环境
			}
		]
	],
	'plugins': [
		[
			'@babel/plugin-transform-runtime', // 使函数以模块的形式复用而不是每次使用都拷贝
			{
				corejs: 3
			}
		],
		'@vue/babel-plugin-jsx'
	]
}