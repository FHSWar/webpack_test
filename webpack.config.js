// webpack 的核心配置
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let mode
process.env.NODE_ENV === 'production' ? mode = 'production' : mode = 'development'

module.exports = {
    // mode 是给 webpack 分辨以何种方式打包用的
    mode,
    // entry: './src/main.js', // entry 默认是 './src/index.js'
    output: { // output 的 filename 默认是 main.js，path 默认是 dist 文件夹
        // filename: 'bundle.js',
        // path: __dirname + '/distdist', // path 得是绝对路径，用 path 模块或者 __dirname 全局变量都行
        // 不指定文件夹名的话就会输出到 output 根目录了，这个 fullhash 写成 name 就不 hash 了，hash 已经 deprecated
        assetModuleFilename: 'assets/[fullhash][ext]',
    },
    // module 里面可以放 loader
    module: {
        rules: [
            {
                // css, sass, scss 文件都会被正确的处理
                test: /\.(s[ac]|c)ss$/i,
                // 不加 scss loader 不会报错但是 scss 文件会不生效
                // postcss-loader 应该在 sass-loader 前面，虽然反过来也不报错，但 postcss-loader 就会失效，因为没加到前缀
                use: [MiniCSSExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                // 用于取代 webpack 的 file-loade，url-loader
                test: /\.(png|jpg?g|svg|gif)$/i,
                type: 'asset',
                // parser: {
                //     // 小于指定大小的资源会被写为内联 base64
                //     dataUrlCondition: {
                //         // 默认是 8 kb
                //         maxSize: 50 * 1024 // 50kb
                //     }
                // },
                // use: 'svgo-loader'
            }
        ]
    },
    plugins: [
        // style-loader 的替代选项，区别在于 MiniCSSExtractPlugin.loader 能把 css 从打包的 js 文件中分出来
        new MiniCSSExtractPlugin(), 
        // 默认能从 src/index.html 提取给到 dist 用
        new HtmlWebpackPlugin({
            // 默认就是这个 template
            // tempalate: "./src/index.html"
        })
    ],
    // devServer 是用来本地开发的，里面的 static 以前是 contentBase
    devServer: {
        // 默认是 ./public/index.html, 其实可以 output 指定为 public 文件夹然后这个就可以不配置
        static: './dist',
        // hot: true // 默认 HMR 和 live-reload 都是开启的
    },
    // devTool 用来看到 babel 之前的代码，方便调试
    devtool: 'source-map'
}
/*
    
    
    
    
*/