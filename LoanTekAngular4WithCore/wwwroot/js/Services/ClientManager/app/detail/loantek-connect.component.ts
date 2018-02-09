import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ClientService, IClient } from './../shared/index';

@Component({
	selector: 'scm-loantek-connect'
	, templateUrl: './loantek-connect.component.html'
})
export class LoanTekConnectCompmonent implements OnInit {
	@Input() client: IClient;
	ltConnect: any;

	constructor(private clientService: ClientService) {}

	// #region Init

		ngOnInit() {
			this.ltConnect = {};
		}

	// #endregion

	// #region Main methods



	// #endregion

	// #region Shared methods

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
