const { loopWhile } = require('deasync')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { networkInterfaces } = require('os')
const { getPort } = require('portfinder')
const IP = networkInterfaces()['en0'][1]['address']
const getUsablePort = (customPort) => {
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
    loopWhile(() => !done)
}

let port = 9000, done = false
getUsablePort(port)

const devServer = {
    port,
    static: './dist'
}

const plugins = [
    new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
            messages: [
                `Local: http://localhost:${port}`,
                `Network: http://${IP}:${port}`
            ]
        }
    })
]


module.exports = {
    devServer,
    plugins
}