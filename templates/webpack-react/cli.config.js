const name = require('./package.json').name;
module.exports = {
    proxy: (env) => {
        const isDev = env !== 'pre';
        return {
            '/': isDev ? 'http://baidu.com/dev' : 'http://baidu.com/pre'
        };
    },
    output: {
      library:`${name}-[name]`,
      libraryTarget:'umd',
      globalObject:'window',
      publicPath:'/',
    },
    devServer: {
        port: 5000,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        host:'localhost',
        hot: false,
        static: false,
        liveReload: false
    },
    env: {
        __ENV__: (env) => {
            return {
                dev: 'dev',
                pre: 'pre',
                publish: 'publish',
            }[env];
        }
    }
};
