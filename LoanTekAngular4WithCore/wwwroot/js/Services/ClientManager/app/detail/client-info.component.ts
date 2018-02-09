import { Component, EventEmitter, Input, Output, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { CommonMethodsService, IState, SimpleModalComponent, TOASTR_TOKEN, LODASH_TOKEN, customEmailValidator, ILoggedInUserInfo } from 'ltCommon/index';
import { ClientService, IClient, IClientUser, ISelectOption, IClientChange/*, ILoggedInUserInfo*/, IClientSaveModel } from './../shared/index';

@Component({
	selector: 'scm-client-info'
	, templateUrl: './client-info.component.html'
	, styles: [`
		.wrapClientChangeCell {
			text-overflow: ellipsis;
			overflow: hidden;
			max-width: 400px;
		}
		.clientChangesTable {
			max-height: 300px;
			overflow: auto;
		}
	`]
})
export class ClientInfoCompmonent implements OnInit {
	@Input() client: IClient;
	@Input() loggedInUserInfo: ILoggedInUserInfo;
	@Output() updateClient = new EventEmitter<IClient>();
	states: IState[];
	reps: IClientUser[];
	datePickerConfig: Partial<BsDatepickerConfig>;

	// Sales Rep
	isSalesRepBtnDisabled: boolean = false;

	// Customer Service Rep
	isCustServeRepBtnDisabled: boolean = false;

	// Contact
	clientUsers: IClientUser[];
	initialContact: IClientUser;
	changeContactFG: FormGroup;
	showContactChange: boolean = false;
	showRmAdminRoleCheckbox: boolean = false;
	isChangeContactBtnDisabled: boolean = false;

	// License Renewal Date
	changeLicenseRenewalDateFG: FormGroup;
	showRenewalDateChange: boolean = false;
	isLicenseRenewBtnDisabled: boolean = false;

	// Billing Frequency
	changeBillingFrequencyFG: FormGroup;
	billingFrequencyOptions: ISelectOption[];
	isBillFreqBtnDisabled: boolean = false;

	// Save Client
	scmClientInfoFG: FormGroup;
	isSaveBtnDisabled: boolean = false;

	// Client Changes List
	clientChanges: IClientChange[];

	constructor(private formBuilder: FormBuilder, private clientService: ClientService, private cm: CommonMethodsService, @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region Init

		ngOnInit() {
			// window.console && console.log('cI onInit');
			this.scmClientInfoFG = this.formBuilder.group(this.initClientInfoForm());
			this.changeContactFG = this.formBuilder.group(this.initContactForm());
			this.changeLicenseRenewalDateFG = this.formBuilder.group(this.initRenewalLicenseForm());
			this.changeBillingFrequencyFG = this.formBuilder.group(this.initBillingFrequencyForm());

			if (this.client) {
				this.scmClientInfoFG.patchValue(this.client);
				this.NewBillingFrequency.patchValue(this.client.BillingFrequency);
				this.initialContact = { UserId: this.client.ContactUserId, User: this.client.Contact };

				this.updateClientChanges(this.client.ClientId);
			}

			if (this.loggedInUserInfo.IsRole && this.loggedInUserInfo.IsRole.LoanTekAdmin) {
				this.clientService.getReps().then(repList => {
					this.reps = repList;
				}).catch((error: Response) => {
					window.console && console.error('ERROR:', error);
					this.toastr.error('Unable to get Rep List', 'Error:');
				});
			}

			this.clientService.getClientUsers(this.client.ClientId).then(clientUserList => {
				this.clientUsers = clientUserList;
			}).catch((error: Response) => {
				window.console && console.error('ERROR:', error);
				this.toastr.error('Unable to get Client Users List', 'Error:');
			});

			this.clientService.getBillingFrequencyOptions().then(bfOptions => {
				this.billingFrequencyOptions = bfOptions.map(bfo => {
					bfo.Value = +bfo.Value
					return bfo;
				});
			})

			this.states = this.cm.US_States();

			this.datePickerConfig = { containerClass: 'theme-dark-blue', showWeekNumbers: false };
		}

		get	SalesRep() { return this.scmClientInfoFG.get('SalesRep'); }
		get	CustomerServiceRep() { return this.scmClientInfoFG.get('CustomerServiceRep'); }

		get	Company() { return this.scmClientInfoFG.get('Company'); }
		get Address() { return this.scmClientInfoFG.get('Address'); }
		get City() { return this.scmClientInfoFG.get('City'); }
		get State() { return this.scmClientInfoFG.get('State'); }
		get Zip() { return this.scmClientInfoFG.get('Zip'); }
		get Email() { return this.scmClientInfoFG.get('Email'); }
		get Alternate_Email() { return this.scmClientInfoFG.get('Alternate_Email'); }
		get LicenseRenewaldate() { return this.scmClientInfoFG.get('LicenseRenewaldate'); }
		get NationalLender() { return this.scmClientInfoFG.get('NationalLender'); }
		get BypassCreditCardPayment() { return this.scmClientInfoFG.get('BypassCreditCardPayment'); }
		get ResetDailyLeadQuota() { return this.scmClientInfoFG.get('ResetDailyLeadQuota'); }
		get ChangeNotes() { return this.scmClientInfoFG.get('ChangeNotes'); }

		get NewContactUserId() { return this.changeContactFG.get('NewContactUserId'); }
		get RemoveCurrentUserFromAdminRole() { return this.changeContactFG.get('RemoveCurrentUserFromAdminRole'); }

		get LRDate() { return this.changeLicenseRenewalDateFG.get('LRDate'); }
		get LRReason() { return this.changeLicenseRenewalDateFG.get('LRReason'); }

		get NewBillingFrequency() { return this.changeBillingFrequencyFG.get('NewBillingFrequency'); }

	// #endregion

	// #region Update Info Methods

		// Sales Rep
		updateSalesRep() {
			this.isSalesRepBtnDisabled = true;
			var selectedSalesRep: IClientUser = this.reps.find(rep => rep.UserId === +this.SalesRep.value) || { UserId: 0, User: 'Unknown', Active: false };
			this.clientService.changeSalesRep({ ClientId: this.client.ClientId, SalesRepUserId: selectedSalesRep.UserId }).then(isSalesRepUpdated => {
				this.isSalesRepBtnDisabled = false;
				this.client.SalesRep = selectedSalesRep.UserId;
				this.client.SalesRepName = selectedSalesRep.User;
				this.toastr.success('Sales Rep Updated');
			}).catch((error: Response) => {
				window.console && console.error('Error', error);
				this.isSalesRepBtnDisabled = false;
				this.toastr.error('Problem updating Sales Rep', 'Error');
			});
		}

		updateClientChanges(clientId: number) {
			this.clientService.getClientChanges(clientId).then(cChanges => {
				this.clientChanges = cChanges.map(clientChange => {
					clientChange.Note = clientChange.Note.replace(/,/g, ', ');
					clientChange.WhatChanged = clientChange.WhatChanged.replace(/,/g, ', ');
					return clientChange;
				});
			}).catch((error: Response) => {
				window.console && console.error('Error with getClientChanges', error);
			});
		}

		// Customer Service Rep
		updateCustomerServiceRep() {
			this.isCustServeRepBtnDisabled = true;
			var selectedCustServeRep: IClientUser = this.reps.find(rep => rep.UserId === +this.CustomerServiceRep.value) || { UserId: 0, User: 'Unknown', Active: false };
			this.clientService.changeCustomerServiceRep({ ClientId: this.client.ClientId, CustomerServiceRepUserId: selectedCustServeRep.UserId }).then(isCustServeRepUpdated => {
				this.isCustServeRepBtnDisabled = false;
				this.client.CustomerServiceRep = selectedCustServeRep.UserId;
				this.client.CustomerServiceRepName = selectedCustServeRep.User;
				this.toastr.success('Customer Service Rep Updated');
			}).catch((error: Response) => {
				window.console && console.error('Error', error);
				this.isCustServeRepBtnDisabled = false;
				this.toastr.error('Problem updating Customer Service Rep', 'Error');
			});
		}

		// Contact
		displayContactChangeForm() {
			this.showContactChange = true;
			this.isChangeContactBtnDisabled = false;
			this.showRmAdminRoleCheckbox = false;
			this.changeContactFG.reset({ NewContactUserId: this.client.ContactUserId, RemoveCurrentUserFromAdminRole: false });
		}

		hideContactChange() {
			this.showContactChange = false;
			this.showRmAdminRoleCheckbox = false;
			this.isChangeContactBtnDisabled = false;
			this.changeContactFG.reset();
		}

		contactChange() {
			if (+this.NewContactUserId.value !== this.initialContact.UserId) {
				this.showRmAdminRoleCheckbox = true;
			} else {
				this.showRmAdminRoleCheckbox = false;
				this.RemoveCurrentUserFromAdminRole.setValue(false);
			}
		}

		updateContact(e: Event) {
			e.preventDefault();
			e.stopPropagation();
			this.isChangeContactBtnDisabled = true;

			if (this.changeContactFG.invalid) {
				this.isChangeContactBtnDisabled = false;
			} else {
				var selectedContact: IClientUser = this.clientUsers.find(cUser => cUser.UserId === +this.NewContactUserId.value) || { UserId: 0, User: 'Unknown' };

				if (selectedContact.UserId === this.initialContact.UserId) {
					// Contact not changed... just close
					this.hideContactChange();
				} else {
					let primaryContactModel = {
						ClientId: this.client.ClientId
						, NewUserId: +this.NewContactUserId.value
						, RemoveCurrentUserFromAdminRole: this.RemoveCurrentUserFromAdminRole.value
					};
					this.clientService.changePrimaryContact(primaryContactModel).then(isContactUpdate => {
						this.client.Contact = selectedContact.User;
						this.client.ContactUserId = selectedContact.UserId;
						this.initialContact = selectedContact;
						this.hideContactChange();
						this.updateClient.emit(this.client);
						this.toastr.success('Primary Contact Updated');
					}).catch((error: Response) => {
						window.console && console.error('updateContact Error', error);
						this.isChangeContactBtnDisabled = false;
						this.toastr.error('Could not update Primary Contact', 'Error');
					});
				}
			}
		}

		// Renewal Date
		displayRenewalDateChangeForm() {
			this.showRenewalDateChange = true;
			this.isLicenseRenewBtnDisabled = false;
			let lDate: Date;

			// Must convert string to Date for Kendo Datepicker
			if (this.client.LicenseRenewaldate && this._.isDate(new Date(<string>this.client.LicenseRenewaldate))) {
				lDate = new Date(<string>this.client.LicenseRenewaldate);
			} else {
				lDate = null;
			}
			this.changeLicenseRenewalDateFG.reset({ LRDate: lDate, LRReason: '' });
		}

		hideRenewalDateChange() {
			this.showRenewalDateChange = false;
			this.changeLicenseRenewalDateFG.reset();
		}

		updateRenewalDate(e: Event) {
			this.isLicenseRenewBtnDisabled = true;
			e.preventDefault();
			e.stopPropagation();
			if (this.changeLicenseRenewalDateFG.invalid) {
				this.isLicenseRenewBtnDisabled = false;
				this.LRDate.markAsTouched();
				this.LRReason.markAsTouched();
			} else {
				this.clientService.changeRenewalDate({ ClientId: this.client.ClientId, ReasonForChange: this.LRReason.value, RenewalDate: this.LRDate.value }).then(isRenewalDateUpdated => {
					this.isLicenseRenewBtnDisabled = false;
					this.LicenseRenewaldate.setValue(this.LRDate.value);
					this.client.LicenseRenewaldate = this.LRDate.value;
					this.hideRenewalDateChange();
					this.toastr.success('Updated License Renewal Date');
					// window.console && console.log('this.scmClientInfoFG.value', this.scmClientInfoFG.value);
				}).catch((error: Response) => {
					window.console && console.error('updateRenewalDate Error:', error);
					this.isLicenseRenewBtnDisabled = false;
					this.toastr.error('Could not update License Renewal Date', 'Error');
				});
			}
		}

		// Billing Frequency
		updateBillingFrequency() {
			this.isBillFreqBtnDisabled = true;
			this.clientService.changeBillingFrequency({ ClientId: this.client.ClientId, BillingFrequency: +this.NewBillingFrequency.value }).then(isBillingFreqUpdated => {
				this.isBillFreqBtnDisabled = false;
				this.client.BillingFrequency = +this.NewBillingFrequency.value;
				this.toastr.success('Updated Billing Frequency');
			}).catch((error: Response) => {
				window.console && console.error('updateBillingFrequency Error:', error);
				this.isBillFreqBtnDisabled = false;
				this.toastr.error('Could not update Billing Frequency', 'Error');
			});
		}

		// Client
		updateClientInfo() {
			this.isSaveBtnDisabled = true;
			if (this.scmClientInfoFG.invalid) {
				this.Company.markAsTouched();
				this.Address.markAsTouched();
				this.City.markAsTouched();
				this.State.markAsTouched();
				this.Zip.markAsTouched();
				this.Email.markAsTouched();
				this.Alternate_Email.markAsTouched();
				this.ChangeNotes.markAsTouched();
				this.isSaveBtnDisabled = false;
			} else {

				// Copy client and modify with new values
				let saveClient: IClient = this._.cloneDeep(this.client);
				this._.assign(saveClient, this.scmClientInfoFG.value);
				delete saveClient['ChangeNotes'];

				var saveModel: IClientSaveModel = {
					Client: saveClient
					, ChangeNotes: this.ChangeNotes.value
				};

				this.clientService.save(saveModel).then(isSaved => {
					// Update client with new values
					this._.assign(this.client, saveClient);

					// Emit changes to be picked up by list
					this.updateClient.emit(this.client);

					// Show success message
					this.toastr.success('Updated Client');
					this.isSaveBtnDisabled = false;

					// Clear Change Notes
					this.ChangeNotes.reset();

					// Update Changes
					this.updateClientChanges(this.client.ClientId);
				}).catch((error: Response) => {
					window.console && console.error('client Save Error:', error);
					this.isSaveBtnDisabled = false;
					this.toastr.error('Could not save the Client', 'Error');
				});
			}
		}

	// #endregion

	// #region Shared Methods

		isInvalidDirtyTouched(control: AbstractControl) {
			return control.invalid && (control.dirty || control.touched);
		}

		private initContactForm() {
			return {
				NewContactUserId: <number>null
				, RemoveCurrentUserFromAdminRole: false
			};
		}

		private initRenewalLicenseForm() {
			return {
				LRDate: [<Date|string>new Date(), Validators.required]
				, LRReason: ['', Validators.required]
			};
		}

		private initBillingFrequencyForm() {
			return {
				NewBillingFrequency: <number>null
			};
		}

		private initClientInfoForm() {
			return {
				SalesRep: ''
				, CustomerServiceRep: ''
				, Company: ['', Validators.required]
				, Address: ['', Validators.required]
				, City: ['', Validators.required]
				, State: ['', Validators.required]
				, Zip: ['', Validators.required]
				, Url: ''
				, Phone: ''
				, Fax: ''
				, CompanyNmls: ''
				, Email: ['', [Validators.required, Validators.email]]
				, Alternate_Email: ['', customEmailValidator]
				, LicenseRenewaldate: <Date|string>null
				, NationalLender: false
				, BypassCreditCardPayment: false
				, ResetDailyLeadQuota: false
				, ChangeNotes: ['', Validators.required]
			};
		}

	// #endregion
}
