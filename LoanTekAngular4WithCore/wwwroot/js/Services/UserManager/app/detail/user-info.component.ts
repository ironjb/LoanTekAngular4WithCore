import { Component, EventEmitter, Input, Output, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';

import { CommonMethodsService, IState, ISelectOption, TOASTR_TOKEN, LODASH_TOKEN, ILoggedInUserInfo } from 'ltCommon/index';
import { IUser, UserService, IChangeUserRoleModel, IUpdatePasswordModel } from './../shared/index';

@Component({
	selector: 'sum-user-info'
	, templateUrl: './user-info.component.html'
})
export class UserInfoCompmonent implements OnInit {
	@Input() user: IUser;
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() updateUser = new EventEmitter<IUser>();
	states: IState[];
	userRoleFG: FormGroup;
	passwordFG: FormGroup;
	lockOutFG: FormGroup;
	userInfoFG: FormGroup;
	isUpdateUserRoleBtnDisabled: boolean = false;
	isUpdatePasswordBtnDisabled: boolean = false;
	isUnlockBtnDisabled: boolean = false;
	isUpdateBtnDisabled: boolean = false;
	// userTypes: ISelectOption[];
	timeZones: ISelectOption[];
	userRoles: ISelectOption[];

	constructor(private cm: CommonMethodsService, private formBuilder: FormBuilder, private uServ: UserService, @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region Init

		ngOnInit() {
			// window.console && console.log('user-info init');
			this.userRoleFG = this.formBuilder.group(this.initUserRoleForm());
			this.passwordFG = this.formBuilder.group(this.initPasswordForm());
			this.lockOutFG = this.formBuilder.group(this.initLockOutForm());
			this.userInfoFG = this.formBuilder.group(this.initUserInfoForm());

			if (this.user) {
				this.lockOutFG.patchValue(this.user);
				this.userInfoFG.patchValue(this.user);
				this.userRoleFG.patchValue(this.user);

				this.uServ.getTimeZoneOptions().then(tz => {
					this.timeZones = tz;
				}).catch((error: Response) => {
					window.console && console.error('Error:', error);
				});

				this.uServ.getUserRoleOptions(this.loggedInUserInfo.UserId).then(ur => {
					this.userRoles = ur;
				}).catch((error: Response) => {
					window.console && console.error('Error:', error);
				});
			}

			// this.uServ.getUserTypeOptions().then(ut => {
			// 	this.userTypes = ut;
			// }).catch((error: Response) => {
			// 	window.console && console.error('Error:', error);
			// });

			this.states = this.cm.US_States();
		}

		get UserRole() { return this.userRoleFG.get('UserRole'); }

		get Password() { return this.passwordFG.get('Password'); }

		get LockedOut() { return this.lockOutFG.get('LockedOut'); }

		// get UserType() { return this.userInfoFG.get('UserType'); }
		get Title() { return this.userInfoFG.get('Title'); }
		get FirstName() { return this.userInfoFG.get('FirstName'); }
		get LastName() { return this.userInfoFG.get('LastName'); }
		get Address() { return this.userInfoFG.get('Address'); }
		get City() { return this.userInfoFG.get('City'); }
		get State() { return this.userInfoFG.get('State'); }
		get ZipCode() { return this.userInfoFG.get('ZipCode'); }
		get Phone() { return this.userInfoFG.get('Phone'); }
		get PhoneExt() { return this.userInfoFG.get('PhoneExt'); }
		get CellPhone() { return this.userInfoFG.get('CellPhone'); }
		get HomePhone() { return this.userInfoFG.get('HomePhone'); }
		get TimeZonePreference() { return this.userInfoFG.get('TimeZonePreference'); }
		get NmlsNumber() { return this.userInfoFG.get('NmlsNumber'); }
		get Url() { return this.userInfoFG.get('Url'); }

		// get UserRole() { return this.userInfoFG.get('UserRole'); }
		get Email() { return this.userInfoFG.get('Email'); }
		// get Password() { return this.userInfoFG.get('Password'); }
		get Active() { return this.userInfoFG.get('Active'); }

	// #endregion

	// #region Main methods

		updateUserRole() {
			this.isUpdateUserRoleBtnDisabled = true;

			let userRoleModel: IChangeUserRoleModel = {
				UserName: this.user.Email
				, SecurityRole: this.UserRole.value
			};

			this.uServ.changeUserRole(userRoleModel).then(isRoleUpdated => {
				this.isUpdateUserRoleBtnDisabled = false;
				this.user.UserRole = this.UserRole.value;
				this.updateUser.emit(this.user);
				this.toastr.success('User Role Updated!');
			}).catch((error: Response) => {
				this.isUpdateUserRoleBtnDisabled = false;
				this.toastr.error('Could not update User Role', 'Error');
				window.console && console.log('Error, could not update UserRole:', error);
			});
		}

		updatePassword() {
			this.isUpdatePasswordBtnDisabled = true;
			if (this.passwordFG.invalid) {
				this.Password.markAsTouched();
			} else {
				let passwordModel: IUpdatePasswordModel = {
					UserId: this.user.UserId
					, UserName: this.user.Email
					, NewPassword: this.Password.value
				};

				this.uServ.updatePassword(passwordModel).then(isPasswordUpdated => {
					this.isUpdatePasswordBtnDisabled = false;
					this.toastr.success('Password Updated!');
					this.passwordFG.reset(this.initPasswordForm());
					this.Password.setValue('');
				}).catch((error: Response) => {
					this.isUpdatePasswordBtnDisabled = false;
					this.toastr.error('Could not update Password', 'Error');
					window.console && console.log('Error, could not update Password:', error);
					this.passwordFG.reset(this.initPasswordForm());
					this.Password.setValue('');
				});
			}
		}

		unlockUser() {
			this.isUnlockBtnDisabled = true;
		}

		updateUserInfo() {
			this.isUpdateBtnDisabled = true;
			if (this.userInfoFG.invalid) {
				this.FirstName.markAsTouched();
				this.LastName.markAsTouched();
				this.Address.markAsTouched();
				this.City.markAsTouched();
				this.State.markAsTouched();
				this.ZipCode.markAsTouched();
				this.Phone.markAsTouched();
				this.Email.markAsTouched();
				this.isUpdateBtnDisabled = false;
			} else {
				// Copy user and modify with new values
				let saveUser: IUser = this._.cloneDeep(this.user);
				this._.assign(saveUser, this.userInfoFG.value);
				// window.console && console.log('user', this.user, saveUser);

				this.uServ.saveUser(saveUser).then(isSaved => {
					// Update user with new values
					this._.assign(this.user, saveUser);

					// Emit changes to be picked up by list
					this.updateUser.emit(this.user);

					// Show success message
					this.toastr.success('Updated Client');
					this.isUpdateBtnDisabled = false;
				}).catch((error: Response) => {
					window.console && console.error('User Save Error:', error);
					this.isUpdateBtnDisabled = false;
					this.toastr.error('Could not save the User', 'Error');
				});
			}
		}

	// #endregion

	// #region Shared methods

		isInvalidDirtyTouched(control: AbstractControl) {
			return control.invalid && (control.dirty || control.touched);
		}

		isInvalidTouched(control: AbstractControl) {
			return control.invalid && (control.touched);
		}

		private initUserRoleForm() {
			return {
				UserRole: ''
			};
		}

		private initPasswordForm() {
			return {
				Password: ['', Validators.minLength(6)]
			};
		}

		private initLockOutForm() {
			return {
				LockedOut: { value: false, disabled: true }
			};
		}

		private initUserInfoForm() {
			return {
				// UserType: ['', Validators.required]
				Title: ''
				, FirstName: ['', Validators.required]
				, LastName: ['', Validators.required]
				, Address: ['', Validators.required]
				, City: ['', Validators.required]
				, State: ['', Validators.required]
				, ZipCode: ['', Validators.required]
				, Phone: ['', Validators.required]
				, Ext: ''
				, CellPhone: ''
				, HomePhone: ''
				, TimeZonePreference: ''
				, NMLS: ''
				, WebSite: ''
				// , UserRole: ''
				, Email: ['', Validators.required]
				// , Password: ''
				, Active: false
				// , LockedOut: false
				// , Title: ['', Validators.required]
			};
		}

	// #endregion
}
