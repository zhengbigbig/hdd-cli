const { argv } = require('yargs');
const loaderUtils = require('loader-utils');
const isDev = argv.mode === 'development';
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssModule = {
    importLoaders: 2,
    modules: {
        getLocalIdent: (context, localIdentName, localName, options) => {
            const fileNameOrFolder = '[folder].[name]';
            const hash = loaderUtils.getHashDigest(
                path.posix.relative(context.rootContext, context.resourcePath) + localName,
                'md5',
                'base64',
                5
            );
            const className = loaderUtils.interpolateName(
                context,
                fileNameOrFolder + '_' + localName + '__' + hash,
                options
            );
            return className.replace('.module_', '_').replace(/\./g, '_');
        },
    },
};

const lessLoader = {
    loader: 'less-loader',
    options: {
        lessOptions: {
            javascriptEnabled: true,
        },
    },
};

const getStyleLoaders = (cssLoaderOptions, preProcessor) => {
    const loaders = [
        isDev
            ? require.resolve('style-loader')
            : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                      // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/649
                      esModule: false,
                  },
              },
        {
            loader: require.resolve('css-loader'),
            options: cssLoaderOptions,
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    plugins: [
                        require('postcss-flexbugs-fixes'),
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }),
                    ],
                },
            },
        },
    ].filter(Boolean);

    if (preProcessor) {
        loaders.push(preProcessor);
    }
    return loaders;
};

/* 读取mock下的所有js文件 */
function findSync(startPath) {
    let result = [];
    let files = fs.readdirSync(startPath);

    files.forEach((val) => {
        let file = path.join(startPath, val);
        let stats = fs.statSync(file);

        if (stats.isDirectory()) {
            result.push(...findSync(file));
        } else if (stats.isFile()) {
            result.push(file);
        }
    });

    return result;
}

/* 通过require获取js文件中导出的函数，执行并传递app参数 */
const mockServer = (mockFolder) => {
    let mockObj = {};
    findSync(mockFolder).forEach((dir) => (mockObj = Object.assign({}, mockObj, require(dir))));
    console.log('mockObj', mockObj);
    console.log('Mock: service started successfully ✔');
    return mockObj;
};

/* 根据自定义配置注入环境变量到webpack，接收函数和对象 */
const getEnvVariable = (config) => {
    const { env } = config;
    const processEnv = process.env.ENV || 'dev';
    const envVariable = {
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        __ENV__: JSON.stringify(processEnv),
    };

    const allEnv = Object.assign({}, typeof env === 'object' && typeof env !== null ? env : {});

    Object.keys(allEnv).forEach((key) => {
        const val = allEnv[key];
        envVariable[key] = JSON.stringify(typeof val === 'function' ? val(processEnv) : val);
    });

    return envVariable;
};


module.exports = {
    isDev,
    cssModule,
    lessLoader,
    getStyleLoaders,
    mockServer,
    getEnvVariable,
};
