const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const { merge } = require('webpack-merge');
const common = require('./webpack.base');
const { ANALYZER } = process.env;
const paths = require('./paths');
const config = require(paths.config);

/** @type {import('webpack').Configuration} */

module.exports = () => {
    const webpackConfig = merge(common, {
        mode: 'production',
        output: Object.assign(
            {},
            {
                filename: 'js/[name].[chunkhash:8].js',
                chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
            },
            config.output
        ),
        // devtool: 'hidden-source-map',
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/style.[contenthash:8].css',
                chunkFilename: 'css/style.[contenthash:8].chunk.css',
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
                new CssMinimizerPlugin({
                    parallel: true,
                    minimizerOptions: {
                        map: false,
                        parser: safePostCssParser,
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',
                name: false,
            },
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            },
        },
    });
    if (ANALYZER) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
    return webpackConfig;
};
