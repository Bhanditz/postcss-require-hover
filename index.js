var postcss = require('postcss');

function wrapInMediaQuery(node) {
    return (
        '@media not all and (hover: none), (-ms-high-contrast: none) {' +
        node +
        '}'
    );
}

module.exports = postcss.plugin('postcss-require-hover', function () {
    return function (root) {
        root.walkRules(function (rule) {
            if (rule.selector.indexOf(':hover') !== -1) {
                var clone = rule.clone();
                var hoverSelectors = [];

                var selectors = rule.selectors.filter(function (selector) {
                    if (selector.indexOf(':hover') !== -1) {
                        hoverSelectors.push(selector);
                        return false;
                    }
                    return true;
                });

                if (selectors.length > 0) {
                    clone.selectors = hoverSelectors;
                    rule.selectors = selectors;
                    rule.parent.prepend(wrapInMediaQuery(clone));
                } else {
                    rule.replaceWith(wrapInMediaQuery(clone));
                }
            }
        });
    };
});
