import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {animate, state, style, transition, trigger, query, AnimationMetadata} from '@angular/animations';
import { Observable } from 'rxjs/Observable';

import { PagingComponent, IPagingChangeInfo, TooltipDirective, SimpleModalComponent, LODASH_TOKEN, TOASTR_TOKEN, CommonMethodsService } from 'ltCommon/index';
import { ClientService, IClientListInfo, IClient, IClientRow, IClientListSort, IClientListFilter } from './shared/index';

let slideAnimations: AnimationMetadata[] = [
	state('show, void', style({ height: '*', opacity: 1 })),
	state('hide', style({ height: 0, opacity: 0})),
	transition('show => hide', [animate(100, style({height: '*'})), animate(200)]),
	transition('hide => show', [animate(200)])
];

@Component({
	selector: 'scm-app',
	templateUrl: './app.component.html',
	styles: [`
		.slide-left-right-container {overflow:hidden;}
		.slide-left-right {position:relative;width:200%;}
	`],
	animations: [
		trigger('rightLeftSlideContent', [
			state('left, void', style({left: '0%'})),
			state('right', style({left: '-100%'})),
			transition('left <=> right', [animate(200)])
		]),
		trigger('leftSlideContent', slideAnimations),
		trigger('rightSlideContent', slideAnimations)
	]
})
export class AppComponent implements OnInit {
	@ViewChild('clientInfoModal') clientInfoModal: SimpleModalComponent;
	// @ViewChild('testmodal') testmodal: SimpleModalComponent;
	clientListInfo: IClientListInfo;
	scmFilterFG: FormGroup;
	isGettingClientList: boolean = false;
	isGettingClientData: boolean = false;
	currentClient: IClient;
	initCurrentPage: number = 1;
	initPageSize: number = 10;
	sortBy: IClientListSort = null;
	reverseSort: boolean = false;

	// stateExpression: string;
	leftRightExp: string;
	leftExp: string;
	rightExp: string;

	constructor(private formBuilder: FormBuilder, private clientService: ClientService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr, private cm: CommonMethodsService) {}

	// expand() { this.stateExpression = 'expanded'; }

	// collapse() { this.stateExpression = 'collapsed'; }

	// openTestModal() { this.testmodal.openModal(); }

	// #region Init

		ngOnInit() {
			this.clientService.initLoggedInUserInfo().then(lUserInfo => {
				if (lUserInfo.IsRole && lUserInfo.IsRole.LoanTekAdmin) {
					this.scmFilterFG = this.formBuilder.group(this.initFilterFormGroup());
					this.filterClientList(this.initCurrentPage, this.initPageSize, this.sortBy, this.reverseSort);
					this.showLeftSlideInit();
				} else {
					this.clientService.getClient(lUserInfo.ActiveClientId).then(client => {
						this.currentClient = client;
						this.clientListInfo = {
							clientCount: 1
							, loggedInUserInfo: lUserInfo
							, currentPage: 1
							, pageSize: 10
							, clientList: []
						};
					}).catch(this.handleError);
				}
			}).catch(this.handleError);
		}

	// #endregion

	// #region Slide Left/Right

		showLeftSlideInit() {
			this.leftRightExp = 'left';
			this.leftExp = 'show';
			this.rightExp = 'hide';
		}

		showRightSlideInit() {
			this.leftRightExp = 'right';
			this.leftExp = 'hide';
			this.rightExp = 'show';
		}

		showLeftSlide() {
			this.showLeftSlideInit();
			// setTimeout(() => {
				this.cm.ScrollToAnchor('clientManagerTop');
			// }, 100);
		}

		showRightSlide() {
			this.showRightSlideInit();
			// this.leftRightExp = 'right';
			// this.leftExp = 'hide';
			// this.rightExp = 'show';
			// setTimeout(() => {
				this.cm.ScrollToAnchor('clientManagerTop');
			// }, 100);
		}

	// #endregion

	// #region Filter/Paging Results

		filterResults() {
			this.isGettingClientList = true;
			var pgSize = this.clientListInfo.pageSize || this.initPageSize;
			this.filterClientList(this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, this.scmFilterFG.value, () => { this.isGettingClientList = false; });
		}

