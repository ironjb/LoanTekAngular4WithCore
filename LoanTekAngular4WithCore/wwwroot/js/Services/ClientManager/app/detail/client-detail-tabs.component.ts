import { Component, EventEmitter, Input, Output/*, OnInit*/ } from '@angular/core';

import { ILoggedInUserInfo } from 'ltCommon/index';
import { /*ClientService,*/ IClient/*, ILoggedInUserInfo*/ } from './../shared/index';

@Component({
	selector: 'scm-detail-tabs'
	, templateUrl: './client-detail-tabs.component.html'
})
export class ClientDetailTabCompmonent/* implements OnInit*/ {
	@Input() client: IClient;
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() close = new EventEmitter<IClient>();
	@Output() updateClient = new EventEmitter<IClient>();
	// clientFull: IClient = null;

	constructor(/*private clientService: ClientService*/) {}

	// ngOnInit() {
	// 	window.console && console.log('TODO: Should we move this to the client-info instead of here???');
	// 	this.clientService.getClient(this.clientBasic.ClientId).then(client => {
	// 		window.console && console.log('done getting data', client);
	// 		this.clientFull = client;
	// 	});
	// }

	// updateClientBasic(client: IClient) {
	// 	this.clientService.mergeClientIntoClientRow(client, this.clientBasic);
	// }

	updateClientInfo(client: IClient) {
		this.updateClient.emit(this.client);
	}

	closeDetail() {
		this.close.emit(this.client);
	}
}
