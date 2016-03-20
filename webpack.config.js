var poststylus = require('poststylus');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var gitCommitHash = require('git-rev-sync');

function generateBuildFileName(extension) {
    var hash = gitCommitHash.short(); // use "short" 7-character hash
    var minified = process.argv.indexOf('-p') !== -1 ||
                   process.argv.indexOf('--optimize-minimize') !== -1;
    return [
        'govis',
        hash,
        'min',
        extension,
    ] // only include .min if we're minifying
    .filter(function (part) { return minified || part !== 'min'; })
    .join('.');
}

module.exports = {
    context: __dirname,
    cache: true,
    entry: [
        'babel-polyfill',
        __dirname + '/src/js/index.js',
    ],
    output: {
        filename: generateBuildFileName('js'),
        path: __dirname + '/build',
    },
    module: {
        loaders: [
            { // JavaScript Loader - bundle .js import hierarchy (starting at index.js) into a single .js file
                test: /\.js$/,
                include: __dirname + '/src/js',
                loader: 'babel',
                query: {
                    plugins: [
                        'transform-runtime',
                        'transform-class-properties',
                        'transform-object-rest-spread',
                        'syntax-trailing-function-commas',
                    ],
                    presets: [
                        'es2015',
                        'react',
                    ],
                }
            },
            { // Style Loader - bundle .styl imports in .js files into a single .css file
                test: /\.styl$/,
                include: __dirname + '/src/style',
                loader: process.env.NODE_ENV === 'production' ? // only use the ExtractTextPlugin in production
                    ExtractTextPlugin.extract('style', 'css!stylus') :
                    'style!css!stylus',
            },
            { // Image Loader - resolve "url(...)" statements in .css files to images
                test: /\.(png|jpg|svg)$/,
                include: __dirname + '/src/images',
                loader: 'url?limit=25000',
            },
            { // JSON Loader - resolve .json imports in .js files to JavaScript objects
                test: /\.json$/,
                include: __dirname + '/src/data',
                loader: 'json',
            },
            { // React Hot Loader - automatically refresh page and reload assets on component .js and .styl changes
                test: /\.(js|styl)$/,
                include: __dirname + '/src/*/components/',
                loader: 'react-hot',
            },
            { // SGF Loader - load Go game files into JSON objects
                test: /\.sgf$/,
                include: __dirname + '/src/data',
                loader: 'sgf',
            },
        ],
    },
    stylus: {
        use: [
            poststylus([
                'autoprefixer', // auto-prefix vendor styles
            ]),
        ],
    },
    plugins: [
        // Instead of embedding css into the file where it is imported,
        // extract all css into a single output file.
        new ExtractTextPlugin(generateBuildFileName('css')),
        // Generate an index.html file containing references to the newly created
        //  js build file - build/govis.COMMIT_HASH.min.js
        // css build file - build/govis.COMMIT_HASH.min.css
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            inject: 'body', // inject js file reference into body element
        }),
    ],
};
