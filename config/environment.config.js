const ANALYSIS = 'analysis', DEVELOPMENT = 'development', PRODUCTION = 'production'
const isAnls = process.env.NODE_ENV === ANALYSIS
const isDev = process.env.NODE_ENV === DEVELOPMENT
const isProd = process.env.NODE_ENV === PRODUCTION

module.exports = {
    isAnls,
    isDev,
    isProd,
    DEVELOPMENT,
    PRODUCTION
}