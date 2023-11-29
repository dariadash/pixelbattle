const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config')
require('dotenv').config()

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        host: process.env.DEV_SERVER_HOST,
        port: +process.env.DEV_SERVER_PORT,
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: process.env.BACKEND_DOMAIN,
                changeOrigin: true,
                secure: false
            },
            "/socket.io": {
                target: process.env.BACKEND_DOMAIN,
                changeOrigin: true,
                secure: false
            }
        },
    },
})