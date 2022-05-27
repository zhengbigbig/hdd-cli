# React脚手架 

基于Webpack

## 支持项

- TypeScript
- Mock Api
- Less
- ESLint
- Commit Lint
  
## 使用

### 启动

```
yarn start
```

### 打包

```
yarn build
```

### 包分析

```
yarn analyzer
```

### 自定义配置

修改项目根目录文件 cli.config.js

```
{
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
```

### 高度自定义

可直接修改config包下面webpack配置

### 样式配置

- 全局样式： global.less


### 组件

- 已内置antd，若使用其他，可引入依赖后，配置babel.config.js


