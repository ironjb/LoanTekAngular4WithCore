'use strict';

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./../../ng4/webpack-helpers');
var cmRoot = 'wwwroot/js/Services/ClientManager';

console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ DEV @@@@@@@@@@@@@@@@@@@@@@@@@@\n', helpers.root(cmRoot, 'tsconfig-webpack-jit.json'));

module.exports = webpackMerge(commonConfig, {
	entry: {
		'pr-vendor-polyfills': helpers.root(cmRoot, 'vendor-polyfills.ts')
		, 'print-receipt': helpers.root(cmRoot, 'scm-print-receipt-jit.ts')
	}
	, plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['print-receipt', 'pr-vendor-polyfills']
		})
	]
});
