const { loopWhile } = require('deasync')
const ESLintPlugin = require('eslint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const MiniSVGDataURI = require('mini-svg-data-uri')
const { networkInterfaces } = require('os');
const { resolve } = require('path')
const { getPort } = require('portfinder');
const { VueLoaderPlugin } = require("vue-loader")
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
    entry: Entries,
    output: {
        filename: '[name]/index[contenthash].js',
        assetModuleFilename: 'assets/[contenthash][ext]',
        clean: true
    },
    resolve: {
        alias: {
            '@': resolve('src'),
            '@fonts': resolve(__dirname, '../src/public/fonts'),
            '@icons': resolve(__dirname, '../src/public/icons'),
            '@images': resolve(__dirname, '../src/public/images'),
            '@utils': resolve(__dirname, '../src/public/utils'),
        },
    },
}

const devServer = {
    port,
    static: './dist',
}

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
            test: /\.(gif|jpe?g|png)$/i,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 12 * 1024
                }
            },
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.(s[ac]|c)ss$/i,
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
            use: ['vue-loader']
        }
    ]
}

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
    new ImageMinimizerPlugin({
        minimizerOptions: {
            plugins: [
                ['gifsicle', { interlaced: true }],
                ['mozjpeg', { quality: 80 }],
                ['pngquant', { quality: [0.6, 0.8], }],
            ],
        },
    }),
    new MiniCSSExtractPlugin({
        filename: "[name]/[contenthash].css",
        chunkFilename: "[name]/[id]-[contenthash].css"
    }),
    ...HTMLPlugins,
    new VueLoaderPlugin()
]

function getUsablePort(customPort) {
    getPort(
        {
            port: customPort,
            stopPort: customPort + 999
        },
        (err, usablePort) => {
            if (err) throw new Error('portFinder error', err)
            done = true
            port = usablePort
        }
    )
    loopWhile(() => !done);
}

switch (true) {
    case isAnls:
        basic.mode = DEVELOPMENT,
            plugins.push(new BundleAnalyzerPlugin())
        break
    case isDev:
        basic.mode = DEVELOPMENT,
            basic.stats = 'errors-warnings',
            basic.devtool = 'source-map'
        break
    case isProd:
        basic.mode = PRODUCTION
        basic.devtool = false
        break
}

module.exports = {
    ...basic,
    devServer,
    module: _module,
    optimization,
    plugins
}