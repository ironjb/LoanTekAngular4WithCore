import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { LODASH_TOKEN, IFilterTest, CommonMethodsService, ILoggedInUserInfo } from 'ltCommon/index';

import { IClientListInfo, IClientRow, IClient, IClientListFilter, ISelectOption, IClientUser, IBillingHistory
	, IClientChange, ISalesRepModel, ICustomerServiceRepModel, IPrimaryContactModel, IRenewalDateModel
	, IBillingFrequencyModel, IClientSaveModel, IBillHistoryInfo, IBillingHistorySort
	, IBillingHistoryFilter, IInvoicingModel, IInvoicingPrintModel, ICreditCardModel } from './client.model.d';

export enum BillingHistoryType { CreditCardPayments, AccountDebits }

@Injectable()
export class ClientService {
	clientListData: Promise<IClientRow[]>;
	loggedInUserInfo: Promise<ILoggedInUserInfo>;
	billHistoryCreditCardList: Promise<IBillingHistory[]>;
	billHistoryDebitsList: Promise<IBillingHistory[]>;

	constructor(private http: Http, private cm: CommonMethodsService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region GET methods

		getClient(clientId: number): Promise<IClient> {
			return this.getRequest<IClient>(`/Services/ClientManager/GetClient/${clientId}`);
		}

		getAllClients(): Promise<IClientRow[]> {
			return this.getRequest<IClientRow[]>('/Services/ClientManager/GetAllClients');
		}

		initLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
			if (!this.loggedInUserInfo) {
				this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			}

			return this.loggedInUserInfo;
		}

		getFilteredClientList(currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IClientListFilter): Promise<IClientListInfo> {
			this.initLoggedInUserInfo();

			if (!this.clientListData) {
				this.clientListData = this.getAllClients();
			}

			return this.loggedInUserInfo.then((userInfo: ILoggedInUserInfo) => {
				return this.clientListData.then((clientList: IClientRow[]) => {
					// Copy clientList so we don't edit the original
					var sortList: IClientRow[] = clientList.slice();

					// Sorting
					if (sortBy) {
						sortList = sortList.sort(this.sortFn<IClientRow>(sortBy, reverse));
					} else {
						// If not sorting, puts the logged in active client first
						let currentClientIndex = this._.findIndex(sortList, { ClientId: userInfo.ActiveClientId });

						if (currentClientIndex !== -1) {
							let currentClientRow = sortList.splice(currentClientIndex, 1)[0];
							sortList.unshift(currentClientRow);
						}

					}

					// Filtering
					if (filter) {
						sortList = sortList.filter(c => {
							var containsMatchArray: IFilterTest[] = [
								{ filter : filter.companyFilter, value: c.Company }
								, { filter: filter.contactFilter, value: c.Contact }
								, { filter: filter.phoneFilter, value: c.Phone, type: 'fuzzy' }
								, { filter: filter.emailFilter, value: c.Email }
								, { filter: filter.cityFilter, value: c.City }
								, { filter: filter.stateFilter, value: c.State }
								, { filter: filter.statusFilter, value: c.Status }
							];

							return this.cm.filterFn(containsMatchArray);
						});
					}

					var sliceStart = (currentPage-1)*pageSize;
					var sliceEnd = sliceStart + pageSize;

					return new Promise<IClientListInfo>(resolve => {
						var cListInfo: IClientListInfo = {
							clientCount: sortList.length
							, pageSize: pageSize
							, currentPage: currentPage
							, clientList: sortList.slice(sliceStart, sliceEnd)
							, loggedInUserInfo: userInfo
						};
						setTimeout(() => {
							resolve(cListInfo as IClientListInfo);
						}, 100);
					});
				});
			});
		}

		getReps(): Promise<IClientUser[]> {
			return this.getRequest<IClientUser[]>('/Services/ClientManager/GetReps');
		}

		getClientUsers(clientId: number): Promise<IClientUser[]> {
			return this.getRequest<IClientUser[]>(`/Services/ClientManager/GetClientUsers/${clientId}`);
		}

		getBillingFrequencyOptions(): Promise<ISelectOption[]> {
			return this.getRequest<ISelectOption[]>('/Services/ClientManager/GetBillingFrequencyOptions');
		}

		getClientChanges(clientId: number): Promise<IClientChange[]> {
			return this.getRequest<IClientChange[]>(`/Services/ClientManager/GetClientChanges/${clientId}`);
		}

