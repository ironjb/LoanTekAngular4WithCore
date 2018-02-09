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

	constructor() {}
}
