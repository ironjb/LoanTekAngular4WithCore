import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IPagingChangeInfo, LODASH_TOKEN, TOASTR_TOKEN } from 'ltCommon/index';
import { ClientService, IClient, IBillHistoryInfo, IBillingHistorySort, IBillingHistoryFilter, IBillingHistory
	, BillingHistoryType, IInvoicingModel, IInvoicingPrintModel } from './../shared/index';

@Component({
	selector: 'scm-billing-history-list'
	, templateUrl: './billing-history-list.component.html'
	, styles: [`
		.min-width-200 { min-width: 200px; }
	`]
})
export class BillingHistoryListCompmonent implements OnInit {
	@Input() client: IClient;
	@Input() billingHistoryType: BillingHistoryType;
	billHistoryInfo: IBillHistoryInfo;
	billHistFG: FormGroup
	initCurrentPage: number = 1;
	initPageSize: number = 10;
	sortBy: IBillingHistorySort = null;
	reverseSort: boolean = false;
	isGettingList: boolean = false;
	isEmailReceiptBtnDisabled: Object = {};
	isPrintReceiptBtnDisabled: Object = {};

	constructor(private formBuilder: FormBuilder, private clientService: ClientService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr) {}

	// #region Init

		ngOnInit() {
			this.billHistFG = this.formBuilder.group(this.initFilterFG());
			if (this.client) {
				this.filterHistoryList(this.billingHistoryType, this.client.ClientId, this.initCurrentPage, this.initPageSize, this.sortBy, this.reverseSort, null, true);
			}
		}

	// #endregion

	// #region Filter

		filterResults() {
			this.isGettingList = true;
			let pgSize = this.billHistoryInfo.pageSize || this.initPageSize;
			// window.console && console.log('filtering billHist', this.billHistFG.value);
			this.filterHistoryList(this.billingHistoryType, this.client.ClientId, this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, this.billHistFG.value, false, () => {
				this.isGettingList = false;
			});
		}

		filterResultsDebounce = this._.debounce(() => {
			this.filterResults();
		}, 400);

		clearFilter() {
			this.isGettingList = true;
			this.billHistFG.reset(this.initFilterFG());
			let pgSize = this.billHistoryInfo.pageSize || this.initPageSize;
			this.filterHistoryList(this.billingHistoryType, this.client.ClientId, this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, null, false, () => {
				this.isGettingList = false;
			});
		}

		pageChange(e: IPagingChangeInfo) {
			this.isGettingList = true;
			this.filterHistoryList(this.billingHistoryType, this.client.ClientId, e.page, e.pageSize, this.sortBy, this.reverseSort, this.billHistFG.value, false, () => {
				this.isGettingList = false;
			});
		}

		changeSort(sortBy: IBillingHistorySort) {
			this.isGettingList = true;
			if (sortBy === this.sortBy) {
				if (this.reverseSort) {
					this.sortBy = null;
					this.reverseSort = false;
				} else {
					this.reverseSort = !this.reverseSort;
				}
			} else {
				this.sortBy = sortBy;
				this.reverseSort = false;
			}

			this.filterHistoryList(this.billingHistoryType, this.client.ClientId, this.initCurrentPage, this.billHistoryInfo.pageSize, this.sortBy, this.reverseSort, this.billHistFG.value, false, () => {
				this.isGettingList = false;
			});
		}

	// #endregion

	// #region Print/Email buttons

		emailReceipt(billHistoryItem: IBillingHistory) {
			this.isEmailReceiptBtnDisabled[billHistoryItem.InvoiceId] = true;
			// window.console && console.log(this.isEmailReceiptBtnDisabled);

			let invoiceModel: IInvoicingModel = {
				ClientId: this.client.ClientId
				, InvoiceId: billHistoryItem.InvoiceId
				, BillingVersion: billHistoryItem.BillingSystemVersion
			};

			this.clientService.emailInvoice(invoiceModel).then(hasSentEmail => {
				delete this.isEmailReceiptBtnDisabled[billHistoryItem.InvoiceId];
				this.toastr.success('Email sent');
			}).catch((error: Response) => {
				delete this.isEmailReceiptBtnDisabled[billHistoryItem.InvoiceId];
				this.toastr.error('Could not email receipt', 'Error');
				return Observable.throw(error.statusText);
			});
			// setTimeout(() => {
			// 	this.toastr.success('Payment Receipt sent successfully<br />Please make sure to add <strong><em><a href="mailto:support@loantek.com">support@loantek.com</a></em></strong> to your safe sender list.', null, { positionClass: 'toast-top-right toast-md', timeOut: 8000, closeButton: true });
			// 	// this.isEmailReceiptBtnDisabled[billHistoryItem.InvoiceId] = false;
			// 	delete this.isEmailReceiptBtnDisabled[billHistoryItem.InvoiceId];
			// }, 1000);
		}

