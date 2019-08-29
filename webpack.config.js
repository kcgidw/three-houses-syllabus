const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const _ = require('lodash');

module.exports = (env) => {
	const config = {
		entry: [
			// '@babel/polyfill', corejs polyfill
			path.resolve(__dirname, 'source', 'index.jsx')
		],
		output: {
			path: path.resolve(__dirname, 'public', 'js'),
			filename: 'index.bundle.min.js'
		},
		module: {
			rules: [
				{
					test: [/\.js$/, /\.jsx$/],
					exclude: /node_modules/,
					use: [
						{
							loader: 'source-map-loader'
						},
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/preset-env',
									]
								],
							}
						},
					]
				},
				{
					test: /\.css$/,
					use: [
						'css-loader',
					]
				},
			],
		},
		resolve: {
			extensions: [".js", ".jsx"],
		},
		plugins: [
			// new CompressionPlugin(), // gzip
		],
	};

	if (env.production) {
		_.merge(config, {
			mode: 'production',
			stats: 'minimal',
			optimization: {
				minimize: true,
				minimizer: [new UglifyJsPlugin({ sourceMap: true }),]
			},
			externals: { // resolve to external cdns
				'react': 'React',
				'react-dom': 'ReactDOM',
			}
		});
	} else if (env.development) {
		_.merge(config, {
			mode: 'development',
			devtool: 'source-map',
			resolve: {
				alias: { // import local development versions for devtools
					// 'react-dom': 'react-dom/umd/react-dom.development.js'
				}
			},
			externals: { // resolve to external cdns
				'react': 'React',
				'react-dom': 'ReactDOM',
			}
		});
	} else {
		throw new Error('Bad webpack env');
	}

	return config;
};