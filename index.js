var postcss = require("postcss");

module.exports = postcss.plugin("postcss-web-gtk", function (opts) {
    opts = opts || {};

    var processor = postcss();

    processor.use(require("import-postcss"));
    processor.use(require("./lib/gtk-color-variables.js"));
    processor.use(require("./lib/gtk-color-functions.js"));
    processor.use(require("./lib/gtk-node-to-web.js"));

    return processor;
});
