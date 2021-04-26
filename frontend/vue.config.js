const path = require("path");

module.exports = {
    pages: {
        index: {
            entry: "src/pages/index/main.js",
            template: "public/index.html",
            filename: "index.html"
        },
        live: {
            entry: "src/pages/live/main.js",
            template: "public/live.html",
            filename: "live.html"
        }
    },
    outputDir: path.resolve("../backend/static"),
    devServer: {
       proxy: {
          "/api": {
              target: `${process.env.VUE_APP_BACKEND}/api`,
              changeOrigin: true,
              pathRewrite: {
                  "^/api": ""
              }
          }
       },
        historyApiFallback: true
    }
}