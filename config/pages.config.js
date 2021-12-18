const fs = require('fs')
const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")

// 读取该路径下所有文件夹，一个文件夹就是一个页面
const dest = path.resolve(process.cwd(), 'src/pages')
const pagesArr = fs.readdirSync(dest)
const HTMLPlugins = [], Entries = {}
const resolve = folderName => path.resolve(process.cwd(), `src/pages/${folderName}`)

pagesArr.map(page => {
    const pagePath = resolve(page)
    // 每个页面的文件夹下可以含有一个自己的index.html，如果有会根据这个模板进行build
    const pageTemplate = pagePath + '/index.html'
    const pageEntry = pagePath + '/index.js'

    if (fs.existsSync(pageTemplate)) {
        // 根据路径生成 HTMLWebpackPlugin 对象
        const htmlPlugin = new HTMLWebpackPlugin({
            filename: `${page}.html`, // 生成到dist目录下的 html 文件名称
            template: pageTemplate, // 模板文件，不同入口可以根据需要设置不同模板
            chunks: [page] //引入对应的js(对应(entry)中的入口文件)
        });

        HTMLPlugins.push(htmlPlugin);
        Entries[page] = [pageEntry]
    } else {
        // 如果文件夹下没有制定的模板，就打印一下文件夹名
        console.log(`${pageTemplate} 目录下没有 index.html`)
    }
})

module.exports = [HTMLPlugins, Entries]