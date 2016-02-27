var postcss = require("postcss");

module.exports = postcss.plugin("gtk-node-to-web", function (opts) {
    opts = opts || {};

    return function (css) {
        css.walkRules(function (rule) {
            if(rule.parent.type == "atrule")
                return;

            rule.selector = rule.selector
                .replace(/(^|[^.:#(\-\w])\b([\w-]+)\b/g, "$1.$2") // Nodes to Classes
                .replace(/:selected/g, ".selected")
                .replace(/:backdrop/g, ".backdrop")
                .replace(/:drop\(active\)/g, ".drop-active")
                .replace(/:dir\(ltr\)/g, "")
                .replace(/:dir\(rtl\)/g, ".rtl");
            // TODO Change some nodes and pseudo classes to their HTML equivalents
        });
    };
});
