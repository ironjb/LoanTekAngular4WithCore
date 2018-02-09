import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';

import { CommonMethodsService, IState, ISelectOption, TOASTR_TOKEN, ILoggedInUserInfo } from 'ltCommon/index';
import { UserService, IUser } from './../shared/index';

@Component({
	selector: 'sum-add-new-user'
	, templateUrl: './add-new-user.component.html'
})
export class AddNewUserCompmonent implements OnInit {
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() done = new EventEmitter<IUser>();
	@Output() cancel = new EventEmitter<IUser>();
	addUserFG: FormGroup;
	states: IState[];
	timeZones: ISelectOption[];
	userRoles: ISelectOption[];
	isAddNewUserBtnDisabled: boolean = false;
	showAdditionalUserAgreement: boolean = false;

	constructor(private cm: CommonMethodsService, private userService: UserService, private formBuilder: FormBuilder, @Inject(TOASTR_TOKEN) private toastr: Toastr) {}

	// #region Init

		ngOnInit() {
			// window.console && console.log('add-new-user init');
			this.addUserFG = this.formBuilder.group(this.initNewUserForm());

			// this.AdditionalUserAgreement.setValidators(Validators.requiredTrue);

			// Get timezones
			this.userService.getTimeZoneOptions().then(tz => {
				this.timeZones = tz;
			}).catch((error: Response) => {
				window.console && console.error('Error:', error);
			});

			// Get user roles
			this.userService.getUserRoleOptions(this.loggedInUserInfo.UserId).then(ur => {
				this.userRoles = ur;
			}).catch((error: Response) => {
				window.console && console.error('Error:', error);
			});

			// Get states
			this.states = this.cm.US_States();
		}

		get Title() { return this.addUserFG.get('Title'); }
		get FirstName() { return this.addUserFG.get('FirstName'); }
		get LastName() { return this.addUserFG.get('LastName'); }
		get Address() { return this.addUserFG.get('Address'); }
		get City() { return this.addUserFG.get('City'); }
		get State() { return this.addUserFG.get('State'); }
		get ZipCode() { return this.addUserFG.get('ZipCode'); }
		get Phone() { return this.addUserFG.get('Phone'); }
		get Ext() { return this.addUserFG.get('Ext'); }
		get CellPhone() { return this.addUserFG.get('CellPhone'); }
		get HomePhone() { return this.addUserFG.get('HomePhone'); }
		get Email() { return this.addUserFG.get('Email'); }
		get Password() { return this.addUserFG.get('Password'); }
		get UserRole() { return this.addUserFG.get('UserRole'); }
		get TimeZonePreference() { return this.addUserFG.get('TimeZonePreference'); }
		get NMLS() { return this.addUserFG.get('NMLS'); }
		get AdditionalUserAgreement() { return this.addUserFG.get('AdditionalUserAgreement'); }

	// #endregion

	// #region Main Methods

		addNewUser() {
			window.console && console.log('addNewUser', this.addUserFG.value);
			this.isAddNewUserBtnDisabled = true;
			if (this.addUserFG.invalid) {
				this.Title.markAsTouched();
				this.FirstName.markAsTouched();
				this.LastName.markAsTouched();
				this.Address.markAsTouched();
				this.City.markAsTouched();
				this.State.markAsTouched();
				this.ZipCode.markAsTouched();
				this.Phone.markAsTouched();
				this.Ext.markAsTouched();
				this.CellPhone.markAsTouched();
				this.HomePhone.markAsTouched();
				this.Email.markAsTouched();
				this.Password.markAsTouched();
				this.UserRole.markAsTouched();
				this.TimeZonePreference.markAsTouched();
				this.NMLS.markAsTouched();
				this.AdditionalUserAgreement.markAsTouched();
				this.isAddNewUserBtnDisabled = false;
			} else {
				// window.console && console.log('new user created', this.addUserFG.value);
				this.toastr.success('New User Created');
				this.isAddNewUserBtnDisabled = false;
				this.done.emit(this.addUserFG.value);
			}
		}

		resetForm() {
			// window.console && console.log('reset form');
			this.isAddNewUserBtnDisabled = false;
			this.addUserFG.reset({
				State: ''
				, UserRole: ''
				, TimeZonePreference: ''
			});

			this.showAdditionalUserAgreement = !this.showAdditionalUserAgreement;

			if (this.showAdditionalUserAgreement) {
				this.AdditionalUserAgreement.setValidators(Validators.requiredTrue);
			} else {
				this.AdditionalUserAgreement.clearValidators();
			}
		}

		closeAddUser() {
			this.cancel.emit();
		}

	// #endregion

	// #region Shared Methods

		isInvalidDirtyTouched(control: AbstractControl) {
			return control.invalid && (control.dirty || control.touched);
		}

		private initNewUserForm() {
			return {
				Title: ['', Validators.required]
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
				// , WebSite: ''
				, Email: ['', [Validators.required, Validators.email]]
				, Password: ['', [Validators.required, Validators.minLength(6)]]
				, UserRole: ['', Validators.required]
				, TimeZonePreference: ['', Validators.required]
				, NMLS: ''
				, AdditionalUserAgreement: false//[false, Validators.requiredTrue]
			};
		}

	// #endregion
}
