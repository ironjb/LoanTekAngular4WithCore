// // import { rollup }		from 'rollup';
// import nodeResolve		from 'rollup-plugin-node-resolve';
// import commonjs			from 'rollup-plugin-commonjs';
// // import alias			from 'rollup-plugin-alias';
// // import paths			from 'rollup-plugin-paths';
// // import typescript		from 'rollup-plugin-typescript';
// import importAlias		from 'rollup-plugin-import-alias';
// import uglify			from 'rollup-plugin-uglify';
import common from './../../ng4/rollup.config.common';

export default Object.assign({
	input: 'wwwroot/js/Services/BranchManager/main-aot.js',
	output: {
		file: 'wwwroot/js/Services/BranchManager/build/build.js',		// output a single application bundle
		format: 'iife',
		name: 'BranchManagerModule'
	}/*,
	// entry: 'wwwroot/js/main-aot.js',
	// dest: 'wwwroot/js/build/build.js',
	// moduleName: 'cdnModule',
	// format: 'iife',
	//sourceMap: false,
	onwarn: function(warning) {
		// Skip certain warnings

		// should intercept ... but doesn't in some rollup versions
		if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

		// console.warn everything else
		console.warn( warning.message );
	},
	plugins: [
		nodeResolve({jsnext: true, module: true})
		, commonjs({
			include: 'node_modules/rxjs/**'
		})
		// , typescript({
		// 	typescript: require('typescript')
		// })
		// , alias({
		// 	// resolve: ['.js'],
		// 	'ltCommon/index': __dirname + '/aot-ng4-common/index.js',
		// 	'ltCommon/ltCommon.module': __dirname + '/aot-ng4-common/ltCommon.module.js'
		// })
		// , paths({
		// 	'ltCommon/index': __dirname + '/aot-ng4-common/index.js',
		// 	'ltCommon/ltCommon.module': __dirname + '/aot-ng4-common/ltCommon.module.js'
		// })
		, importAlias({
			Paths: {
				ltCommon: __dirname + '/tmp/aot-ng4-common'
			}
			, Extentions: ['js']
		})
		, uglify()
	]*/
}, common);
