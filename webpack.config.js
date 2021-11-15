// webpack 的核心配置
let mode
process.env.NODE_ENV === 'production' ? mode = 'production' : mode = 'development'

const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode,

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
            }
        ]
    },
    plugins: [new MiniCSSExtractPlugin()],
    devServer: {
        static: './dist',
        // hot: true
    },
    devtool: 'source-map'
}
/*
    mode 是给 webpack 分辨以何种方式打包用的
    module 里面可以放 loader
    devServer 是用来本地开发的，里面的 static 以前是 contentBase
    devTool 用来看到 babel 之前的代码，方便调试，hot 默认就是 true
*/