		printReceipt(billHistoryItem: IBillingHistory) {
			// this.isPrintReceiptBtnDisabled[billHistoryItem.InvoiceId] = true;
			// sessionStorage.removeItem('clientManagerBillingHistoryPrintReceipt');
			// window.console && console.log('this.isPrintReceiptBtnDisabled', this.isPrintReceiptBtnDisabled);
			// let printWindow = window.open('/Services/ClientManager/PrintReceipt', '_blank', 'location=0,menubar=0,height=400,width=600,status=0,titlebar=0,toolbar=0,top=20,left=20,scrollbars=1',false);
			// printWindow.document.write(`
			// 	<!DOCTYPE html>
			// 	<html>
			// 		<head>
			// 			<link rel="stylesheet" href="//cdn.loantek.com/css/bundle/bootstrap-site.min.css" />
			// 		</head>
			// 		<body>
			// 			<div class="text-center my-5"><i class="fa fa-circle-o-notch fa-5x fa-spin fa-fw"></i></div>
			// 		</body>
			// 	</html>
			// `);

			// let invoiceModel: IInvoicingModel = {
			// 	ClientId: this.client.ClientId
			// 	, InvoiceId: billHistoryItem.InvoiceId
			// 	, BillingVersion: billHistoryItem.BillingSystemVersion
			// };
			// window.console && console.log('getInvoiceForPrinting invoiceModel', invoiceModel);

			// this.clientService.getInvoiceForPrinting(invoiceModel).then((invoice: IInvoicingPrintModel) => {
			// 	delete this.isPrintReceiptBtnDisabled[billHistoryItem.InvoiceId];
			// 	// sessionStorage.setItem('clientManagerBillingHistoryPrintReceipt', JSON.stringify(invoice));
			// 	window.open('/Services/ClientManager/PrintReceipt', '_blank', 'location=0,menubar=0,height=400,width=600,status=0,titlebar=0,toolbar=0,top=20,left=20,scrollbars=1',false);
			// 	// printWindow.location.replace('/Services/ClientManager/PrintReceipt');
			// }).catch((error: Response) => {
			// 	delete this.isPrintReceiptBtnDisabled[billHistoryItem.InvoiceId];
			// 	this.toastr.error('Could not retrieve data for printing receipt', 'Error');
			// 	return Observable.throw(error.statusText);
			// });

			let prUrl = `/Services/ClientManager/PrintReceipt?clientId=${this.client.ClientId}&invoiceId=${billHistoryItem.InvoiceId}&billingVersion=${billHistoryItem.BillingSystemVersion}`;
			window.open(prUrl, '_blank', 'location=0,menubar=0,height=400,width=600,status=0,titlebar=0,toolbar=0,top=20,left=20,scrollbars=1',false);
		}

	// #endregion

	// #region Shared

		private filterHistoryList(billingHistoryType: BillingHistoryType, clientId: number, currentPage: number, pageSize: number, sortBy?: IBillingHistorySort, reverse?: boolean, filter?: IBillingHistoryFilter, resetInfo?: boolean, callback?: Function) {
			// window.console && console.log('filter List');
			this.clientService.getFilteredBillingHistory(billingHistoryType, clientId, currentPage, pageSize, sortBy, reverse, filter, resetInfo).then(billHistInfo => {
				this.billHistoryInfo = billHistInfo;
				if (callback && typeof callback === 'function') { callback(); }
			}).catch(this.handleError);
		}

		private initFilterFG() {
			let filterFormGroup: IBillingHistoryFilter = {
				paymentCommentsFilter: ''
				, paymentTypeFilter: ''
				, paymentStatusFilter: ''
			};

			return filterFormGroup;
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
