// webpack 的核心配置，通过在 package.json 中指定 --config 让根目录的 config 文件夹中的 webpack.config.js 能被读取到
const { loopWhile } = require('deasync')
const ESLintPlugin = require('eslint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const MiniSVGDataURI = require('mini-svg-data-uri')
const { networkInterfaces } = require('os');
const { resolve } = require('path')
const { getPort } = require('portfinder');
const VueLoaderPlugin = require("vue-loader/lib/plugin-webpack5")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const [HTMLPlugins, Entries] = require('./pages.config')

const PRODUCTION = 'production', DEVELOPMENT = 'development', ANALYSIS = 'analysis'
const isAnls = process.env.NODE_ENV === ANALYSIS
const isDev = process.env.NODE_ENV === DEVELOPMENT
const isProd = process.env.NODE_ENV === PRODUCTION
const IP = networkInterfaces()['en0'][1]['address']

let port = 9000, done = false
getUsablePort(port)

const basic = {
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
            '@': resolve('src'),
            '@fonts': resolve(__dirname, '../src/public/fonts'),
            '@icons': resolve(__dirname, '../src/public/icons'),
            '@images': resolve(__dirname, '../src/public/images'),
            '@utils': resolve(__dirname, '../src/public/utils'),
        },
    },
}

// devServer 是用来本地开发的，里面的 static 以前是 contentBase
const devServer = {
    // hot: true // 默认 HMR 和 live-reload 都是开启的
    port,
    // 默认是 ./public/index.html, 其实可以 output 指定为 public 文件夹然后这个就可以不配置
    static: './dist',
}

// module 里面可以放 loader
const _module = {
    rules: [
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
            test: /\.(gif|jpg?g|png)$/i,
            // 用于取代 webpack 的 file-loade，url-loader，自带超强压缩！
            // 只要文件相同，最后打包出来hash相同，也就是只会有一份，也就是说项目里图片重复了也不会影响包的大小
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
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
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
                return MiniSVGDataURI(content);
                }
            },
            use: 'svgo-loader'
        },
        {
            test: /.vue$/,
            use: ['vue-loader']// , 'eslint-loader'
        }
    ]
}

// 最合理的代码分割，让该共用的部分共用
const optimization = {
    splitChunks: {
        chunks: 'all'
    }
}

const plugins = [
    new ESLintPlugin({
        fix: true,
        extensions: ['js', 'json', 'vue'],
    }),
    new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
            messages: [
                `You application is running here: http://localhost:${port}`,
                `You can also visit it by: http://${IP}:${port}`
            ],
        },
    }),
    // 用来压缩图片的，可以无损压缩也可以有损压缩，换对应的 plugin 就好了，可以用 filter 对不同目录和大小的图片单独处理
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
    /* new ImageMinimizerPlugin({
        deleteOriginalAssets: false,
        // filename: '[path][name].webp',
        // filename: 'webp/[name]_[fullhash].webp',
        filter: (source, sourcePath) => {
            if(sourcePath.endsWith('.svg') || source.byteLength < 12 * 1024) return false
            return true
        },
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
    }), */
    // style-loader 的替代选项，区别在于 MiniCSSExtractPlugin.loader 能把 css 从打包的 js 文件中分出来
    new MiniCSSExtractPlugin({
        filename: "[name]/[contenthash].css",
        chunkFilename: "[name]/[id]-[contenthash].css"
    }), 

    // htmlWebpackPlugin 默认能生成一个 index.html，要多页面就多 new 几个
    ...HTMLPlugins,
    new VueLoaderPlugin()
]

// portFinder 是异步的，通过 deasync 转为阻塞的同步代码
function getUsablePort(customPort){
    getPort(
        {
            port: customPort,    // minimum port
            stopPort: customPort + 999 // maximum port
        },
        (err, usablePort) => {
            if(err) throw new Error('portFinder error', err)
            done = true
            port = usablePort
        }
    )
    loopWhile(() => !done);
}

// 根据不同的环境追加不同的配置
switch(true) {
    // 用来分析包的大小，提供优化用信息
    case isAnls:
        basic.mode = DEVELOPMENT,
        plugins.push(new BundleAnalyzerPlugin())
        break
    // 提供 source-map，方便调适
    case isDev:
        // mode 是给 webpack 分辨以何种方式打包用的
        basic.mode = DEVELOPMENT,
        // 关掉 webpack 原有的 terminal 冗余输出
        basic.stats = 'errors-warnings',
        // devTool 用来看到 babel 之前的代码，方便调试
        basic.devtool = 'source-map'
        break
    // 最小化打包，最大化性能
    case isProd:
        basic.mode = PRODUCTION
        basic.devtool = false
        break
}

module.exports = {
    ...basic,
    devServer,
    // nodejs 顶层作用域不能用 module，所以加个下划线区分下
    module: _module,
    // optimization,
    plugins
}