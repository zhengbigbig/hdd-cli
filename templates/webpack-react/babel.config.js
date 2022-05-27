const { argv } = require('yargs');
const isDev = argv.mode === 'development';
const plugins = [
    'lodash',
    [
        'const-enum',
        {
            transform: 'constObject',
        },
    ],
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-object-rest-spread',
    //支持import 懒加载
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-async-to-generator',
    'transform-class-properties',
    [
        'import',
        {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true, // or 'css'
        },
        'antd',
    ]
].filter(Boolean);
module.exports = (api) => {
    api.cache(true);
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    corejs: 3.22,
                    useBuiltIns: 'usage',
                },
            ],
            [
                '@babel/preset-react',
                {
                    runtime: 'automatic',
                },
            ],
            '@babel/preset-typescript',
        ],
        plugins: isDev ? [...plugins, 'react-refresh/babel'] : [...plugins]
    };
};
