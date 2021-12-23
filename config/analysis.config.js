const { analysisPlugin } = require('../customize.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const plugins = []

switch (analysisPlugin) {
    default:
        plugins.push(new BundleAnalyzerPlugin())
}
module.exports = {
    plugins
}