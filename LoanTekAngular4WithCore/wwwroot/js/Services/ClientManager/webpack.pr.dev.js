'use strict';

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
// var { TsConfigPathsPlugin } = require('awesome-typescript-loader');
var helpers = require('./../../ng4/webpack-helpers');
var cmRoot = 'wwwroot/js/Services/ClientManager';

console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ DEV @@@@@@@@@@@@@@@@@@@@@@@@@@\n', helpers.root(cmRoot, 'tsconfig-webpack-jit.json'));

module.exports = webpackMerge(commonConfig, {
	entry: {
		'pr-vendor-polyfills': helpers.root(cmRoot, 'vendor-polyfills.ts')
		, 'print-receipt': helpers.root(cmRoot, 'scm-print-receipt-jit.ts')
	}

	// , output: {
	// 	path: helpers.root(cmRoot, 'tmp/webpack')
	// 	, filename: '[name].js'
	// 	, publicPath: '/'
	// }

	// , resolve: {
	// 	extensions: ['.ts', '.js']
	// 	// , alias: {
	// 	// 	'ltCommon': helpers.root('Scripts', 'ng4', 'common')
	// 	// }
	// 	, plugins: [
	// 		new TsConfigPathsPlugin({ configFileName: helpers.root(cmRoot, 'tsconfig-webpack-jit.json') })
	// 	]
	// }

	// , devtool: 'source-map'

	// , module: {
	// 	rules: [
	// 		{
	// 			test: /\.ts$/,
	// 			loaders: [
	// 				{
	// 					loader: 'awesome-typescript-loader',
	// 					options: { configFileName: helpers.root(cmRoot, 'tsconfig-webpack-jit.json') }
	// 				}
	// 				// 'awesome-typescript-loader'
	// 				, 'angular2-template-loader'
	// 				, 'source-map-loader'
	// 			]
	// 		}, {
	// 			test: /\.html$/
	// 			, loader: 'html-loader'
	// 		}
	// 	]
	// }

	, plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['print-receipt', 'pr-vendor-polyfills']
		})

		// , new TsConfigPathsPlugin({ configFileName: helpers.root('Areas', 'Services', 'Scripts', 'ClientManager', 'tsconfig-webpack-jit.json') })
	]
});
