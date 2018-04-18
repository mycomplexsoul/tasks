const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        polyfills: './src/polyfills.js',
        lib: './src/lib.js',
        app: './src/main.js'
    },
    optimization: {
        splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "initial",
					minChunks: 2
				},
				vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "vendor",
					priority: 10,
					enforce: true
				}
			}
		}
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                use: 'style-loader!css-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
  };