import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {animate, state, style, transition, trigger, query, AnimationMetadata} from '@angular/animations';
import { Observable } from 'rxjs/Observable';

import { PagingComponent, SimpleModalComponent, IPagingChangeInfo, TooltipDirective/*, SimpleModalComponent*/, LODASH_TOKEN, TOASTR_TOKEN, CommonMethodsService, IFilterOperator } from 'ltCommon/index';
import { UserService, IUserListInfo, IUserRow, IUser, IUserListSort, IUserListFilter /*ClientService, IClientListInfo, IClient, IClientRow, IClientListSort, IClientListFilter*/ } from './shared/index';
import { AddNewUserCompmonent } from './detail/add-new-user.component';

let slideAnimations: AnimationMetadata[] = [
	state('show, void', style({ height: '*', opacity: 1 })),
	state('hide', style({ height: 0, opacity: 0})),
	transition('show => hide', [animate(100, style({height: '*'})), animate(200)]),
	transition('hide => show', [animate(200)])
];

@Component({
	selector: 'sum-app',
	templateUrl: './app.component.html',
	styles: [`
		.slide-left-right-container {overflow:hidden; margin:-5px; padding:5px;}
		.slide-left-right {position:relative;width:200%;}
		.lastLoginFilterWrap {min-width: 160px;}
		.activeFilterWrap {min-width: 80px;}
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
	@ViewChild('addNewUserModal') addNewUserModal: SimpleModalComponent;
	@ViewChild('addUser') addUser: AddNewUserCompmonent;
	userListInfo: IUserListInfo;
	sumFilterFG: FormGroup;
	isGettingUserList: boolean = false;
	isGettingUserData: boolean = false;
	currentUser: IUser;
	initCurrentPage: number = 1;
	initPageSize: number = 10;
	sortBy: IUserListSort = null;
	reverseSort: boolean = false;

	// stateExpression: string;
	leftRightExp: string;
	leftExp: string;
	rightExp: string;

	constructor(private formBuilder: FormBuilder, private userService: UserService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr, private cm: CommonMethodsService) {}

	// #region Init

		ngOnInit() {
			this.userService.initLoggedInUserInfo().then(loggedUserInfo => {
				if (loggedUserInfo.IsRole && loggedUserInfo.IsRole.ClientSalesAdmin) {
					this.sumFilterFG = this.formBuilder.group(this.initFilterFormGroup());
					this.filterUserList(this.initCurrentPage, this.initPageSize, this.sortBy, this.reverseSort, this.sumFilterFG.value);
					this.showLeftSlideInit();
				} else {
					this.userService.getUser(loggedUserInfo.ActiveUserId).then(user => {
						this.currentUser = user;
						this.userListInfo = {
							userCount: 1
							, loggedInUserInfo: loggedUserInfo
							, currentPage: 1
							, pageSize: 10
							, userList: []
						};
					}).catch(this.userService.handleError);
				}
			}).catch(this.userService.handleError);
		}

		get lastLoginOpFilter() { return this.sumFilterFG.get('lastLoginOpFilter'); }

	// #endregion

	// #region Slide Left/Right

		showLeftSlideInit() {
			this.leftRightExp = 'left';
			this.leftExp = 'show';
			this.rightExp = 'hide';
		}

		showLeftSlide() {
			this.showLeftSlideInit();
			// setTimeout(() => {
				this.cm.ScrollToAnchor('userManagerTop');
			// }, 100);
		}

		showRightSlide() {
			this.leftRightExp = 'right';
			this.leftExp = 'hide';
			this.rightExp = 'show';
			// setTimeout(() => {
				this.cm.ScrollToAnchor('userManagerTop');
			// }, 100);
		}

	// #endregion

	// #region Filter/Paging Results

		filterResults() {
			this.isGettingUserList = true;
			var pgSize = this.userListInfo.pageSize || this.initPageSize;
			// window.console && console.log('filterResults', this.sumFilterFG.value);
			this.filterUserList(this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, this.sumFilterFG.value, () => { this.isGettingUserList = false; });
		}

		filterResultsDebounce = this._.debounce(() => {
			this.filterResults();
		}, 400);

		clearFilter() {
			this.isGettingUserList = true;
			this.sumFilterFG.reset(this.initFilterFormGroup());
			var pgSize = this.userListInfo.pageSize || this.initPageSize;
			this.filterUserList(this.initCurrentPage, pgSize, this.sortBy, this.reverseSort, null, () => { this.isGettingUserList = false; });
		}

		pageChange(e: IPagingChangeInfo) {
			this.isGettingUserList = true;
			this.filterUserList(e.page, e.pageSize, this.sortBy, this.reverseSort, this.sumFilterFG.value, () => { this.isGettingUserList = false; });
		}

		changeLastLoginOp(op: IFilterOperator) {
			this.lastLoginOpFilter.setValue(op);
			this.filterResults();
		}

		changeSort(sortBy: IUserListSort) {
			this.isGettingUserList = true;
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

			this.filterUserList(this.initCurrentPage, this.userListInfo.pageSize, this.sortBy, this.reverseSort, this.sumFilterFG.value, () => { this.isGettingUserList = false; });
		}

	// #endregion

	// #region User Pane Methods

		openUserInfo(userRow: IUserRow) {
			this.isGettingUserData = true;
			this.userService.getUser(userRow.UserId).then(user => {
				// window.console && console.log('done getting data', client);
				this.isGettingUserData = false;
				this.currentUser = user;
				// this.currentUser.Status = userRow.Status;
				// this.clientInfoModal.openModal();
				this.showRightSlide();
			}).catch((error: Response) => {
				window.console && console.error('ERROR:', error);
				this.isGettingUserData = false;
				this.toastr.error('Unable to retrieve Client data', 'Error:');
				return Observable.throw(error.statusText);
			});
		}

		closeUserInfoPane() {
			// this.clientInfoModal.closeModal();
			this.showLeftSlide();
			this.clearCurrentUser();
		}

		updateUser(u: IUser) {
			// window.console && console.log('app.component updateClient', c);
			// var selectedClientIndex: number = this.userListInfo.clientList.findIndex(cl => cl.ClientId === c.ClientId);
			// window.console && console.log('selectedClientIndex (not used???)', selectedClientIndex);
			// if (selectedClientIndex !== -1) {
				// var selectedClient = this.clientListInfo.clientList[selectedClientIndex];
				var selectedUser: IUserRow = this.userListInfo.userList.find(ul => ul.UserId === u.UserId);
				// window.console && console.log('selectedClient', selectedClient);
				// selectedUser.ClientName = u.ClientName;
				selectedUser.FirstName = u.FirstName;
				selectedUser.LastName = u.LastName;
				selectedUser.Phone = u.Phone;
				selectedUser.Email = u.Email;
				selectedUser.LastLogin = u.LastLogin;
				selectedUser.Active = u.Active;
				selectedUser.UserRole = u.UserRole;
			// }
		}

	// #endregion

	// #region Add New User Methods

		showAddNewUser() {
			this.addNewUserModal.openModal();
		}

		resetAddNewUser() {
			this.addUser.resetForm();
		}

	// #endregion

	// #region Shared Methods

		// isInvalidDirtyTouched(control: AbstractControl) {
		// 	return control.invalid && (control.dirty || control.touched);
		// }

		clearCurrentUser() {
			// setTimeout(function() {
				this.currentUser = null;
			// }, 1000);
		}

		private filterUserList(currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IUserListFilter, callback?: Function) {
			// window.console && console.log('filterClientList\n\tcurrentPage:', currentPage, '\n\tpageSize:', pageSize, '\n\tsortBy', sortBy, '\n\treverse:', reverse, '\n\tfilter', filter, '\n\tcallback:', callback);
			this.userService.getFilteredUserList(currentPage, pageSize, sortBy, reverse, filter).then(userInfo => {
				this.userListInfo = userInfo;
				if (callback && typeof callback === 'function') { callback(); }
			}).catch(this.userService.handleError);
		}

		private initFilterFormGroup() {
			let clearFilterObject: IUserListFilter = {
				// clientNameFilter: ''
				firstNameFilter: ''
				, lastNameFilter: ''
				, phoneFilter: ''
				, emailFilter: ''
				, lastLoginFilter: ''
				, lastLoginOpFilter: 'gt'
				, activeFilter: 'true'
				, userRoleFilter: ''
			};

			return clearFilterObject;
		}

		// private handleError(error: Response) {
		// 	window.console && console.error('ERROR:', error);
		// 	return Observable.throw(error.statusText);
		// }

	// #endregion
}
