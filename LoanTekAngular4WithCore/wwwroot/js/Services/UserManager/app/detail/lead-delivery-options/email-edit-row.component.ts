import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, /*AbstractControl,*/ Validators } from '@angular/forms';

import { TOASTR_TOKEN, LODASH_TOKEN, CommonMethodsService } from 'ltCommon/index';
import { UserService, IUser, IDeliverByEmailOption } from './../../shared/index';

@Component({
	selector: 'tr[sum-email-edit-row]'
	, templateUrl: './email-edit-row.component.html'
})
export class LDO_EmailEditRowCompmonent implements OnInit {
	@Input() emailOpt: IDeliverByEmailOption;
	@Output() deleteEmail = new EventEmitter<IDeliverByEmailOption>();
	editEmailFG: FormGroup;
	showEditEmail: boolean = false;
	isSaveBtnDisabled: boolean = false;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private cm: CommonMethodsService, @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region Init

		ngOnInit() {
			if (this.emailOpt) {
				this.editEmailFG = this.formBuilder.group(this.initEditEmailFormGroup());
			}
		}

		get Email() { return this.editEmailFG.get('Email'); }

	// #endregion

	// #region Main

		showEditEmailForm() {
			this.showEditEmail = true;
			this.resetEditEmailFormGroup();
		}

		confirmDeleteEmail() {
			this.deleteEmail.emit(this.emailOpt);
		}

		closeEditEmail() {
			this.showEditEmail = false;
			this.resetEditEmailFormGroup();
		}

		saveEmail() {
			this.isSaveBtnDisabled = true;
			// window.console && console.log('saveEmail', this.editEmailFG.value);

			if (this.editEmailFG.invalid) {
				this.Email.markAsTouched();
				this.Email.markAsDirty();
				this.isSaveBtnDisabled = false;
			} else {
				// make copy and modify with new values
				let dbEmail: IDeliverByEmailOption = this._.clone(this.emailOpt);
				this._.assign(dbEmail, this.editEmailFG.value);
				// window.console && console.log('dbEmail', dbEmail);

				this.userService.saveDeliverByEmail(dbEmail).then(isSaved => {
					// Update emailOpt with new values
					this._.assign(this.emailOpt, dbEmail);
					// window.console && console.log('after assign', this.emailOpt, dbEmail);

					this.isSaveBtnDisabled = false;
					this.showEditEmail = false;
					this.toastr.success('Deliver By Email saved');
				}).catch((error: Response) => {
					window.console && console.error('Could not save Deliver By Email', error);
					this.isSaveBtnDisabled = false;
					this.toastr.error('Could not save Deliver By Email', 'Error');
				});
			}
		}

	// #endregion

	// #region Shared methods

		private initEditEmailFormGroup() {
			return {
				Email: ['', [Validators.required, Validators.email]]
				, UseForTaskReminder: false
			};
		}

		private resetEditEmailFormGroup() {
			this.editEmailFG.reset({
				Email: this.emailOpt.Email
				, UseForTaskReminder: this.emailOpt.UseForTaskReminder
			});
		}

	// #endregion
}
