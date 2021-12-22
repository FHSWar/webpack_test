const CompressionPlugin = require('compression-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const optimization = {
	splitChunks: {
		chunks: 'all'
	}
}
const plugins = [
    new CompressionPlugin(),
    new ImageMinimizerPlugin({
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