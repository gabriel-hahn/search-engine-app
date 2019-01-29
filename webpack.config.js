require("babel-polyfill");
const path = require('path');

module.exports = {
    entry: ["babel-polyfill", "./src/app.js"],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                }],
            },
        ],
    },
};
