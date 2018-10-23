var path = require('path');
var config = require('./config');
var webpack = require('webpack');

module.exports = {
    devtool: config.DEBUG ? undefined : 'inline-source-map',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            // MEDIA
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=8192',
                    'img'
                ]
            },
            {
              test: /\.css$/,
              loader: "style-loader!css-loader"
            },
            {
              test: /\.(woff|woff2)$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
              test: /\.ttf$/,
              loader: "file-loader"
            },
            {
              test: /\.eot$/,
              loader: "file-loader"
            },
            {
              test: /\.json$/,
              loader: "json-loader"
            }
        ]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   'process.env.NODE_ENV': '"production"',
      //   'NODE_ENV': '"production"'
      // }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    ],
};
