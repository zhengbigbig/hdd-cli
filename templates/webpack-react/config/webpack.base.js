const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const webpack = require('webpack');
const { getEnvVariable, cssModule, lessLoader, getStyleLoaders } = require('./utils');

module.exports = {
    entry: paths.entry,
    output: {
        path: paths.build,
        filename: '[name].[contenthash].js',
        publicPath: '',
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: getStyleLoaders({
                    importLoaders: 1,
                }),
                sideEffects: true,
            },
            {
                test: /global.less/,
                use: getStyleLoaders(
                    {
                        importLoaders: 2,
                    },
                    lessLoader
                ),
                sideEffects: true,
            },
            {
                test: /\.less$/,
                exclude: /global.less/,
                use: getStyleLoaders(cssModule, lessLoader),
                sideEffects: true,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                type: 'asset',
                generator: {
                    filename: 'images/[name]_[hash:8][ext][query]',
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 20kb
                    },
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    publicPath: '../',
                    filename: 'fonts/[name][hash:8][ext][query]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
        alias: {
            '@': paths.src,
            '@c': paths.src + '/components',
            '@m': paths.src + '/models',
            '@r': paths.src + '/routers',
            '@s': paths.src + '/services',
            '@t': paths.src + '/types',
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: paths.html,
        }),
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin(getEnvVariable(require(paths.config))),
    ],
}
