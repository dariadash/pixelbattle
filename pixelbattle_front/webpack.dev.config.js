const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const baseConfig = require('./webpack.config')
require('dotenv').config()

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [new ReactRefreshWebpackPlugin()],
    devServer: {
        hot: true,
        host: process.env.DEV_SERVER_HOST,
        port: +process.env.DEV_SERVER_PORT,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: process.env.BACKEND_DOMAIN,
                changeOrigin: true,
                secure: false,
            },
            {
                context: ['/socket.io'],
                target: process.env.BACKEND_DOMAIN,
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        ],
    },
})