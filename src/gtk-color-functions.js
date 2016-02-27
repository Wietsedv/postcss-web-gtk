var color = require("css-color-converter");
var convert = require("color-convert");

module.exports = require("postcss-functions")({
    functions: {
        mix(color1, color2, frac) {
            var [r1, g1, b1, a1] = color(color1).toRgbaArray();
            var [r2, g2, b2, a2] = color(color2).toRgbaArray();
            var r = r1 + (r2 - r1) * frac;
            var g = g1 + (g2 - g1) * frac;
            var b = b1 + (b2 - b1) * frac;
            var a = a1 + (a2 - a1) * frac;
            return color([r, g, b, a]).toRgbString();
        },

        shade(cl, value) {
            var [r, g, b, a] = color(cl).toRgbaArray();
            var [h, s, l] = convert.rgb.hsl(r, g, b);
            l *= value;
            return color().fromHsla([h, s, l, a]).toHslString();
        },

        alpha(cl, factor) {
            var [r, g, b, a] = color(cl).toRgbaArray();
            a *= factor;
            return color([r, g, b, a]).toRgbString();
        }
    }
});
