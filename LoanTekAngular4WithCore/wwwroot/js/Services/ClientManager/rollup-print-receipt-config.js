import nodeResolve		from 'rollup-plugin-node-resolve';
import commonjs			from 'rollup-plugin-commonjs';
import importAlias		from 'rollup-plugin-import-alias';
import uglify			from 'rollup-plugin-uglify';

export default {
	input: 'wwwroot/js/Services/ClientManager/scm-print-receipt-aot.js',
	output: {
		file: 'wwwroot/js/Services/ClientManager/build/scm-print-receipt-build.js',		// output a single application bundle
		format: 'iife',
		name: 'ClientManagerPrintReceiptModule'
	},
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
			include: ['node_modules/rxjs/**', 'node_modules/fuzzy/**']
			, namedExports: { 'node_modules/fuzzy/lib/fuzzy.js': ['filter', 'match', 'test'] }
		})
		, importAlias({
			Paths: {
				ltCommon: __dirname + '/tmp/aot-ng4-common'
			}
			, Extentions: ['js']
		})
		, uglify()
	]
};
