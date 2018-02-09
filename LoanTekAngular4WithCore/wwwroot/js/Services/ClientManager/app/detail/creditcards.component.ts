import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ClientService, IClient, ICreditCardModel } from './../shared/index';

@Component({
	selector: 'scm-creditcards'
	, templateUrl: './creditcards.component.html'
	, styles: [`
		.credit-card-link { cursor: pointer; }
		.credit-card-link:hover { border-color: #000000; }
	`]
})
export class CreditCardsCompmonent implements OnInit {
	@Input() client: IClient;
	clientCreditCards: ICreditCardModel[];
	activeCards: ICreditCardModel[];
	inactiveCards: ICreditCardModel[];
	currentCard: ICreditCardModel;
	showEditCard: boolean = false;

	constructor(private clientService: ClientService) {}

	// #region Init

		ngOnInit() {
			if (this.client) {
				this.getCards();
			}
		}

	// #endregion

	// #region Main methods

		showUpdateCard(card: ICreditCardModel) {
			if (card) {
				this.currentCard = card;
			} else {
				this.currentCard = {
					ClientId: this.client.ClientId
					, Country: 'US'
				};
			}

			this.showEditCard = true;
		}

		closeCardEdit() {
			this.currentCard = null;
			this.showEditCard = false;
		}

		updateCard(card: ICreditCardModel) {
			this.showEditCard = false;
			this.currentCard = null;
			this.getCards();
		}

	// #endregion

	// #region Shared methods

		private getCards(callback?: Function) {
			this.clientService.getClientCreditCards(this.client.ClientId).then((clientCards: ICreditCardModel[]) => {
				let cardList = clientCards.map((ccModel => {
					delete ccModel['LoanTekUser'];
					return ccModel;
				})).sort((a,b) => {
					let sA = a.CardStatus.toLowerCase();
					let sB = b.CardStatus.toLowerCase();
					return +(( (sA.toLowerCase() < sB.toLowerCase()) ? -1 : ((sA.toLowerCase() > sB.toLowerCase()) ? 1 : 0) ));
				});

				this.clientCreditCards = cardList;
				this.activeCards = cardList.filter(c => {
					return c.CardStatus.toLowerCase() === 'active';
				});
				this.inactiveCards = cardList.filter(c => {
					return c.CardStatus.toLowerCase() !== 'active';
				});

				if (callback) {
					callback();
				}
			}).catch(this.handleError);
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