		getBillingHistory(type: BillingHistoryType, clientId: number): Promise<IBillingHistory[]> {
			let getUrl = `/Services/ClientManager/GetCreditCardBillingHistory/${clientId}`;
			if (type === BillingHistoryType.AccountDebits) {
				getUrl = `/Services/ClientManager/GetAccountDebitsBillingHistory/${clientId}`;
			}

			return this.getRequest<IBillingHistory[]>(getUrl);
		}

		getFilteredBillingHistory(type: BillingHistoryType, clientId: number, currentPage: number, pageSize: number, sortBy?: IBillingHistorySort, reverse?: boolean, filter?: IBillingHistoryFilter, resetInfo?: boolean): Promise<IBillHistoryInfo> {
			if (type === BillingHistoryType.AccountDebits) {
				if (resetInfo) {
					this.billHistoryDebitsList = null;
				}

				if (!this.billHistoryDebitsList) {
					this.billHistoryDebitsList = this.getAccountDebitsBillingHistory(clientId);
				}

				return this.billHistoryDebitsList.then(this.filteredBillingHistory(currentPage, pageSize, sortBy, reverse, filter));
			} else {
				if (resetInfo) {
					this.billHistoryCreditCardList = null;
				}

				if (!this.billHistoryCreditCardList) {
					this.billHistoryCreditCardList = this.getCreditCardBillingHistory(clientId);
				}

				return this.billHistoryCreditCardList.then(this.filteredBillingHistory(currentPage, pageSize, sortBy, reverse, filter));
			}
		}

		clearBillingHistory() {
			this.billHistoryCreditCardList = null;
			this.billHistoryDebitsList = null;
		}

		getCreditCardBillingHistory(clientId: number): Promise<IBillingHistory[]> {
			return this.getRequest<IBillingHistory[]>(`/Services/ClientManager/GetCreditCardBillingHistory/${clientId}`);
		}

		getAccountDebitsBillingHistory(clientId: number): Promise<IBillingHistory[]> {
			return this.getRequest<IBillingHistory[]>(`/Services/ClientManager/GetAccountDebitsBillingHistory/${clientId}`);
		}

		getCreditCardTypes(): Promise<ISelectOption[]> {
			return this.getRequest<ISelectOption[]>('/Services/ClientManager/GetCreditCardTypes');
		}

		getCardStatus(): Promise<ISelectOption[]> {
			return this.getRequest<ISelectOption[]>('/Services/ClientManager/GetCardStatus');
		}

		getClientCreditCards(clientId: number): Promise<ICreditCardModel[]> {
			return this.getRequest<ICreditCardModel[]>(`/Services/ClientManager/GetClientCreditCards/${clientId}`);
		}

	// #endregion

	// #region POST methods

		changeSalesRep(salesRepModel: ISalesRepModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/ChangeSalesRep', salesRepModel);
		}

		changeCustomerServiceRep(customerServiceRepModel: ICustomerServiceRepModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/ChangeCustomerServiceRep', customerServiceRepModel);
		}

		changePrimaryContact(primaryContactModel: IPrimaryContactModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/ChangePrimaryContact', primaryContactModel);
		}

		changeRenewalDate(renewalDateModel: IRenewalDateModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/ChangeRenewalDate', renewalDateModel);
		}

		changeBillingFrequency(billingFrequencyModel: IBillingFrequencyModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/ChangeBillingFrequency', billingFrequencyModel);
		}

		emailInvoice(invoiceModel: IInvoicingModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/EmailInvoice', invoiceModel);
		}

		getInvoiceForPrinting(invoiceModel: IInvoicingModel): Promise<IInvoicingPrintModel> {
			return this.postRequest<IInvoicingPrintModel>('/Services/ClientManager/GetInvoiceForPrinting', invoiceModel);
		}

		save(saveModel: IClientSaveModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/Save', saveModel);
		}

		saveCreditCard(saveCreditCardModel: ICreditCardModel): Promise<boolean|string> {
			return this.postRequest<boolean|string>('/Services/ClientManager/SaveCreditCard', saveCreditCardModel);
		}

	// #endregion

	// #region Shared methods

		cardNumberFormat(cardNumber: number|string) {
			cardNumber = cardNumber.toString();
			return '*************************'.slice(4-cardNumber.length) + cardNumber.slice(-4);
		}

