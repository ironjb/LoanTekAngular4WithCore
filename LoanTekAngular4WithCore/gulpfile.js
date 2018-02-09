/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
// var ts = require('gulp-typescript');
var bower = require('gulp-bower');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cleancss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var del = require('del');

// #region Main

	gulp.task('bower', function () {
		return bower();
	});

	gulp.task('lodash', shell.task([
		'npm run lodash:custom'
	]));

	gulp.task('copy', ['bower','lodash'], function () {
		// Copy shims
		gulp.src([
			'bower_components/es5-shim/es5-shim.min.js',
			'bower_components/es6-shim/es6-shim.min.js'
		])
		.pipe(gulp.dest('wwwroot/js/lib/shim'));

		// // Copy Angular
		// gulp.src([
		// 	'bower_components/angular/angular.min.js',
		// 	'bower_components/angular-animate/angular-animate.min.js',
		// 	'bower_components/angular-sanitize/angular-sanitize.min.js',
		// 	'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		// 	'bower_components/angular-dragdrop/src/angular-dragdrop.min.js'
		// ])
		// .pipe(gulp.dest('wwwroot/js/lib/angular'));

		// // Copy angular-bootstrap-colorpicker .js file
		// gulp.src(['bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/angular-bootstrap-colorpicker'));

		// // Copy angular-bootstrap-colorpicker css file
		// gulp.src(['bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css'])
		// .pipe(gulp.dest('Content/lib/angular-bootstrap-colorpicker/css'));

		// // Copy angular-bootstrap-colorpicker img files
		// gulp.src(['bower_components/angular-bootstrap-colorpicker/img/*'])
		// .pipe(gulp.dest('Content/lib/angular-bootstrap-colorpicker/img'));

		// // Copy bootstrap .js
		// gulp.src(['bower_components/bootstrap/dist/js/bootstrap.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/bootstrap'));

		// Copy jQuery
		gulp.src([
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/jQuery-ui/jquery-ui.min.js',
			'bower_components/jquery-placeholder/jquery.placeholder.min.js'
		])
		.pipe(gulp.dest('wwwroot/js/lib/jquery'));

		// // Copy jQuery 1.X
		// gulp.src(['bower_components/jquery-1/dist/jquery.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/jquery-1'));

		// // Copy bootstrap fonts
		// gulp.src(['bower_components/bootstrap/dist/fonts/*'])
		// .pipe(gulp.dest('fonts'));

		// // Copy bootstrap LESS files
		// gulp.src(['bower_components/bootstrap/less/**'])
		// .pipe(gulp.dest('Content/less/bootstrap'));

		// // Copy PapaParse
		// gulp.src(['bower_components/papaparse/papaparse.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/papaparse'));

		// // Copy angular-ui-select
		// gulp.src(['bower_components/angular-ui-select/dist/select.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/angular'));
		// gulp.src(['bower_components/angular-ui-select/dist/select.min.css'])
		// .pipe(gulp.dest('Content/lib/angular'));

		// Copy simple-line-icons
		gulp.src(['bower_components/simple-line-icons/fonts/**'])
		.pipe(gulp.dest('wwwroot/fonts'));
		gulp.src(['bower_components/simple-line-icons/css/**'])
		.pipe(gulp.dest('wwwroot/css'));

		// // Copy DataTables
		// gulp.src(['bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css'])
		// .pipe(gulp.dest('Content/lib/datatables'));
		// gulp.src([
		// 	'bower_components/datatables.net/js/jquery.dataTables.min.js',
		// 	'bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js'
		// 	])
		// .pipe(gulp.dest('wwwroot/js/lib/datatables'));

		// // Copy noUiSlider-angular
		// gulp.src(['bower_components/nouislider/distribute/nouislider.min.css'])
		// .pipe(gulp.dest('Content/lib/nouislider'));
		// gulp.src(['bower_components/nouislider/distribute/nouislider.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/nouislider'));
		// gulp.src(['bower_components/nouislider-angular/nouislider.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/nouislider-angular'));

		// // Copy moment.js
		// gulp.src(['bower_components/moment/min/moment.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/moment'));

		// // Copy clipboard.js
		// gulp.src(['bower_components/clipboard/dist/clipboard.min.js'])
		// .pipe(gulp.dest('wwwroot/js/lib/clipboard'));

		// Popper
		gulp.src(['node_modules/popper.js/dist/umd/popper.min.js'])
		.pipe(gulp.dest('wwwroot/js/lib/popperjs/umd'));

		// Bootstrap 4 js
		gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
		.pipe(gulp.dest('wwwroot/js/lib/bootstrap4/js'));
	});

	gulp.task('ts:compile', shell.task(['tsc -p ./tsconfig.json']));

	var tsMainWatchList = [
		'**/js/**/*.ts'
		, '!/wwwroot/js/ng4/**/*.ts'
		, '!/wwwroot/js/Services/**/*.ts'
	];
	gulp.task('ts:watch', ['ts:compile'], TypescriptCompileWatch(tsMainWatchList, ['ts:compile']));

	var tsWatchNg4 = ['./wwwroot/js/ng4/**/*.ts'];
	gulp.task('ts:ng4:compile', shell.task(['tsc -p ./wwwroot/js/ng4/tsconfig.json']));
	gulp.task('ts:ng4:watch', ['ts:ng4:compile'], TypescriptCompileWatch(tsWatchNg4, ['ts:ng4:compile']));

	var sassDirs = ['./wwwroot/css/**/*.scss', './Areas/**/*.scss'];
	gulp.task('sass:compile', function() {
		// Create non-minified version
		gulp.src(sassDirs, { base: './' })
			.pipe(sass().on('error', sass.logError))
			.pipe(sourcemaps.init())
			.pipe(postcss([ autoprefixer() ]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./'));

		// Create minified version
		gulp.src(sassDirs, { base: './' })
			.pipe(sass().on('error', sass.logError))
			.pipe(sourcemaps.init())
			.pipe(postcss([ autoprefixer() ]))
			.pipe(cleancss())
			.pipe(rename({ suffix: '.min' }))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./'));
	});

	gulp.task('sass:watch', ['sass:compile'], function() {
		var sassWatcher = gulp.watch(sassDirs, ['sass:compile']);
		sassWatcher.on('change', WatcherNotify());
	});

	gulp.task('default', function () {
		// place code for your default task here
	});

// #endregion

// #region Services

	// gulp.task('srv:ts:compile', TypescriptCompile('./wwwroot/js/Services/tsconfig.json', './wwwroot/js/Services/'));
	var tsWatchServices = ['./wwwroot/js/Services/**/*.ts'].concat(tsWatchNg4);
	gulp.task('srv:ts:compile', shell.task(['tsc -p ./wwwroot/js/Services/tsconfig.json']));
	gulp.task('srv:ts:watch', [/*'ts:ng4:compile', */'srv:ts:compile'], TypescriptCompileWatch(tsWatchServices, ['ts:ng4:compile', 'srv:ts:compile']));

	// #region BranchManager

		gulp.task('bm:clean:aot', function () {
			return del(['./wwwroot/js/Services/BranchManager/tmp/**/*']);
		});

		// gulp.task('bm:clean:aot', shell.task([
		// 	'rimraf wwwroot/js/Services/BranchManager/aot'
		// ]));

		gulp.task('bm:tmp:copy', function () {
			gulp.src(['wwwroot/js/ng4/common/**'])
			.pipe(gulp.dest('wwwroot/js/Services/BranchManager/tmp/aot-ng4-common'));
		});

		gulp.task('bm:aot', shell.task([
			'gulp bm:tmp:copy',
			'gulp srv:ts:compile',
			'ngc -p wwwroot/js/Services/BranchManager/tsconfig-aot.json'
		]));

		gulp.task('bm:rollup', shell.task([
			'rollup -c wwwroot/js/Services/BranchManager/rollup-config.js'
		]));

		gulp.task('bm:aot-rollup', shell.task([
			'gulp bm:clean:aot',
			'gulp bm:aot',
			'gulp bm:rollup'
		]));

	// #endregion

	// #region ClientManager

		gulp.task('cm:clean:aot', function () {
			return del(['./wwwroot/js/Services/ClientManager/tmp/**/*']);
		});

		gulp.task('cm:tmp:copy', function () {
			gulp.src(['wwwroot/js/ng4/common/**'])
			.pipe(gulp.dest('wwwroot/js/Services/ClientManager/tmp/aot-ng4-common'));
		});

		gulp.task('cm:clean:app', function () {
			return del([
				'./wwwroot/js/Services/ClientManager/app/**/*.js'
				, './wwwroot/js/Services/ClientManager/app/**/*.js.map'
				, './wwwroot/js/Services/ClientManager/print-receipt/**/*.js'
				, './wwwroot/js/Services/ClientManager/print-receipt/**/*.js.map'
				, './wwwroot/js/ng4/common/**/*.js'
				, './wwwroot/js/ng4/common/**/*.js.map'
				, './wwwroot/js/Services/ClientManager/scm-main-aot.js*'
				, './wwwroot/js/Services/ClientManager/scm-main-jit.js*'
				, './wwwroot/js/Services/ClientManager/scm-print-receipt-aot.js*'
				, './wwwroot/js/Services/ClientManager/scm-print-receipt-jit.js*'
				, './wwwroot/js/Services/ClientManager/vendor-polyfills.js*'
			]);
		});

		gulp.task('cm:aot', ['cm:tmp:copy', 'srv:ts:compile'], shell.task([
			'ngc -p wwwroot/js/Services/ClientManager/tsconfig-aot.json'
		]));

		gulp.task('cm:rollup', shell.task([
			'rollup -c wwwroot/js/Services/ClientManager/rollup-config.js'
		]));

		gulp.task('cm:aot-rollup', shell.task([
			'gulp cm:clean:aot',
			'gulp cm:aot',
			'gulp cm:rollup',
			'gulp cm:clean:app',
			'gulp cm:clean:aot'
		]));

		gulp.task('cm:pr:aot', ['cm:tmp:copy', 'srv:ts:compile'], shell.task([
			'ngc -p wwwroot/js/Services/ClientManager/tsconfig-print-receipt-aot.json'
		]));

		gulp.task('cm:pr:rollup', shell.task([
			'rollup -c wwwroot/js/Services/ClientManager/rollup-print-receipt-config.js'
		]));

		gulp.task('cm:pr:aot-rollup', shell.task([
			'gulp cm:clean:aot',
			'gulp cm:pr:aot',
			'gulp cm:pr:rollup',
			'gulp cm:clean:app',
			'gulp cm:clean:aot'
		]));

	// #endregion

	// #region User

		gulp.task('um:clean:aot', function () {
			return del(['./wwwroot/js/Services/UserManager/tmp/**/*']);
		});

		gulp.task('um:tmp:copy', function () {
			gulp.src(['wwwroot/js/ng4/common/**'])
			.pipe(gulp.dest('wwwroot/js/Services/UserManager/tmp/aot-ng4-common'));
		});

		gulp.task('um:clean:app', function () {
			return del([
				'./wwwroot/js/Services/UserManager/app/**/*.js'
				, './wwwroot/js/Services/UserManager/app/**/*.js.map'
				, './wwwroot/js/ng4/common/**/*.js'
				, './wwwroot/js/ng4/common/**/*.js.map'
				, './wwwroot/js/Services/UserManager/sum-main-aot.js*'
				, './wwwroot/js/Services/UserManager/sum-main-jit.js*'
				, './wwwroot/js/Services/UserManager/vendor-polyfills.js*'
			]);
		});

		gulp.task('um:aot', ['um:tmp:copy', 'srv:ts:compile'], shell.task([
			'ngc -p wwwroot/js/Services/UserManager/tsconfig-aot.json'
		]));

		gulp.task('um:rollup', shell.task([
			'rollup -c wwwroot/js/Services/UserManager/rollup-config.js'
		]));

		gulp.task('um:aot-rollup', shell.task([
			'gulp um:clean:aot',
			'gulp um:aot',
			'gulp um:rollup',
			'gulp um:clean:app',
			'gulp um:clean:aot'
		]));

	// #endregion

// #endregion

// #region Common Functions

	function WatcherNotify() {
		return function (event) {
			var pathSub = event.path.replace(/^(.*)com.LoanTek.Clients/ig, '');
			console.log('File [' + pathSub + '] was ' + event.type + '!');
		};
	}

	function TypescriptCompileWatch(arrayOfFileToWatch, arrayOfTasksToExecute) {
		arrayOfFileToWatch = arrayOfFileToWatch || ['**/Scripts/**/*.ts'];
		arrayOfTasksToExecute = arrayOfTasksToExecute || [];
		return function () {
			var watcher = gulp.watch(arrayOfFileToWatch, arrayOfTasksToExecute);
			watcher.on('change', WatcherNotify());
		};
	}

// #endregion
