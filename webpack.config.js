const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const _ = require('lodash');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
	const config = {
		entry: {
			'index': path.resolve(__dirname, 'src', 'js', 'index.js'),
		},
		output: {
			path: path.resolve(__dirname, 'dist', 'js'),
			filename: '[name].bundle.min.js'
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
					test: /\.(sa|sc|c)ss$/,
					use: [
						CssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				},
				{
					test: /\.(png|jpg|gif)$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
							},
						},
					],
				},
			],
		},
		resolve: {
			extensions: [".js", ".jsx"],
			alias: {
				'assets': path.resolve(__dirname, 'assets'),
			}
		},
		plugins: [
			new CssExtractPlugin({
				filename: '../style.css',
				ignoreOrder: false
			}),
			new CopyWebpackPlugin([
				{from: 'src/data.json', to: '../data.json'},
				{from: 'src/index.html', to: '../index.html'},
			])
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
		});
	} else if (env.development) {
		_.merge(config, {
			mode: 'development',
			devtool: 'source-map',
		});
	} else {
		throw new Error('Bad webpack env');
	}

	return config;
};