const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: ['./src/index.jsx'],
    output: {
        filename: "[name].entry.js",
        chunkFilename: "weagle.[name].[hash].chunk.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Weaglevancements",
            meta: {
                viewport: "width=device-width; initial-scale=1",
            },
        }),
    ],
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".jsx", ".css"],
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /\/node_modules\//,
            use: "babel-loader",
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, {
            test: /\.(ttf|woff2?|eot|svg)$/,
            use: 'file-loader',
        }, {
            test: /\.(png|jpg)$/i,
            type: "asset/resource",
        }],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        }
    },
}

