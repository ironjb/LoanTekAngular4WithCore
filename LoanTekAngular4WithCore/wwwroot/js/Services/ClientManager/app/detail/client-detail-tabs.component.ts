import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ILoggedInUserInfo } from 'ltCommon/index';
import { IClient } from './../shared/index';

@Component({
	selector: 'scm-detail-tabs'
	, templateUrl: './client-detail-tabs.component.html'
})
export class ClientDetailTabCompmonent {
	@Input() client: IClient;
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() close = new EventEmitter<IClient>();
	@Output() updateClient = new EventEmitter<IClient>();

	constructor() {}

	updateClientInfo(client: IClient) {
		this.updateClient.emit(this.client);
	}

	closeDetail() {
		this.close.emit(this.client);
	}
}