		private getRequest<T>(getUrl: string): Promise<T> {
			return this.http.get(getUrl).toPromise().then((response: Response) => {
				return response.json() as T;
			});
		}

		private postRequest<T>(postUrl: string, model: any): Promise<T> {
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			return this.http.post(postUrl, model, options).toPromise().then((response: Response) => {
				return response.json() as T;
			});
		}

		private sortFn<T>(sortBy: string, reverse?: boolean) {
			return (a: T, b: T) => {
				var sA = a[sortBy], sB = b[sortBy];
				if(typeof sA === 'string' && typeof sB === 'string') {
					return +(( (sA.toLowerCase() < sB.toLowerCase()) ? -1 : ((sA.toLowerCase() > sB.toLowerCase()) ? 1 : 0) ) * [-1,1][+!reverse]);
				} else if (typeof sA === 'number' && typeof sB === 'number') {
					return (sA - sB) * [-1,1][+!reverse];
				}

				return 0;
			};
		}

		private filteredBillingHistory(currentPage: number, pageSize: number, sortBy?: IBillingHistorySort, reverse?: boolean, filter?: IBillingHistoryFilter) {
			return (billHist: IBillingHistory[]) => {
				let bhSortList: IBillingHistory[] = billHist.slice();

				// Sorting
				if (sortBy) {
					bhSortList = bhSortList.sort(this.sortFn<IBillingHistory>(sortBy, reverse));
				}

				// Filter
				if (filter) {
					bhSortList = bhSortList.filter(acItem => {
						let ccFilterTest: IFilterTest[] = [
							{ filter: filter.paymentCommentsFilter, value: acItem.PaymentComments }
							, { filter: filter.paymentTypeFilter, value: acItem.PaymentType }
							, { filter: filter.paymentStatusFilter, value: acItem.PaymentStatus }
						];

						return this.cm.filterFn(ccFilterTest);
					});
				}

				let sliceStart = (currentPage-1)*pageSize;
				let sliceEnd = sliceStart + pageSize;

				return new Promise<IBillHistoryInfo>(resolve => {
					let histInfo: IBillHistoryInfo = {
						billHistoryList: bhSortList.slice(sliceStart, sliceEnd)
						, billHistoryCount: bhSortList.length
						, currentPage: currentPage
						, pageSize: pageSize
					};
					setTimeout(() => {
						resolve(histInfo as IBillHistoryInfo);
					}, 100);
				});
			};
		}

	// #endregion
}


// Radom data by https://www.json-generator.com
/*
[
	'{{repeat(96)}}',
	{
		ClientId: '{{integer(10,9999)}}',
		Company: '{{company().toUpperCase()}}',
		Contact: '{{firstName()}} {{surname()}}',
		Phone: '{{phone()}}',
		Fax: '{{phone()}}',
		Email: '{{email()}}',
		Address: '{{integer(100, 999)}} {{street()}}',
		City: '{{city()}}',
		State: '{{state(true)}}',
		Zip: '{{integer(10000, 99999)}}',
		Status: '{{random("Active", "Active", "InActive")}}',
		Created: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		LastEdit: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		IpAddress: '',
		UserId: '{{objectId()}}',
		Url: 'www.{{company()}}.com',
		Alternate_Email: '{{random("",email())}}',
		LicenseRenewaldate: '{{date(new Date(), new Date().setFullYear(2050), "YYYY-MM-ddThh:mm:ss")}}',
		BillingFrequency: '{{random(15,30,40,60)}}',
		CompanyNmls: '{{integer(1000000,9999999)}}',
		NationalLender: '{{bool()}}',
		DropDownDisplay: '{{firstName()}} {{surname()}}',
		SalesRepName: '{{random("Unknown", "Adam Stein", "Eric Tj", "Brandon Strong", "Cathy King", "Kenny Lee", "Joe Bell")}}',
		CustomerServiceRepName: '{{random("Unknown", "Adam Stein", "Eric Tj", "Brandon Strong", "Cathy King", "Kenny Lee", "Joe Bell")}}',
		PricingUserId: '{{integer(10,9999)}}'
	}
]

[
	'{{repeat(54)}}',
	{
		First: '{{firstName()}}',
		Last: '{{surname()}}',
		Phone: '{{phone()}}',
		Email: '{{email()}}'
	}
]
 */