import postcss from 'postcss';
import test    from 'ava';

import webGtk from './';

function run(t, input, output, opts = {}) {
    return postcss([webGtk(opts)]).process(input)
        .then(result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

test('Replace color variables with values', t => {
    var input = 'div{color:@text_color;background-color: @background_color;}' +
        '@define-color text_color #fff;' +
        '@define-color background_color rgba(0, 0,0,0.5);';
    var output = 'div{color:#fff;background-color: rgba(0, 0,0,0.5);}';
    return run(t, input, output, {});
});
