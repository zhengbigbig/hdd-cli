const path = require('path');

const resolvePath = (relativeCwdPath) => path.resolve(process.cwd(), relativeCwdPath);

module.exports = {
    // Source files
    src: resolvePath('src'),

    // Production build files
    build: resolvePath('dist'),

    // Static files that get copied to build folder
    public: resolvePath('public'),

    // entry
    entry: resolvePath('src/index'),

    // html template
    html: resolvePath('public/index.html'),

    // custom config file
    config: resolvePath('cli.config.js'),

    // mock folder entry
    mock: resolvePath('mock'),
};
