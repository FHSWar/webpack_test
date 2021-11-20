const fs = require("fs")
const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const pagesConfig = require('./pages.config')

const resolve = folderName => path.resolve(process.cwd(), `src/pages/${folderName}`)

const HTMLPlugins = [], Entries = {}

pagesConfig.forEach(item => {
    // 支持多级目录 dir/page.html，多页面框架中可以采用这种方式增加层级目录，一个目录下有多个页面
    let pagePath 
    item.dir
        ? pagePath = resolve(`${item.dir}/${item.page}`)
        : pagePath= resolve(`${item.page}`)

    // 每个页面的文件夹下可以含有一个自己的index.html，如果有会根据这个模板进行build
    let pageTemplate = pagePath + '/index.html'
    let pageEntry = pagePath + '/index.js'
    // 如果文件夹下没有制定的模板，就报错
    if (!fs.existsSync(pageTemplate)) throw new Error('对应目录下没有 index.html')
    const htmlPlugin = new HTMLWebpackPlugin({
        inject: true,
        title: item.title, // 生成的html页面的标题
        filename: `${item.page}.html`, // 生成到dist目录下的 html 文件名称
        template: pageTemplate, // 模板文件，不同入口可以根据需要设置不同模板
        chunks: [item.page] // html文件中需要要引入的 js模块，这里的 vendor 是 webpack 默认配置下抽离的公共模块的名称
    });

    HTMLPlugins.push(htmlPlugin);

    Entries[item.page] = [pageEntry]
})


module.exports = [HTMLPlugins, Entries]