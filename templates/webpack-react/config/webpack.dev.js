const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsPlugin = require('@soda/friendly-errors-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const apiMocker = require('mocker-api');
const { mockServer } = require('./utils');
const paths = require('./paths');
const config = require(paths.config);

const { MOCK, ENV = 'dev' } = process.env;

/** @type {import('webpack').Configuration} */

module.exports = merge(require('./webpack.base'), {
    mode: 'development',
    devServer: Object.assign(
        {},
        {
            port: 3000,
            static: paths.build,
            open: true,
            hot: true,
            host: 'localhost',
            historyApiFallback: true,
            // 配置mock环境
            setupMiddlewares: (middlewares, devServer) => {
                if (MOCK) {
                    const mockObj = mockServer(paths.mock);
                    apiMocker(devServer.app, mockObj, {
                        proxy: {
                            // '/repos/(.*)': 'https://api.github.com/',
                            // '/:owner/:repo/raw/:ref/(.*)': 'http://127.0.0.1:2018',
                        },
                        changeHost: true,
                    });
                }
                return middlewares;
            },
            // 配置联调环
            proxy: MOCK ? {} : typeof config.proxy === 'function' ? config.proxy(ENV) : config.proxy,
        },
        config.devServer
    ),
    target: 'web',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new CaseSensitivePathsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [
                    `You application is running here ${config.devServer.host || 'http://localhost'}:${
                        config.devServer.port || 3000
                    }`,
                ],
                notes: ['Some additional notes to be displayed upon successful compilation'],
            },
            onErrors: function (severity, errors) {
                // You can listen to errors transformed and prioritized by the plugin
                // severity can be 'error' or 'warning'
            },
            // should the console be cleared between each compilation?
            // default is true
            clearConsole: true,

            // add formatters and transformers (see below)
            additionalFormatters: [],
            additionalTransformers: [],
        }),
    ],
    devtool: 'eval-cheap-module-source-map',
});
