const {
	analysisProjects,
	developmentProjects,
	productionProjects
} = require('../customize.config')
const {
	isAnls,
	isDev,
	isProd
} = require('./environment.config')
const fs = require('fs')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const dest = path.resolve(process.cwd(), 'src/pages')
const pagesArr = []
const HTMLPlugins = [], Entries = {}
const resolve = folderName => path.resolve(process.cwd(), `src/pages/${folderName}`)

switch (true) {
	case isAnls:
		pagesArr.push(...analysisProjects)
		break
	case isDev:
		pagesArr.push(...developmentProjects)
		break
	case isProd:
		pagesArr.push(...productionProjects)
		break
	default:
		console.log('错误的环境设置!')
}
pagesArr.length ? null : pagesArr.push(...fs.readdirSync(dest))

pagesArr.map(page => {
	const pagePath = resolve(page)
	const pageTemplate = pagePath + '/index.html'
	const pageEntry = pagePath + '/index.js'

	if (fs.existsSync(pageTemplate)) {
		const htmlPlugin = new HTMLWebpackPlugin({
			filename: `${page}.html`,
			template: pageTemplate,
			chunks: [page]
		})

		HTMLPlugins.push(htmlPlugin)
		Entries[page] = [pageEntry]
	} else {
		console.log(`${pageTemplate} 目录下没有 index.html`)
	}
})

module.exports = [HTMLPlugins, Entries]