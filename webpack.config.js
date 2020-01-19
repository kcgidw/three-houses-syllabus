const path = require('path');
const _ = require('lodash');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
				{from: 'assets/church-on-sunday.svg', to: '../assets/church-on-sunday.svg'},
				{from: 'assets/images/portraits/', to: '../assets/images/portraits/'},
			]),
		],
		devServer: {
    		contentBase: path.resolve(__dirname, 'dist'),
			compress: true,
			index: 'index.html',
			publicPath: '/js/',
			hot: true,
			port: 3000,
		},
	};

	if (env.production) {
		_.merge(config, {
			mode: 'production',
			optimization: {
				minimize: true,
				minimizer: [new TerserPlugin({ sourceMap: false }),]
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