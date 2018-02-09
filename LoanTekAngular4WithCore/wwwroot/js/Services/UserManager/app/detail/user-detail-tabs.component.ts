import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ILoggedInUserInfo } from 'ltCommon/index';
import { IUser } from './../shared/index';

@Component({
	selector: 'sum-detail-tabs'
	, templateUrl: './user-detail-tabs.component.html'
})
export class UserDetailTabCompmonent {
	@Input() user: IUser;
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() close = new EventEmitter<IUser>();
	@Output() updateUser = new EventEmitter<IUser>();

	constructor() {}

	updateUserInfo(user: IUser) {
		this.updateUser.emit(this.user);
	}

	closeDetail() {
		this.close.emit(this.user);
	}
}
