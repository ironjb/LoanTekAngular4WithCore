import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { IInvoicingModel, IInvoicingPrintModel } from '../app/shared/client.model';

declare var cmprInfo: IInvoicingModel;

@Component({
	selector: 'scm-print-receipt'
	, templateUrl: './print-receipt.component.html'
	, styles: [`
		.pr-lbl-min { min-width: 180px; }
	`]
})
export class PrintReceiptComponent implements OnInit {
	printReceiptData: IInvoicingPrintModel;

	constructor(private http: Http) {}

	ngOnInit() {
		this.printReceiptData = null;
		// TODO: Get data from SessionStorage???
		// window.console && console.log('sessionStorage', sessionStorage.getItem('clientManagerBillingHistoryPrintReceipt'));
		// let ssPrintReceipt: string = sessionStorage.getItem('clientManagerBillingHistoryPrintReceipt');

		// if (ssPrintReceipt) {
		// 	this.printReceiptData = JSON.parse(ssPrintReceipt);
		// 	this.printReceipt();
		// } else {
		// 	this.printReceiptData = { PaymentResponse: 'Error: No Results' };
		// }

		// window.console && console.log('cmprInfo', cmprInfo);
		// let gvPrintReceipt: IInvoicingPrintModel = cmprInfo;

		// if (gvPrintReceipt) {
		// 	this.printReceiptData = gvPrintReceipt;
		// 	this.printReceipt();
		// } else {
		// 	this.printReceiptData = { PaymentResponse: 'Error: No Results' };
		// }

		if (cmprInfo && cmprInfo.ClientId && cmprInfo.InvoiceId && cmprInfo.BillingVersion) {
			this.getInvoiceForPrinting(cmprInfo).then((pModel) => {
				// window.console && console.log('pModel', pModel);
				this.printReceiptData = pModel;
				setTimeout(() => {
					this.printReceipt();
				}, 100);
			}).catch((error: Response) => {
				this.printReceiptData = { PaymentResponse: 'Error' };
				return Observable.throw(error.statusText);
			});
		} else {
			this.printReceiptData = { PaymentResponse: 'Error' };
		}
	}

	printReceipt() {
		window.print();
	}

	getInvoiceForPrinting(invoiceModel: IInvoicingModel): Promise<IInvoicingPrintModel> {
		let postUrl = '/Services/ClientManager/GetInvoiceForPrinting';
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(postUrl, invoiceModel, options).toPromise().then((response: Response) => {
			return response.json() as IInvoicingPrintModel;
		});
	}

	// ngOnDestroy() {
	// 	window.console && console.log('destroyed');
	// 	sessionStorage.removeItem('clientManagerBillingHistoryPrintReceipt');
	// 	alert('destroyed');
	// }
}
