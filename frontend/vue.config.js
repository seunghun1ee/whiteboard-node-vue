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
    }
}