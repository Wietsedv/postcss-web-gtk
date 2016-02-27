var postcss = require("postcss");
var selectorParser = require("postcss-selector-parser");

var gtkNodes = {
    "*": {
        classes: ['background'],
        pseudo: ['disabled', 'hover', 'focus', 'indeterminate', 'checked']
    },
    "button": {
        replacement: null,
        classes: ['image-button', 'text-button'],
        children: false
    }
};

var filterTags = function (tagNode) {
    var nodeName = tagNode.value;
    if (gtkNodes.hasOwnProperty(nodeName)) {
        var gtkNode = gtkNodes[nodeName];
        if (typeof gtkNode.replacement == 'boolean') {
            if (!gtkNode.replacement) {
                tagNode.parent.removeSelf();
            }
        } else if (typeof gtkNode.replacement == 'string') {
            tagNode.replaceWith(gtkNode.replacement);
        }
    } else {
        tagNode.parent.removeSelf();
    }
};

var filterClasses = function (classNode) {
    var prevNode = classNode;
    while (prevNode.prev()) {
        if (prevNode.prev().type == 'combinator') // TODO Test this line
            break;
        prevNode = prevNode.prev();
    }

    var searchNodes;
    if (prevNode.type == 'tag')
        searchNodes = [prevNode.value, '*'];
    else
        searchNodes = Object.keys(gtkNodes);

    for (var nodeKey in searchNodes) {
        if (searchNodes.hasOwnProperty(nodeKey)) {
            var classes = gtkNodes[searchNodes[nodeKey]].classes;
            if (classes === false)
                break;
            if (classes.indexOf(classNode.value) > -1)
                return;
        }
    }
    classNode.parent.removeSelf();
};

var transform = function (selectors) {
    selectors.eachTag(filterTags);
    selectors.eachClass(filterClasses);

    selectors.eachPseudo(function(pseudo) {
        //TODO Support pseudo classes
        pseudo.parent.removeSelf();
    });
};

module.exports = postcss.plugin("gtk-selector-fixer", function (opts) {
    return function (css) {
        css.walkRules(function (rule) {
            if (rule.parent.type == "atrule")
                return;

            rule.selector = selectorParser(transform).process(rule.selector).result;
            if (rule.selector.length == 0)
                rule.remove();
        });
    };
});
