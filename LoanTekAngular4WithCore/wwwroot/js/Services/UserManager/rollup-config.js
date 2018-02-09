import common from './../../ng4/rollup.config.common';

export default Object.assign({
	input: 'wwwroot/js/Services/UserManager/sum-main-aot.js',
	output: {
		file: 'wwwroot/js/Services/UserManager/build/sum-build.js',		// output a single application bundle
		format: 'iife',
		name: 'UserManagerModule'
	}
}, common);
