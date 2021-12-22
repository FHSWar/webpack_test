const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const plugins = [
    new BundleAnalyzerPlugin()
]

module.exports = {
    plugins
}