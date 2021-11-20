// webpack 的核心配置，通过在 package.json 中指定 --config 让根目录的 config 文件夹中的 webpack.config.js 能被读取到
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require("vue-loader/lib/plugin-webpack5")
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const miniSVGDataURI = require('mini-svg-data-uri');
const [HTMLPlugins, Entries] = require('./multipage_process')
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PRODUCTION = 'production', DEVELOPMENT = 'development', ANALYSIS = 'analysis'
const isDev = process.env.NODE_ENV === DEVELOPMENT
const isProd = process.env.NODE_ENV === PRODUCTION
const isAnls = process.env.NODE_ENV === ANALYSIS

const config = {
    entry: Entries, // entry 默认是 './src/index.js'
    output: { // output 的 filename 默认是 main.js，path 默认是 dist 文件夹
        filename: '[name]/index[contenthash].js',
        // path: __dirname + '/distdist', // path 得是绝对路径，用 path 模块或者 __dirname 全局变量都行
        // 不指定文件夹名的话就会输出到 output 根目录了，这个 contenthash 写成 name 就不 hash 了，hash 已经 deprecated
        assetModuleFilename: 'assets/[contenthash][ext]',
        // 每次自动清空 dist 文件夹
        clean: true
    },
    resolve: {
        // extensions: ['.js', '.vue', '.json'],
        alias: {
            Fonts: path.resolve(__dirname, '../src/public/fonts'),
            Icons: path.resolve(__dirname, '../src/public/icons'),
            Images: path.resolve(__dirname, '../src/public/images'),
        },
    },
}

const devServer = {
    // devServer 是用来本地开发的，里面的 static 以前是 contentBase
    devServer: {
        // 默认是 ./public/index.html, 其实可以 output 指定为 public 文件夹然后这个就可以不配置
        static: './dist',
        // hot: true // 默认 HMR 和 live-reload 都是开启的
    },
}

const modules = {
    // module 里面可以放 loader
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.ejs$/, 
                use: {
                  loader: 'ejs-compiled-loader',
                  options: {
                    htmlmin: true,
                    htmlminOptions: {
                      removeComments: true
                    }
                  }
                }
            },
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
                test: /\.(png|jpg?g|gif)$/i,
                // 用于取代 webpack 的 file-loade，url-loader
                type: 'asset',
                parser: {
                    // 小于指定大小的资源会被写为内联 base64
                    dataUrlCondition: {
                        // 默认是 8 kb
                        maxSize: 12 * 1024
                    }
                },
                // use: 'svgo-loader'
            },
            {
                test: /\.svg$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 12 * 1024
                    }
                },
                // 通过这个生成的 uri 就不是 base64，会比 base64 更小一点
                generator: {
                    dataUrl(content) {
                    content = content.toString();
                    return miniSVGDataURI(content);
                    }
                },
                use: 'svgo-loader'
            }
        ]
    },
}

const plugins = [
    // 用来压缩图片的，可以无损压缩也可以有损压缩，换对应的 plugin 就好了
    new ImageMinimizerPlugin({
        minimizerOptions: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['mozjpeg', { quality: 80 }],
            // ['jpegtran', { progressive: true }],
            ['pngquant', { quality: [0.6, 0.8], }],
            // ['optipng', { optimizationLevel: 5 }],
          ],
        },
    }),
    // style-loader 的替代选项，区别在于 MiniCSSExtractPlugin.loader 能把 css 从打包的 js 文件中分出来
    new MiniCSSExtractPlugin({
        filename: "[name]/[contenthash].css",
        chunkFilename: "[name]/[id]-[contenthash].css"
    }), 
    // htmlWebpackPlugin 默认能生成一个 index.html，要多页面就多 new 几个
    ...HTMLPlugins,
    new VueLoaderPlugin()
]

// 根据不同的环境追加不同的配置
switch(true) {
    // 用来分析包的大小，提供优化用信息
    case isAnls:
        config.mode = DEVELOPMENT,
        plugins.push(new BundleAnalyzerPlugin())
        break
    // 提供 source-map，方便调适
    case isDev:
        // mode 是给 webpack 分辨以何种方式打包用的
        config.mode = DEVELOPMENT,
        // devTool 用来看到 babel 之前的代码，方便调试
        devServer.devtool = 'source-map'
        break
    // 最小化打包，最大化性能
    case isProd:
        config.mode = PRODUCTION
        devServer.devtool = false
        break
}

module.exports = {
    ...config,
    ...devServer,
    ...modules,
    plugins
}
