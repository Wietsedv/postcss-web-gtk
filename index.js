var postcss = require('postcss');

var plugins = {
    GtkColorDefinitions: require('./lib/gtk-color-variables.js')
};

module.exports = postcss.plugin('postcss-web-gtk', function (opts) {
    opts = opts || {};

    var processor = postcss();

    for (var key in plugins)
        if (plugins.hasOwnProperty(key))
            processor.use(plugins[key]);

    return processor;
});
