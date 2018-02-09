'use strict';

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./../../ng4/webpack-helpers');
var cmRoot = 'wwwroot/js/Services/ClientManager';

console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ DEV @@@@@@@@@@@@@@@@@@@@@@@@@@\n', helpers.root(cmRoot, 'tsconfig-webpack-jit.json'));

module.exports = webpackMerge(commonConfig, {
	entry: {
		'vendor-polyfills': helpers.root(cmRoot, 'vendor-polyfills.ts')
		, 'app': helpers.root(cmRoot, 'scm-main-jit.ts')
	}
	, plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor-polyfills']
		})
	]
});
