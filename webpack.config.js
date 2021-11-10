const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: '../../[resource-path]',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin([{ from: 'assets', to: 'assets' }]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000,
        hot: true,
        writeToDisk: true,
    },
}
