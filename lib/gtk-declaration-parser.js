var postcss = require("postcss");
var valueParser = require('postcss-value-parser');

module.exports = postcss.plugin("gtk-declaration-parser", function (opts) {
    opts = opts || {};

    return function (css) {
        css.walkDecls(function (decl) {
            var property = decl.prop;
            if (property.match(/^-gtk/i))
                decl.remove();
            // TODO Do not remove useful properties, but convert them

            if(decl.value.match(/^-gtk/i))
                decl.remove();

            // var parsedValue = valueParser(decl.value); TODO Parse GTK values and convert them
        });
    };
});
