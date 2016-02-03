var postcss = require("postcss");

module.exports = postcss.plugin("gtk-color-variables", function (opts) {
    opts = opts || {};

    var definitions = [];

    return function (css, result) {
        /* Read all variables, store them and remove them from CSS */
        css.walkAtRules("define-color", function (rule) {
            var params = rule.params.split(/ (.*)/);
            definitions[params[0]] = params[1];
            rule.remove();
        });

        /* Replace all color names with the right colors */
        css.replaceValues(/^@\w+$/, {fast: "@"}, function (val) {
            val = val.substring(1);
            if (val in definitions)
                return definitions[val];
            result.warn("Color variable @" + val + " is not defined");
        });
    };
});
