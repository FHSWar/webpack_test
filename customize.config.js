// 数组内放 src/pages 目录下的文件夹名，字符串。
module.exports = {
    // 指定构建或启动 page，生产和测试的打包方式应相同。
    analysisProjects: [],
    developmentProjects: [],
    productionProjects: [],

    // 指定不把小图内联的 page, 不压缩的图片要放到这个 page 自己的图片文件夹中。
    noInlineProjects: [],
    // 指定不进行项目级别图片压缩的 page
    noMinifyProjects: [],

    // 分析构建用插件
    analysisPlugin: ''
}