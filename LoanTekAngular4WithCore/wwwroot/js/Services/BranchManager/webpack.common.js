'use strict';

var webpack = require('webpack');
var { TsConfigPathsPlugin } = require('awesome-typescript-loader');
var helpers = require('./../../ng4/webpack-helpers');
var cmRoot = 'wwwroot/js/Services/BranchManager';

module.exports = {
	output: {
		path: helpers.root(cmRoot, 'tmp/webpack')
		, filename: '[name].js'
		, publicPath: '/'
	}

	, resolve: {
		extensions: ['.ts', '.js']
		, plugins: [
			new TsConfigPathsPlugin({ configFileName: helpers.root(cmRoot, 'tsconfig-webpack-jit.json') })
		]
	}

	, devtool: 'source-map'

	, module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: [
					{
						loader: 'awesome-typescript-loader',
						options: { configFileName: helpers.root(cmRoot, 'tsconfig-webpack-jit.json') }
					}
					, 'angular2-template-loader'
					, 'source-map-loader'
				]
			}, {
				test: /\.html$/
				, loader: 'html-loader'
			}
		]
	}
};
