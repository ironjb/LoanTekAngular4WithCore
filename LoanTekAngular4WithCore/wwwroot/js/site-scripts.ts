declare namespace ISiteScripts {
	interface WebHelpResult {
		Success: boolean;
		Message: string;
		DataObjects: WebHelpDataObject[];
	}

	interface WebHelpDataObject {
		Active: boolean;
		DisplayData: string;
		DisplayType: string;
		ElementId: string;
	}
}

namespace LtSiteScripts{
	// // Website Help helpers
	// var websiteHelpResults: ISiteScripts.WebHelpDataObject[] = null;
	// var isAdminAccount: boolean = false;
	// export function GetWebHelpResults(): ISiteScripts.WebHelpDataObject[] {
	// 	return websiteHelpResults;
	// }
	// export function SetWebHelpResults(webHelpResults: ISiteScripts.WebHelpDataObject[]) {
	// 	websiteHelpResults = webHelpResults;
	// }
	// export function GetIsAdminAccount(): boolean {
	// 	return isAdminAccount;
	// }
	// export function SetIsAdminAccount(isAdmin: boolean) {
	// 	isAdminAccount = isAdmin;
	// }

	// Adds fixed functionality for nav after scroll
	$(window).scroll(_.throttle(function () {
		// window.console && console.log('scroll');
		var offset = 95;
		if ($('body').hasClass('page-head-menu-fixed')) {
			if ($(window).scrollTop() > offset) {
				$(".page-head-menu").addClass("menu-fixed");
			} else {
				$(".page-head-menu").removeClass("menu-fixed");
			}
		}
	}, 100));

	// Dropdown Sub-navigation
	$(document).click(function (event) {
		clearSubOpen();
	});
	$('.dropdown-sub > a').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var isSubOpen = $(this).parent().hasClass('sub-open');
		clearSubOpen();
		if (!isSubOpen) {
			$(this).parents('.dropdown-sub').addClass('sub-open');
		}
	});
	$('.dropdown-text').click((event) => {
		event.stopPropagation();
	});
	function clearSubOpen() {
		$('.sub-open').removeClass('sub-open');
	}

	// Custom Nav Dropdowns
	$('.nav-dropdown > a').click(function(event) {
		event.preventDefault();
		var navDropdown = $(this).parent();//$(this).next('ul.nav-dropdown-menu');
		if (navDropdown.hasClass('menu-open')) {
			navDropdown.removeClass('menu-open');
			navDropdown.find('.nav-dropdown-sub').removeClass('menu-open');
		} else {
			navDropdown.addClass('menu-open');
		}
	});
	$('.nav-dropdown-subhead').click(function(event) {
		event.preventDefault();
		var subNavDropdown = $(this).parent();
		if (subNavDropdown.hasClass('menu-open')) {
			subNavDropdown.removeClass('menu-open');
			subNavDropdown.find('.nav-dropdown-sub').removeClass('menu-open');
		} else {
			subNavDropdown.addClass('menu-open');
		}
	});
	function removeMenuOpenClass() {
		$('.nav-dropdown').removeClass('menu-open');
		$('.nav-dropdown-sub').removeClass('menu-open');
	}
	$('.navbar-toggle').click(removeMenuOpenClass);
	$('.navbar-toggler').click(removeMenuOpenClass);
	$(window).resize(_.debounce(removeMenuOpenClass, 100));

	// Web Help
	export function WebHelpPath(path: string): string {
		// Will remove part of path that is not needed
		var partOfPathToUse = ['/widgets/builder'];
		for (var i = 0; i < partOfPathToUse.length; i++) {
			var partOfPath = partOfPathToUse[i];
			if (path.toLowerCase().indexOf(partOfPath) === 0) {
				path = path.substring(0,partOfPath.length);
			}
		}

		return path;
	}

	// export function AddWebsiteHelp(helpElement: JQuery, helpObject: ISiteScripts.WebHelpDataObject) {
	// 	var ltch = new LoanTekCommon.helpers($);
	// 	var el = ltch.CreateElement();

	// 	if (helpObject.Active && helpElement.length) {
	// 		// Create Question Mark
	// 		var helpQ = el.span().addClass('fa fa-question-circle-o ml-1 cursor-pointer text-info site-help-question');

	// 		// Add Popover/Tooltip
	// 		if (helpObject.DisplayType.toLowerCase() === 'tooltip') {
	// 			var popOverWrap = el.div().addClass('site-help-popover');
	// 			helpQ.popover({ content: popOverWrap.append(helpObject.DisplayData), trigger: 'hover', html: true });
	// 		}

	// 		// Add Modal/Popup
	// 		if (helpObject.DisplayType.toLowerCase() === 'popup') {
	// 			var helpModal = el.div().addClass('modal fade').attr('id', 'modal_' + helpObject.ElementId)
	// 			.append(el.div().addClass('modal-dialog')
	// 				.append(el.div().addClass('modal-content')
	// 					.append(el.div().addClass('modal-header bg-info')
	// 						.append(el.button().addClass('close').attr('data-dismiss', 'modal')
	// 							.append(el.span().html('&times;'))))
	// 					.append(el.div().addClass('modal-body').html(helpObject.DisplayData))
	// 					.append(el.div().addClass('modal-footer')
	// 						.append(el.button().addClass('btn btn-sm btn-default').attr('data-dismiss', 'modal').text('Close')))));
	// 			helpModal.appendTo('body');

	// 			// Initialize Modal
	// 			$(helpModal).modal({ show: false });

	// 			// Open Modal on click
	// 			helpQ.click(function (event) {
	// 				event.preventDefault();
	// 				$(helpModal).modal('show');
	// 			});
	// 		}

	// 		// Add Help Icon to Element
	// 		var nn = helpElement[0].nodeName.toLowerCase();
	// 		if (helpObject.ElementId === 'LTClientSiteBreadcrumb') {
	// 			helpQ.addClass('pull-right site-help-breadcrumb');
	// 			helpElement.before(helpQ);
	// 		} else if (nn === 'select' || nn === 'input') {
	// 			helpElement.after(helpQ);
	// 		} else {
	// 			helpElement.append(helpQ);
	// 		}
	// 	}
	// }

	// function WebsiteHelp() {
	// 	var ltch = new LoanTekCommon.helpers($);
	// 	var pathLoc = LoanTekCommon.GetPagePath();
	// 	var el = ltch.CreateElement();
	// 	pathLoc = WebHelpPath(pathLoc);
	// 	$.get('/WebHelp/GetPageHelp?page=' + pathLoc, function (result: ISiteScripts.WebHelpResult) {
	// 		if (result) {
	// 			if (result.Success && result.DataObjects && Array.isArray(result.DataObjects)) {
	// 				SetWebHelpResults(result.DataObjects);
	// 				$.each(result.DataObjects, function (index: number, helpObj: ISiteScripts.WebHelpDataObject) {
	// 					var helpElem = $('#' + helpObj.ElementId);
	// 					AddWebsiteHelp(helpElem, helpObj);
	// 				});
	// 			}
	// 		}
	// 	})
	// }
	// WebsiteHelp();
}
