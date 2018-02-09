import common from './../../ng4/rollup.config.common';

export default Object.assign({
	input: 'wwwroot/js/Services/ClientManager/scm-main-aot.js',
	output: {
		file: 'wwwroot/js/Services/ClientManager/build/scm-build.js',		// output a single application bundle
		format: 'iife',
		name: 'ClientManagerModule'
	}
}, common);
