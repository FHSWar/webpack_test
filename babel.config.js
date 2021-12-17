// 转现代语法为旧浏览器兼容语法
module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                useBuiltIns: 'usage', // 按需引入 polyfill
                corejs: 3, // 帮助开发者模拟一个包含众多新特性的运行环境
            }
        ],
        [
            '@babel/preset-typescript', // 引用Typescript插件
            {
                allExtensions: true, // 支持所有文件扩展名，使 vue 被 babel 编译
                isTSX: true // 支持 tsx
            },
        ],
    ],
    "plugins": [
        [
            '@babel/plugin-transform-runtime', // 使函数以模块的形式复用而不是每次使用都拷贝
            {
              corejs: 3,
            },
        ],
        "@vue/babel-plugin-jsx"
    ]
}