		filterResultsDebounce = this._.debounce(() => {
			this.filterResults();
		}, 400);

		clearFilter() {
			this.isGettingClientList = true;
			this.scmFilterFG.reset(this.initFilterFormGroup());
			var pgSize = this.clientListInfo.pageSize || this.initPageSize;
			this.filterClientList(this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, null, () => { this.isGettingClientList = false; });
		}

		pageChange(e: IPagingChangeInfo) {
			this.isGettingClientList = true;
			this.filterClientList(e.page, e.pageSize, this.sortBy, this.reverseSort, this.scmFilterFG.value, () => { this.isGettingClientList = false; });
		}

		changeSort(sortBy: IClientListSort) {
			this.isGettingClientList = true;
			if (sortBy === this.sortBy) {
				// window.console && console.log('reversing Sort');
				if (this.reverseSort) {
					this.sortBy = null;
					this.reverseSort = false;
				} else {
					this.reverseSort = !this.reverseSort;
				}
			} else {
				// window.console && console.log('changing to new sort');
				this.sortBy = sortBy;
				this.reverseSort = false;
			}

			this.filterClientList(this.initCurrentPage, this.clientListInfo.pageSize, this.sortBy, this.reverseSort, this.scmFilterFG.value, () => { this.isGettingClientList = false; });
		}

	// #endregion

	// #region Client Modal Methods

		openClientInfo(clientRow: IClientRow) {
			this.isGettingClientData = true;
			this.clientService.getClient(clientRow.ClientId).then(client => {
				// window.console && console.log('done getting data', client);
				this.isGettingClientData = false;
				this.currentClient = client;
				this.currentClient.Status = clientRow.Status;
				// this.clientInfoModal.openModal();
				this.showRightSlide();
			}).catch((error: Response) => {
				window.console && console.error('ERROR:', error);
				this.isGettingClientData = false;
				this.toastr.error('Unable to retrieve Client data', 'Error:');
				return Observable.throw(error.statusText);
			});
		}

		closeClientInfoModal() {
			// this.clientInfoModal.closeModal();
			this.showLeftSlide();
			this.clearCurrentClient();
		}

		updateClient(c: IClient) {
			// window.console && console.log('app.component updateClient', c);
			// var selectedClientIndex: number = this.clientListInfo.clientList.findIndex(cl => cl.ClientId === c.ClientId);
			// window.console && console.log('selectedClientIndex (not used???)', selectedClientIndex);
			// if (selectedClientIndex !== -1) {
				// var selectedClient = this.clientListInfo.clientList[selectedClientIndex];
				var selectedClient: IClientRow = this.clientListInfo.clientList.find(cl => cl.ClientId === c.ClientId);
				// window.console && console.log('selectedClient', selectedClient);
				selectedClient.Company = c.Company;
				selectedClient.Contact = c.Contact;
				selectedClient.Phone = c.Phone;
				selectedClient.Email = c.Email;
				selectedClient.City = c.City;
				selectedClient.State = c.State;
			// }
		}

	// #endregion

	// #region Shared Methods

		// isInvalidDirtyTouched(control: AbstractControl) {
		// 	return control.invalid && (control.dirty || control.touched);
		// }

		clearCurrentClient() {
			// setTimeout(function() {
				this.currentClient = null;
			// }, 1000);
		}

		private filterClientList(currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IClientListFilter, callback?: Function) {
			// window.console && console.log('filterClientList\n\tcurrentPage:', currentPage, '\n\tpageSize:', pageSize, '\n\tsortBy', sortBy, '\n\treverse:', reverse, '\n\tfilter', filter, '\n\tcallback:', callback);
			this.clientService.getFilteredClientList(currentPage, pageSize, sortBy, reverse, filter).then(clientInfo => {
				this.clientListInfo = clientInfo;
				if (callback && typeof callback === 'function') { callback(); }
			}).catch(this.handleError);
		}

		private initFilterFormGroup() {
			let clearFilterObject: IClientListFilter = {
				companyFilter: ''
				, contactFilter: ''
				, phoneFilter: ''
				, emailFilter: ''
				, cityFilter: ''
				, stateFilter: ''
				, statusFilter: ''
			};

			return clearFilterObject;
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
