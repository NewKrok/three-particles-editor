const path = require("path");

module.exports = {
  entry: "./src/js/three-particles-editor.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
