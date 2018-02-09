var LoanTekCommon;
(function (LoanTekCommon) {
    var helpers = (function () {
        function helpers($) {
            this.$ = $;
        }
        helpers.prototype.FormatValuesInObject = function (obj, type, modFunction) {
            type = type || 'string';
            modFunction = modFunction || function (v) { return v; };
            if (obj instanceof Object) {
                for (var key in obj) {
                    var val = obj[key];
                    obj[key] = recursiveFunction(val, key);
                }
            }
            function recursiveFunction(val, key) {
                if (val instanceof Object) {
                    for (var rKey in val) {
                        var rVal = val[rKey];
                        val[rKey] = recursiveFunction(rVal, rKey);
                    }
                }
                else if (typeof val === type) {
                    val = modFunction(val);
                }
                return val;
            }
        };
        helpers.prototype.CreateElement = function () {
            var $ = this.$;
            var el = {
                div: function () { return $('<div/>'); },
                script: function (src, type) {
                    if (type === void 0) { type = 'text/javascript'; }
                    var returnScript = $('<script/>').prop('type', type);
                    returnScript = src ? returnScript.prop('src', src) : returnScript;
                    return returnScript;
                },
                link: function (href, rel) {
                    if (rel === void 0) { rel = 'stylesheet'; }
                    var returnLink = $('<link/>').prop('rel', rel);
                    returnLink = href ? returnLink.prop('href', href) : returnLink;
                    return returnLink;
                },
                style: function (type) {
                    if (type === void 0) { type = 'text/css'; }
                    var returnStyle = $('<style/>').prop('type', type);
                    return returnStyle;
                },
                p: function () { return $('<p/>'); },
                hr: function () { return $('<hr/>'); },
                a: function () { return $('<a/>'); },
                i: function () { return $('<i/>'); },
                span: function () { return $('<span/>'); },
                ol: function () { return $('<ol/>'); },
                ul: function () { return $('<ul/>'); },
                li: function () { return $('<li/>'); },
                h: function (headNumber) {
                    if (headNumber === void 0) { headNumber = 3; }
                    return $('<h' + headNumber + '/>');
                },
                form: function () { return $('<form/>').addClass('form-horizontal'); },
                label: function (cssClass) {
                    if (cssClass === void 0) { cssClass = 'control-label col-sm-12'; }
                    return $('<label/>').addClass(cssClass);
                },
                button: function (type) {
                    if (type === void 0) { type = 'button'; }
                    return $('<button/>').prop('type', type);
                },
                select: function () { return $('<select/>').addClass('form-control'); },
                option: function () { return $('<option/>'); },
                input: function (type) {
                    if (type === void 0) { type = 'text'; }
                    return $('<input/>').prop('type', type);
                },
                textarea: function () { return $('<textarea/>').addClass('form-control'); },
                col: function (colNumber, colSize) {
                    if (colNumber === void 0) { colNumber = 12; }
                    if (colSize === void 0) { colSize = 'sm'; }
                    return el.div().addClass('col-' + colSize + '-' + colNumber.toString());
                },
                row: function (rowType) {
                    if (rowType === void 0) { rowType = 'row'; }
                    return el.div().addClass(rowType);
                },
                table: function () { return $('<table/>'); },
                thead: function () { return $('<thead/>'); },
                tbody: function () { return $('<tbody/>'); },
                tr: function () { return $('<tr/>'); },
                th: function () { return $('<th/>'); },
                td: function () { return $('<td/>'); },
                formGroup: function (formGroupSize, useRow) {
                    var returnRow;
                    if (useRow) {
                        returnRow = el.row();
                    }
                    else {
                        returnRow = el.row('form-group');
                    }
                    if (formGroupSize) {
                        returnRow.addClass('form-group-' + formGroupSize);
                    }
                    return returnRow;
                }
            };
            return el;
        };
        return helpers;
    }());
    LoanTekCommon.helpers = helpers;
    function GetPagePath() {
        return location.pathname.replace(/\/index$/i, '').replace(/\/home$/i, '');
    }
    LoanTekCommon.GetPagePath = GetPagePath;
})(LoanTekCommon || (LoanTekCommon = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxhQUFhLENBOEZ0QjtBQTlGRCxXQUFVLGFBQWE7SUFDdEI7UUFFQyxpQkFBWSxDQUFlO1lBQzFCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUVELHNDQUFvQixHQUFwQixVQUFxQixHQUFXLEVBQUUsSUFBYSxFQUFFLFdBQVk7WUFDNUQsSUFBSSxHQUFHLElBQUksSUFBSSxRQUFRLENBQUM7WUFDeEIsV0FBVyxHQUFHLFdBQVcsSUFBSSxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhELEVBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7WUFDRixDQUFDO1lBRUQsMkJBQTJCLEdBQUcsRUFBQyxHQUFHO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDdEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMzQyxDQUFDO2dCQUNGLENBQUM7Z0JBQUMsSUFBSSxDQUFD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