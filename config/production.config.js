const CompressionPlugin = require('compression-webpack-plugin')
const { noMinifyProjects } = require('../customize.config')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { resolve } = require('path')

const optimization = {
    splitChunks: {
        chunks: 'all'
    }
}
const plugins = [
    new CompressionPlugin(),
    new ImageMinimizerPlugin({
        filter: (_, sourcePath) => {
            const noMinify = noMinifyProjects
                .map(project => {
                    return resolve(__dirname, `../src/pages/${project}`)
                })
                .map(abs => `${process.cwd()}/${sourcePath}`.includes(abs))
                .filter(flag => flag === true)[0]
            if (noMinify) {
                return false
            }else{
                return true
            }
        },
        minimizerOptions: {
            plugins: [
                ['gifsicle', { interlaced: true }],
                ['mozjpeg', { quality: 80 }],
                ['pngquant', { quality: [0.6, 0.8] }]
            ]
        }
    })
]

module.exports = {
    optimization,
    plugins
}