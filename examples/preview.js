var fs = require("fs");
var postcss = require("postcss");
var webGtk = require("../.");

var source = __dirname + "/Adwaita/gtk.css";
var output = __dirname + "/gtk.css";

var css = fs.readFileSync(source, "utf8");

postcss([webGtk])
    .process(css, {from: source, to: output})
    .then(function (result) {
        result.warnings().forEach(function (message) {
            console.warn(message.toString());
        });
        fs.writeFileSync(output, result.css);
    });
