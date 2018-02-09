namespace LoanTekCommon {
	export class helpers {
		public $: JQueryStatic;
		constructor($: JQueryStatic) {
			this.$ = $;
		}

		FormatValuesInObject(obj: Object, type?: string, modFunction?) {
			type = type || 'string';
			modFunction = modFunction || function (v) { return v; };

			if (obj instanceof Object) {
				for (var key in obj) {
					var val = obj[key];
					obj[key] = recursiveFunction(val, key);
				}
			}

			function recursiveFunction(val,key) {
				if (val instanceof Object) {
					for (var rKey in val) {
						var rVal = val[rKey];
						val[rKey] = recursiveFunction(rVal, rKey);
					}
				} else if (typeof val === type) {
					val = modFunction(val);
				}

				return val;
			}
		}

		CreateElement() {
			var $ = this.$;
			var el = {
				div: () => { return $('<div/>'); }
				, script: (src?: string, type: string = 'text/javascript') => {
					var returnScript = $('<script/>').prop('type', type);
					returnScript = src ? returnScript.prop('src', src) : returnScript;
					return returnScript;
				}
				, link: (href?: string, rel: string = 'stylesheet') => {
					var returnLink = $('<link/>').prop('rel', rel);
					returnLink = href ? returnLink.prop('href', href) : returnLink;
					return returnLink;
				}
				, style: (type: string = 'text/css') => {
					var returnStyle = $('<style/>').prop('type', type);
					return returnStyle;
				}
				, p: () => { return $('<p/>'); }
				, hr: () => { return $('<hr/>'); }
				, a: () => { return $('<a/>'); }
				, i: () => { return $('<i/>'); }
				, span: () => { return $('<span/>'); }
				, ol: () => { return $('<ol/>'); }
				, ul: () => { return $('<ul/>'); }
				, li: () => { return $('<li/>'); }
				, h: (headNumber: number = 3) => { return $('<h' + headNumber + '/>'); }
				, form: () => { return $('<form/>').addClass('form-horizontal'); }
				, label: (cssClass: string = 'control-label col-sm-12') => { return $('<label/>').addClass(cssClass); }
				, button: (type: string = 'button') => { return $('<button/>').prop('type', type); }
				, select: () => { return $('<select/>').addClass('form-control'); }
				, option: () => { return $('<option/>'); }
				, input: (type: string = 'text') => { return $('<input/>').prop('type', type); }
				, textarea: () => { return $('<textarea/>').addClass('form-control'); }
				, col: (colNumber: number = 12, colSize: string = 'sm') => { return el.div().addClass('col-' + colSize + '-' + colNumber.toString()); }
				, row: (rowType: string = 'row') => { return el.div().addClass(rowType); }
				, table: () => { return $('<table/>'); }
				, thead: () => { return $('<thead/>'); }
				, tbody: () => { return $('<tbody/>'); }
				, tr: () => { return $('<tr/>'); }
				, th: () => { return $('<th/>'); }
				, td: () => { return $('<td/>'); }
				, formGroup: (formGroupSize?: string, useRow?: boolean) => {
					var returnRow: JQuery;
					if (useRow) {
						returnRow = el.row();
					} else {
						returnRow = el.row('form-group');
					}
					if (formGroupSize) {
						returnRow.addClass('form-group-' + formGroupSize);
					}
					return returnRow;
				}
			};
			return el;
		}
	}

	export function GetPagePath(): string {
		return location.pathname.replace(/\/index$/i, '').replace(/\/home$/i, '');
	}
}
