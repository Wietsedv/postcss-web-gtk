var postcss = require("postcss");

function filteredSelector(rule, filter) {
    if (rule.selector.indexOf(filter) > -1) {
        var filtered = [];
        for (var i in rule.selectors)
            if (rule.selectors.hasOwnProperty(i) &&
                rule.selectors[i].indexOf(filter) == -1)
                filtered.push(rule.selectors[i]);
        if (filtered.length > 0) {
            rule.selector = filtered.join(", ");
        } else
            rule.remove();
    }
    return rule.selector;
}

module.exports = postcss.plugin("gtk-node-to-web", function (opts) {
    opts = opts || {};

    return function (css) {
        css.walkRules(function (rule) {
            rule.selector = filteredSelector(rule, ":dir(rtl)");
            rule.selector = rule.selector
                .replace(/(^|[^.:#(\-\w])\b([\w-]+)\b/g, "$1.$2") // Nodes to Classes
                .replace(/:selected/g, ".selected")
                .replace(/:backdrop/g, ".backdrop")
                .replace(/:drop\(active\)/g, ".drop-active")
                .replace(/:dir\(ltr\)/g, "");
            // TODO Change some nodes and pseudo classes to their HTML equivalents
        });
    };
});
