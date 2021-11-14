// webpack 的核心配置
/*
    mode 是给 webpack 分辨以何种方式打包用的
    module 里面可以放 loader
    devServer 是用来本地开发的，里面的 static 以前是 contentBase
    devTool 用来看到 babel 之前的代码，方便调试
*/
let mode
process.env.NODE_ENV === 'production' ? mode = 'production' : mode = 'development'

module.exports = {
    mode,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },

    devServer: {
        static: './dist'
    },
    devtool: 'source-map'
}