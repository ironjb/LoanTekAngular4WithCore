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