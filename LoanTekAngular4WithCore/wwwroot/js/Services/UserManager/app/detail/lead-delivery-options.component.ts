import { Component, Input, ViewChild, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';

import { TOASTR_TOKEN, LODASH_TOKEN, CommonMethodsService, SimpleModalComponent, ISelectOption } from 'ltCommon/index';
import { UserService, IUser, IDeliverByEmailOption, IDeliverBySmsOption } from './../shared/index';

@Component({
	selector: 'sum-lead-delivery-options'
	, templateUrl: './lead-delivery-options.component.html'
})
export class LeadDeliveryOptionsCompmonent implements OnInit {
	@Input() user: IUser;

	// Deliver By Email
	@ViewChild('deleteDeliverByEmailModal') deleteDeliverByEmailModal: SimpleModalComponent;
	addEmailFG: FormGroup;
	deliverByEmailOptions: IDeliverByEmailOption[];
	currentDeliverByEmailOption: IDeliverByEmailOption = null;
	showAddEmail: boolean = false;
	isDeleteEmailBtnDisabled: boolean = false;
	isAddEmailBtnDisabled: boolean = false;

	// Deliver By SMS
	@ViewChild('deleteDeliverBySmsModal') deleteDeliverBySmsModal: SimpleModalComponent;
	addSmsFG: FormGroup;
	deliverBySmsOptions: IDeliverBySmsOption[];
	smsProviderList: ISelectOption[];
	currentDeliverBySmsOption: IDeliverBySmsOption = null;
	showAddSms: boolean = false;
	isDeleteSmsBtnDisabled: boolean = false;
	isAddSmsBtnDisabled: boolean = false;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private cm: CommonMethodsService, @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region Init

		ngOnInit() {
			if (this.user) {
				this.addEmailFG = this.formBuilder.group(this.initAddEmailFormGroup());
				this.addSmsFG = this.formBuilder.group(this.initAddSmsFormGroup());

				this.userService.getSmsProviders().then(providers => {
					this.smsProviderList = providers;
				}).catch(this.userService.handleError);

				// this.userService.getDeliverByEmailOptions(this.user.UserId).then(dbEmailOptions => {
				// 	this.deliverByEmailOptions = dbEmailOptions;
				// }).catch(this.userService.handleError);
				this.populateDeliverByEmailOptions();
			}
		}

		// Deliver By Email
		populateDeliverByEmailOptions(callback?: (deliverByEmailOptionList: IDeliverByEmailOption[]) => void) {
			this.userService.getDeliverByEmailOptions(this.user.UserId).then(dbEmailOptions => {
				this.deliverByEmailOptions = dbEmailOptions;
				if (callback) { callback(dbEmailOptions); }
			}).catch(this.userService.handleError);
		}

		get Email() { return this.addEmailFG.get('Email'); }

		// Deliver By SMS
		populateDeliverBySmsOptions(callback?: (deliverBySmsOptionList: IDeliverBySmsOption[]) => void) {
			this.userService.getDeliverBySmsOptions(this.user.UserId).then(dbSmsOptions => {
				this.deliverBySmsOptions = dbSmsOptions;
				if (callback) { callback(dbSmsOptions); }
			}).catch(this.userService.handleError);
		}

		get SmsNumber() { return this.addSmsFG.get('SmsNumber'); }
		get SpId() { return this.addSmsFG.get('SpId'); }

	// #endregion

	// #region Deliver By Email

		showAddEmailForm() {
			this.showAddEmail = true;
			this.resetAddEmailFormGroup();
		}

		hideAddEmailForm() {
			this.showAddEmail = false;
			this.resetAddEmailFormGroup();
		}

		addNewEmail() {
			this.isAddEmailBtnDisabled = true;
			// window.console && console.log('addNewEmail', this.addEmailFG.value);

			if (this.addEmailFG.invalid) {
				this.Email.markAsTouched();
				this.Email.markAsDirty();
				this.isAddEmailBtnDisabled = false;
			} else {
				let dbEmail: IDeliverByEmailOption = this._.clone(this.addEmailFG.value);

				this.userService.saveDeliverByEmail(dbEmail).then(isSaved => {
					this.populateDeliverByEmailOptions(() => {
						this.isAddEmailBtnDisabled = false;
						this.showAddEmail = false;
						this.resetAddEmailFormGroup();
					});
				}).catch((error: Response) => {
					window.console && console.error('Could not save new Deliver By Email', error);
					this.isAddEmailBtnDisabled = false;
					this.toastr.error('Could not save new Deliver By Email', 'Error');
				});
			}
		}

		confirmDeleteDeliverByEmail(emailOpt: IDeliverByEmailOption) {
			this.currentDeliverByEmailOption = emailOpt;
			this.deleteDeliverByEmailModal.openModal();
		}

		deleteDeliverByEmail() {
			this.isDeleteEmailBtnDisabled = true;

			this.userService.deleteDeliverByEmail(this.currentDeliverByEmailOption.Id).then(isDeleted => {
				let edoIndex = this.deliverByEmailOptions.indexOf(this.currentDeliverByEmailOption);
				if (edoIndex !== -1) {
					this.deliverByEmailOptions.splice(edoIndex, 1);
				}

				this.isDeleteEmailBtnDisabled = false;
				this.deleteDeliverByEmailModal.closeModal();
				this.toastr.success('Deliver By Email DELETED');
			}).catch((error: Response) => {
				window.console && console.error('Could not delete Deliver By Email', error);
				this.isDeleteEmailBtnDisabled = false;
				this.toastr.error('Could not delete Deliver By Email', 'Error');
			});
		}

	// #endregion

	// #region Deliver By SMS

		showAddSmsForm() {
			this.showAddSms = true;
			this.resetAddSmsFormGroup();
		}

		hideAddSmsForm() {
			this.showAddSms = false;
			this.resetAddSmsFormGroup();
		}

		addNewSms() {
			this.isAddSmsBtnDisabled = true;

			if (this.addSmsFG.invalid) {
				this.SmsNumber.markAsTouched();
				this.isAddSmsBtnDisabled = false;
			} else {
				let dbSms: IDeliverBySmsOption = this._.clone(this.addSmsFG.value);

				this.userService.saveDeliverBySms(dbSms).then(isSaved => {
					this.populateDeliverBySmsOptions(() => {
						this.isAddSmsBtnDisabled = false;
						this.showAddSms = false;
						this.resetAddSmsFormGroup();
					});
				}).catch((error: Response) => {
					window.console && console.error('Could not save new Deliver By SMS', error);
					this.isAddSmsBtnDisabled = false;
					this.toastr.error('Could not save new Deliver By SMS', 'Error');
				});
			}
		}

		confirmDeleteDeliverBySms(smsOpt: IDeliverBySmsOption) {
			this.currentDeliverBySmsOption = smsOpt;
			this.deleteDeliverBySmsModal.openModal();
		}

		deleteDeliverBySms() {
			this.isDeleteSmsBtnDisabled = true;

			this.userService.deleteDeliverBySms(this.currentDeliverBySmsOption.Id).then(isDeleted => {
				let sdoIndex = this.deliverBySmsOptions.indexOf(this.currentDeliverBySmsOption);
				if (sdoIndex !== -1) {
					this.deliverBySmsOptions.splice(sdoIndex, 1);
				}

				this.isDeleteSmsBtnDisabled = false;
				this.deleteDeliverBySmsModal.closeModal();
				this.toastr.success('Deliver By SMS DELETED');
			}).catch((error: Response) => {
				window.console && console.error('Could not delete Deliver By SMS', error);
				this.isDeleteSmsBtnDisabled = false;
				this.toastr.error('Could not delete Deliver By SMS', 'Error');
			});
		}

	// #endregion

	// #region Shared methods

		// isInvalidDirtyAndTouched(control: AbstractControl) {
		// 	return control.invalid && (control.dirty && control.touched);
		// }

		private initAddEmailFormGroup() {
			return {
				Email: ['', [Validators.required, Validators.email]]
				, UseForTaskReminder: false
			};
		}

		private initAddSmsFormGroup() {
			return {
				SmsNumber: ['', [Validators.required]]
				, SpId: ['', [Validators.required]]
				, UseForTaskReminder: false
			};
		}

		private resetAddEmailFormGroup() {
			this.addEmailFG.reset({
				Email: ''
				, UseForTaskReminder: false
			});
		}

		private resetAddSmsFormGroup() {
			this.addSmsFG.reset({
				SmsNumber: ''
				, SpId: ''
				, UseForTaskReminder: false
			});
		}

	// #endregion
}
