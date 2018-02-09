/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
	var appPath = '/Areas/Services/Scripts/BranchManager/app';
	// function isIE () {
	// 	var myNav = navigator.userAgent.toLowerCase(),
	// 	myAppVer = navigator.appVersion.toLowerCase();
	// 	return (myNav.indexOf('msie') !== -1 || myAppVer.indexOf('trident/') !== -1) ? true : false;
	// }

	// if (isIE()) {
	// 	// alert('is IE');
	// 	// appPath = '/app';
	// 	var baseTag = document.getElementsByTagName('base')[0];
	// 	baseTag.href = baseTag.href;
	// }

	System.config({
		paths: {
			// paths serve as alias
			'ltCommon': '../../../../Scripts/ng4/common',
			// 'ltCommon2': '/Areas/Services/Scripts/BranchManager/aot-external',
			'npm:': '/node_modules/'
			// , 'ng4': '../../../../Scripts/ng4/common'
		},
		// map tells the System loader where to look for things
		map: {
			// our app is within the app folder
			'app': appPath,//'/Areas/Services/Scripts/BranchManager/app',
			// 'ng4': '../../../../Scripts/ng4/common',
			'ltCommon': '../../../../Scripts/ng4/common',
			// 'ltCommon2': '/Areas/Services/Scripts/BranchManager/aot-external',

			// angular bundles
			'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
			'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
			'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
			'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
			'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
			'@angular/http': 'npm:@angular/http/bundles/http.umd.js',
			'@angular/router': 'npm:@angular/router/bundles/router.umd.js',
			'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

			// other libraries
			'fuzzy': 'npm:fuzzy/lib/fuzzy.js',
			'rxjs': 'npm:rxjs'
		},
		// packages tells the System loader how to load when no filename and/or no extension
		packages: {
			app: {
				//main: '../main-jit.js',
				defaultExtension: 'js',
				meta: {
					'./*.js': {
						loader: '/Scripts/ng4/systemjs-angular-loader.js'
					}
				}
			},
			// ng4: {
			// 	// defaultExtension: 'js'
			// },
			ltCommon: {
				defaultExtension: 'js',
				meta: {
					'./*.js': {
						loader: '/Scripts/ng4/systemjs-angular-loader.js'
					}
				}
			},
			// ltCommon2: {
			// 	defaultExtension: 'js',
			// 	meta: {
			// 		'./*.js': {
			// 			loader: '/Scripts/ng4/systemjs-angular-loader.js'
			// 		}
			// 	}
			// },
			rxjs: {
				defaultExtension: 'js'
			}
		}
	});
})(this);
