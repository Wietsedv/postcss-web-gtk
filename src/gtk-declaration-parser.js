var postcss = require("postcss");

module.exports = postcss.plugin("gtk-declaration-parser", function (opts) {
    opts = opts || {};
    var fastFilter = /(^-gtk)/i;
    var newValues = {
        "$1": /^-gtk-scaled\((.*),\s*(.*)\)$/g
    };

    return function (css) {
        css.walkDecls(function (decl) {
            var property = decl.prop;
            if (property.match(/^-gtk/i))
                decl.remove();

            if (decl.value.match(fastFilter)) {
                for (var replace in newValues)
                    if (newValues.hasOwnProperty(replace) &&
                        decl.value.match(newValues[replace])) {
                        decl.value = decl.value.replace(newValues[replace], replace);
                        return;
                    }
                decl.remove();
            }
        });
    };
});
