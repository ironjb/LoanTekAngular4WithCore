import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IState, CommonMethodsService, TOASTR_TOKEN, LODASH_TOKEN } from 'ltCommon/index';

import { ClientService, IClient, ICreditCardModel, ISelectOption } from './../shared/index';

@Component({
	selector: 'scm-creditcard-edit'
	, templateUrl: './creditcard-edit.component.html'
})
export class CreditCardEditCompmonent implements OnInit {
	@Input() creditcard: ICreditCardModel;
	@Output() updatecard = new EventEmitter<ICreditCardModel>();
	@Output() closecard = new EventEmitter();
	cardEditFG: FormGroup;
	isDisabledSaveBtn: boolean = false;
	stateList: IState[];
	cardTypeList: ISelectOption[];
	monthsList: ISelectOption[];
	yearList: number[] = [];

	constructor(private formBuilder: FormBuilder, private clientService: ClientService, private cm: CommonMethodsService, @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region Init

		ngOnInit() {
			if (this.creditcard) {
				if (this.creditcard.CardId) {
					this.creditcard.Number = this.creditcard.DecryptedNumber;
				}

				this.cardEditFG = this.formBuilder.group(this.initCardForm(this.creditcard));
				this.stateList = this.cm.US_States();
				this.monthsList = this.cm.MonthList();

				this.clientService.getCreditCardTypes().then(cardTypeOpts => {
					this.cardTypeList = cardTypeOpts;
				}).catch(this.handleError);

				// Set yearList
				let startYear = new Date().getFullYear();
				let endYear = startYear + 10;
				startYear = (this.creditcard.ExpirationYear && this.creditcard.ExpirationYear < startYear) ? this.creditcard.ExpirationYear : startYear;
				for (var i = startYear; i <= endYear; i++) {
					this.yearList.push(i);
				}
			}
		}

		get	FirstName() { return this.cardEditFG.get('FirstName'); }
		get	LastName() { return this.cardEditFG.get('LastName'); }
		get	Address1() { return this.cardEditFG.get('Address1'); }
		get	Address2() { return this.cardEditFG.get('Address2'); }
		get	City() { return this.cardEditFG.get('City'); }
		get	State() { return this.cardEditFG.get('State'); }
		get	Zip() { return this.cardEditFG.get('Zip'); }
		get	Phone() { return this.cardEditFG.get('Phone'); }
		get	Number() { return this.cardEditFG.get('Number'); }
		get	CardType() { return this.cardEditFG.get('CardType'); }
		get	ExpirationMonth() { return this.cardEditFG.get('ExpirationMonth'); }
		get	ExpirationYear() { return this.cardEditFG.get('ExpirationYear'); }

	// #endregion

	// #region Main methods

		saveCreditCard() {
			if (this.cardEditFG.invalid) {
				this.FirstName.markAsTouched();
				this.LastName.markAsTouched();
				this.Address1.markAsTouched();
				this.Address2.markAsTouched();
				this.City.markAsTouched();
				this.State.markAsTouched();
				this.Zip.markAsTouched();
				this.Phone.markAsTouched();
				this.Number.markAsTouched();
				this.CardType.markAsTouched();
				this.ExpirationMonth.markAsTouched();
				this.ExpirationYear.markAsTouched();
			} else {
				this.isDisabledSaveBtn = true;

				let updatedCard = this._.clone(this.creditcard);
				this._.assign(updatedCard, this.cardEditFG.value, { CardStatus: 'Active' });
				updatedCard.ExpirationMonth = updatedCard.ExpirationMonth ? +updatedCard.ExpirationMonth : updatedCard.ExpirationMonth;
				updatedCard.ExpirationYear = updatedCard.ExpirationYear ? +updatedCard.ExpirationYear : updatedCard.ExpirationYear;
				delete updatedCard.Name;
				delete updatedCard.CVV;
				delete updatedCard.DecryptedNumber;

				this.clientService.saveCreditCard(updatedCard).then(isCardSaved => {
					this.isDisabledSaveBtn = false;
					this.updatecard.emit(this.creditcard);
					this.toastr.success('Credit Card Saved');
				}).catch((error: Response) => {
					this.isDisabledSaveBtn = false;
					this.toastr.error('There was a problem saving the credit card','Error');
					window.console && console.error('Error saving credit card:', error);
				});
			}
		}

		closeCardEdit() {
			this.closecard.emit();
		}

	// #endregion

	// #region Shared methods

		isInvalidDirtyTouched(control: AbstractControl) {
			return control && control.invalid && (control.dirty || control.touched);
		}

		private initCardForm(card: ICreditCardModel) {
			let cardFormGroup: any = {
				CardType: [card.CardType || '', Validators.required]
				, FirstName: [card.FirstName || '', Validators.required]
				, LastName: [card.LastName || '', Validators.required]
				, Address1: [card.Address1 || '', Validators.required]
				, Address2: card.Address2 || ''
				, City: [card.City || '', Validators.required]
				, State: [card.State || '', Validators.required]
				, Zip: [card.Zip || '', Validators.required]
				, Phone: card.Phone || ''
				, ExpirationMonth: [card.ExpirationMonth || '', Validators.required]
				, ExpirationYear: [card.ExpirationYear || '', Validators.required]
				, Number: [card.Number || '', Validators.required]
			};

			return cardFormGroup;
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
