var postcss = require("postcss");

var variable = function (variables, node, str, name, opts, result) {
    if (opts.only) {
        if (typeof opts.only[name] !== "undefined") {
            return opts.only[name];
        }
        return str;
    }
    if (typeof variables[name] !== "undefined") {
        return variables[name];
    }

    result.warn(`@${name} is undefined`);
    return str;
};

var simpleSyntax = function (variables, node, str, opts, result) {
    return str.replace(/(^|[^\w])@([\w\d-_]+)/g, function (_, bef, name) {
        return bef + variable(variables, node, "@" + name, name, opts, result);
    });
};

var inStringSyntax = function (variables, node, str, opts, result) {
    return str.replace(/@\(\s*([\w\d-_]+)\s*\)/g, function (all, name) {
        return variable(variables, node, all, name, opts, result);
    });
};

var bothSyntaxes = function (variables, node, str, opts, result) {
    str = simpleSyntax(variables, node, str, opts, result);
    str = inStringSyntax(variables, node, str, opts, result);
    return str;
};

var currentColor = function (decl) {
    var currentColor;
    if (decl.prop == 'color') {
        return '#000'; // TODO Change this somehow to the parent color value
    } else {
        decl.parent.walkDecls(/^color$/, function(colorDecl) {
            return colorDecl.value;
        });
    }
    return '#000';
};

module.exports = postcss.plugin("gtk-color-variables", function (opts) {
    opts = opts || {};

    var definitions = [];

    return function (css, result) {
        /* Read all variables, store them and remove them from CSS */
        css.walkAtRules("define-color", function (rule) {
            var params = rule.params.split(/ (.*)/);
            var value = bothSyntaxes(definitions, rule, params[1], opts, result);
            value = value.replace(/\s/g, "");
            definitions[params[0]] = value;
            rule.remove();
        });

        css.walkDecls(function (decl) {
            if (decl.value.toString().indexOf("@") !== -1) {
                decl.value = bothSyntaxes(definitions, decl, decl.value, opts, result);
            }
            if (decl.value.indexOf("currentColor") !== -1) {
                decl.value = decl.value.replace("currentColor", currentColor(decl));
            }
        });
    };
});
