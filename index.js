var postcss = require('postcss');

var plugins = {
    atImport: require('postcss-import'),
    GtkColorDefinitions: require('./lib/gtk-color-variables.js'),
    GtkNodeToWeb: require('./lib/gtk-node-to-web.js')
};

module.exports = postcss.plugin('postcss-web-gtk', function (opts) {
    opts = opts || {};

    var processor = postcss();

    for (var key in plugins)
        if (plugins.hasOwnProperty(key))
            processor.use(plugins[key]);

    return processor;
});
