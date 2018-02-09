import { Component, Input/*, OnInit*/ } from '@angular/core';

import { /*ClientService,*/ IClient, BillingHistoryType } from './../shared/index';

@Component({
	selector: 'scm-billing-history-tabs'
	, templateUrl: './billing-history-tabs.component.html'
})
export class BillingHistoryTabCompmonent/* implements OnInit*/ {
	@Input() client: IClient;
	ccType: BillingHistoryType = BillingHistoryType.CreditCardPayments;
	acType: BillingHistoryType = BillingHistoryType.AccountDebits;

	constructor(/*private clientService: ClientService*/) {}

	// ngOnInit() {
	// 	window.console && console.log('TODO: Should we move this to the client-info instead of here???');
	// 	this.clientService.getClient(this.clientBasic.ClientId).then(client => {
	// 		window.console && console.log('done getting data', client);
	// 		this.clientFull = client;
	// 	});
	// }
}
