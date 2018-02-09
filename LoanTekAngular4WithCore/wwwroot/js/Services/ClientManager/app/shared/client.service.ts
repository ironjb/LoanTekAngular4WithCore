import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { LODASH_TOKEN, IFilterTest, CommonMethodsService, ILoggedInUserInfo } from 'ltCommon/index';

import { IClientListInfo, IClientRow, IClient, IClientListFilter, ISelectOption, IClientUser, IBillingHistory
	, IClientChange, ISalesRepModel, ICustomerServiceRepModel, IPrimaryContactModel, IRenewalDateModel
	, IBillingFrequencyModel/*, ILoggedInUserInfo*/, IClientSaveModel, IBillHistoryInfo, IBillingHistorySort
	, IBillingHistoryFilter, /*IFilterTest, */IInvoicingModel, IInvoicingPrintModel, ICreditCardModel } from './client.model.d';

// enum BillingHistoryType { CreditCardPayments, AccountDebits }
export enum BillingHistoryType { CreditCardPayments, AccountDebits }

@Injectable()
export class ClientService {
	clientListData: Promise<IClientRow[]>;
	loggedInUserInfo: Promise<ILoggedInUserInfo>;
	billHistoryCreditCardList: Promise<IBillingHistory[]>;
	billHistoryDebitsList: Promise<IBillingHistory[]>;
	// static BillingHistoryType = { CreditCardPayments: 'CreditCardPayments', AccountDebits: 'AccountDebits' };
	// public static readonly BillingHistoryType = BillingHistoryType;

	constructor(private http: Http, private cm: CommonMethodsService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region GET methods

		getClient(clientId: number): Promise<IClient> {
			// let getClientUrl = `/Services/ClientManager/GetClient/${clientId}`;

			// return this.http.get(getClientUrl).toPromise().then((response: Response) => {
			// 	return response.json() as IClient;
			// });
			return this.getRequest<IClient>(`/Services/ClientManager/GetClient/${clientId}`);
		}

		getAllClients(): Promise<IClientRow[]> {
			// window.console && console.log('getAllClientList()... Going to get **ALL** the data.');
			// let getAllClientsUrl = '/Services/ClientManager/GetAllClients';
			// getAllClientsUrl = '/Areas/Services/Scripts/ClientManager/app/shared/fakeClientList.json';

			// return this.http.get(getAllClientsUrl).toPromise().then((response: Response) => {
			// 	return response.json() as IClientRow[];
			// 	// return new Promise<IClientRow[]>(resolve => {
			// 	// 	setTimeout(() => {
			// 	// 		resolve(response.json() as IClientRow[]);
			// 	// 	},1000);
			// 	// });
			// });
			return this.getRequest<IClientRow[]>('/Services/ClientManager/GetAllClients');
		}

		// getLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
		// 	return this.getRequest<ILoggedInUserInfo>('/Services/ClientManager/GetLoggedInUserInfo');
		// }

		initLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
			if (!this.loggedInUserInfo) {
				this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			}

			return this.loggedInUserInfo;
		}

		getFilteredClientList(currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IClientListFilter): Promise<IClientListInfo> {
			// if (!this.loggedInUserInfo) {
			// 	this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			// }
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
						// sortList = sortList.sort((a,b) => {
						// 	var sA = a[sortBy], sB = b[sortBy];
						// 	if(typeof sA === 'string' && typeof sB === 'string') {
						// 		return +(( (sA.toLowerCase() < sB.toLowerCase()) ? -1 : ((sA.toLowerCase() > sB.toLowerCase()) ? 1 : 0) ) * [-1,1][+!reverse]);
						// 	} else if (typeof sA === 'number' && typeof sB === 'number') {
						// 		return (sA - sB) * [-1,1][+!reverse];
						// 	}

						// 	return 0;
						// });
						sortList = sortList.sort(this.sortFn<IClientRow>(sortBy, reverse));
					} else {
						// If not sorting, puts the logged in active client first
						let currentClientIndex = this._.findIndex(sortList, { ClientId: userInfo.ActiveClientId });
						// window.console && console.log('currrentClientIndex', currentClientIndex);

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

							// for (var mi = containsMatchArray.length - 1; mi >= 0; mi--) {
							// 	let m = containsMatchArray[mi];
							// 	var rTest: boolean = RegExp(m.filter, 'i').test(m.test);
							// 	if (!rTest) {
							// 		return false;
							// 	}
							// }

							// return true;
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
							// window.console && console.log('cListInfo', cListInfo);
							resolve(cListInfo as IClientListInfo);
						}, 100);
					});
				});
			});
		}

		getReps(): Promise<IClientUser[]> {
			// let getRepsUrl = '/Services/ClientManager/GetReps';
			return this.getRequest<IClientUser[]>('/Services/ClientManager/GetReps');
		}

		getClientUsers(clientId: number): Promise<IClientUser[]> {
			// let getClientUsersUrl = `/Services/ClientManager/GetClientUsers/${clientId}`;
			return this.getRequest<IClientUser[]>(`/Services/ClientManager/GetClientUsers/${clientId}`);
		}

		getBillingFrequencyOptions(): Promise<ISelectOption[]> {
			// let getBillingFrequencyOptionsUrl = '/Services/ClientManager/GetBillingFrequencyOptions';
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
					// window.console && console.log('resetting billHistoryDebitsList');
					this.billHistoryDebitsList = null;
				}

				if (!this.billHistoryDebitsList) {
					this.billHistoryDebitsList = this.getAccountDebitsBillingHistory(clientId);
				}

				return this.billHistoryDebitsList.then(this.filteredBillingHistory(currentPage, pageSize, sortBy, reverse, filter));
			} else {
				if (resetInfo) {
					// window.console && console.log('resetting billHistoryCreditCardList');
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

		// getFilteredCreditCardBillingHistory(clientId: number, currentPage: number, pageSize: number, sortBy?: IBillingHistorySort, reverse?: boolean, filter?: IBillingHistoryFilter): Promise<IBillHistoryInfo> {
		// 	if (!this.billHistoryCreditCardList) {
		// 		this.billHistoryCreditCardList = this.getCreditCardBillingHistory(clientId);
		// 	}

		// 	return this.billHistoryCreditCardList.then(this.filteredBillingHistory(currentPage, pageSize, sortBy, reverse, filter));
		// }

		getAccountDebitsBillingHistory(clientId: number): Promise<IBillingHistory[]> {
			return this.getRequest<IBillingHistory[]>(`/Services/ClientManager/GetAccountDebitsBillingHistory/${clientId}`);
		}

		// getFilteredAccountDebitsBillingHistory(clientId: number, currentPage: number, pageSize: number, sortBy?: IBillingHistorySort, reverse?: boolean, filter?: IBillingHistoryFilter): Promise<IBillHistoryInfo> {
		// 	if (!this.billHistoryDebitsList) {
		// 		this.billHistoryDebitsList = this.getAccountDebitsBillingHistory(clientId);
		// 	}

		// 	return this.billHistoryDebitsList.then(this.filteredBillingHistory(currentPage, pageSize, sortBy, reverse, filter));
		// }

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

	// mergeClientIntoClientRow(client: IClient, clientRow: IClientRow) {
	// 	clientRow.City = client.City;
	// 	clientRow.Company = client.Company;
	// 	clientRow.Contact = client.Contact;
	// 	clientRow.Email = client.Email;
	// 	clientRow.Phone = client.Phone;
	// 	clientRow.State = client.State;
	// 	// clientRow.Status = client.Status;     // NEED to see about fixing this
	// }


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

		// private filterFn(filterTest: IFilterTest[]): boolean {
		// 	for (var fti = filterTest.length - 1; fti >= 0; fti--) {
		// 		let fItem = filterTest[fti];
		// 		let isMatch: boolean = RegExp(fItem.filter, 'i').test(fItem.test);
		// 		if (!isMatch) {
		// 			return false;
		// 		}
		// 	}

		// 	return true;
		// }

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

	// private fakeClientList = [{"ClientId":4095,"Company":"BLANET","Contact":"Faulkner Oneil","Phone":"(853) 488-3509","Email":"faulkneroneil@blanet.com","Address":"394 Newkirk Placez","City":"Summerfield","State":"OR","Zip":10278,"Status":"Active"},{"ClientId":4483,"Company":"ENJOLA","Contact":"Gonzales Morton","Phone":"(850) 448-2881","Email":"gonzalesmorton@enjola.com","Address":"932 Irving Street","City":"Kennedyville","State":"LA","Zip":38381,"Status":"Active"},{"ClientId":20,"Company":"SLOFAST","Contact":"Bean Mathews","Phone":"(868) 558-2694","Email":"beanmathews@slofast.com","Address":"557 Hunterfly Place","City":"Thomasville","State":"KY","Zip":56649,"Status":"Active"},{"ClientId":597,"Company":"ZOLAVO","Contact":"Buchanan Mayer","Phone":"(822) 474-3376","Email":"buchananmayer@zolavo.com","Address":"905 Cumberland Street","City":"Warren","State":"AZ","Zip":80639,"Status":"Active"},{"ClientId":871,"Company":"ZENTRY","Contact":"Stanton Jenkins","Phone":"(836) 586-2592","Email":"stantonjenkins@zentry.com","Address":"387 Maujer Street","City":"Marshall","State":"IN","Zip":37326,"Status":"Active"},{"ClientId":7345,"Company":"ROCKLOGIC","Contact":"Compton Rivers","Phone":"(822) 419-2241","Email":"comptonrivers@rocklogic.com","Address":"655 Nassau Street","City":"Nettie","State":"MH","Zip":26892,"Status":"Active"},{"ClientId":2619,"Company":"ATOMICA","Contact":"Cherry Le","Phone":"(824) 578-3747","Email":"cherryle@atomica.com","Address":"650 Bushwick Avenue","City":"Yonah","State":"NM","Zip":34345,"Status":"Active"},{"ClientId":6222,"Company":"ESSENSIA","Contact":"Mallory Best","Phone":"(805) 448-3328","Email":"mallorybest@essensia.com","Address":"438 Hampton Avenue","City":"Blairstown","State":"MO","Zip":63785,"Status":"Active"},{"ClientId":5025,"Company":"SHADEASE","Contact":"Marks Bird","Phone":"(858) 508-3318","Email":"marksbird@shadease.com","Address":"690 Stockton Street","City":"Vincent","State":"AR","Zip":91935,"Status":"Active"},{"ClientId":7571,"Company":"BUGSALL","Contact":"Hillary Cabrera","Phone":"(907) 557-3218","Email":"hillarycabrera@bugsall.com","Address":"577 Monaco Place","City":"Lodoga","State":"IA","Zip":64660,"Status":"Active"},{"ClientId":2246,"Company":"NETPLODE","Contact":"Alice Gould","Phone":"(982) 545-3864","Email":"alicegould@netplode.com","Address":"932 Fayette Street","City":"Hasty","State":"DC","Zip":89193,"Status":"Active"},{"ClientId":9804,"Company":"ROOFORIA","Contact":"Singleton Mcfadden","Phone":"(905) 572-3646","Email":"singletonmcfadden@rooforia.com","Address":"929 Clarkson Avenue","City":"Hobucken","State":"UT","Zip":76433,"Status":"Active"},{"ClientId":1297,"Company":"QUORDATE","Contact":"Salas Stevens","Phone":"(907) 525-2309","Email":"salasstevens@quordate.com","Address":"805 Emmons Avenue","City":"Soham","State":"SC","Zip":92250,"Status":"Active"},{"ClientId":676,"Company":"YURTURE","Contact":"Bass Ruiz","Phone":"(999) 516-2110","Email":"bassruiz@yurture.com","Address":"176 Nichols Avenue","City":"Healy","State":"TX","Zip":18833,"Status":"Active"},{"ClientId":6224,"Company":"PODUNK","Contact":"Avis Lane","Phone":"(950) 446-3738","Email":"avislane@podunk.com","Address":"220 Harkness Avenue","City":"Bynum","State":"VA","Zip":61085,"Status":"Active"},{"ClientId":1952,"Company":"GEEKMOSIS","Contact":"Wilson England","Phone":"(811) 433-3754","Email":"wilsonengland@geekmosis.com","Address":"824 Louise Terrace","City":"Terlingua","State":"NC","Zip":30473,"Status":"Active"},{"ClientId":2382,"Company":"UBERLUX","Contact":"Earnestine Hicks","Phone":"(883) 458-3676","Email":"earnestinehicks@uberlux.com","Address":"945 National Drive","City":"Albrightsville","State":"IL","Zip":22397,"Status":"Active"},{"ClientId":1922,"Company":"POOCHIES","Contact":"Hester Norton","Phone":"(830) 565-3955","Email":"hesternorton@poochies.com","Address":"504 Grant Avenue","City":"Elrama","State":"MT","Zip":32792,"Status":"Active"},{"ClientId":3308,"Company":"EMPIRICA","Contact":"Washington Beach","Phone":"(901) 420-2826","Email":"washingtonbeach@empirica.com","Address":"770 Kensington Walk","City":"Enlow","State":"NE","Zip":55302,"Status":"Active"},{"ClientId":6030,"Company":"INSURITY","Contact":"Renee Silva","Phone":"(849) 543-2586","Email":"reneesilva@insurity.com","Address":"632 Arlington Place","City":"Madrid","State":"HI","Zip":64359,"Status":"Active"},{"ClientId":3554,"Company":"VELOS","Contact":"Serrano Donaldson","Phone":"(835) 432-3108","Email":"serranodonaldson@velos.com","Address":"257 Woodpoint Road","City":"Yogaville","State":"SD","Zip":52302,"Status":"Active"},{"ClientId":60,"Company":"PLASMOX","Contact":"Hinton Brooks","Phone":"(937) 462-2799","Email":"hintonbrooks@plasmox.com","Address":"518 Kane Street","City":"Foxworth","State":"OK","Zip":62076,"Status":"Active"},{"ClientId":7805,"Company":"VERTIDE","Contact":"Clark Bennett","Phone":"(870) 492-2585","Email":"clarkbennett@vertide.com","Address":"819 Cumberland Walk","City":"Torboy","State":"MD","Zip":56469,"Status":"Active"},{"ClientId":5504,"Company":"STROZEN","Contact":"Jennifer Bradshaw","Phone":"(867) 541-3385","Email":"jenniferbradshaw@strozen.com","Address":"129 Rogers Avenue","City":"Murillo","State":"NY","Zip":58796,"Status":"Active"},{"ClientId":8678,"Company":"UNIWORLD","Contact":"Miller Greene","Phone":"(872) 510-2434","Email":"millergreene@uniworld.com","Address":"524 Stone Avenue","City":"Ruckersville","State":"ME","Zip":73322,"Status":"Active"},{"ClientId":3547,"Company":"WATERBABY","Contact":"Pauline Mclaughlin","Phone":"(827) 553-3106","Email":"paulinemclaughlin@waterbaby.com","Address":"432 Boerum Place","City":"Sunriver","State":"FM","Zip":18580,"Status":"Active"},{"ClientId":9177,"Company":"ECRAZE","Contact":"Hill Contreras","Phone":"(877) 463-2552","Email":"hillcontreras@ecraze.com","Address":"589 Rost Place","City":"Blanco","State":"MA","Zip":49499,"Status":"Active"},{"ClientId":4784,"Company":"OLYMPIX","Contact":"Montoya Maxwell","Phone":"(877) 493-2365","Email":"montoyamaxwell@olympix.com","Address":"242 Kent Street","City":"Bethany","State":"MS","Zip":35608,"Status":"Active"},{"ClientId":2640,"Company":"NEPTIDE","Contact":"Barrett Dean","Phone":"(853) 480-2992","Email":"barrettdean@neptide.com","Address":"465 Kensington Street","City":"Newry","State":"PW","Zip":31066,"Status":"Active"},{"ClientId":6224,"Company":"COGNICODE","Contact":"Bennett Valencia","Phone":"(885) 463-3700","Email":"bennettvalencia@cognicode.com","Address":"161 Neptune Court","City":"Yorklyn","State":"PR","Zip":64933,"Status":"Active"},{"ClientId":1784,"Company":"NSPIRE","Contact":"Angelia Glass","Phone":"(996) 537-3898","Email":"angeliaglass@nspire.com","Address":"116 Kane Place","City":"Baden","State":"AK","Zip":92647,"Status":"Active"},{"ClientId":1599,"Company":"GONKLE","Contact":"Sylvia Oneal","Phone":"(860) 534-3543","Email":"sylviaoneal@gonkle.com","Address":"502 Jerome Avenue","City":"Belleview","State":"ID","Zip":68867,"Status":"Active"},{"ClientId":3137,"Company":"ZENTURY","Contact":"Keller Gonzales","Phone":"(889) 576-2794","Email":"kellergonzales@zentury.com","Address":"789 Broadway ","City":"Temperanceville","State":"WV","Zip":57673,"Status":"Active"},{"ClientId":3838,"Company":"PROTODYNE","Contact":"Arlene Fox","Phone":"(821) 596-3372","Email":"arlenefox@protodyne.com","Address":"243 Taaffe Place","City":"Lacomb","State":"DE","Zip":57058,"Status":"Active"},{"ClientId":654,"Company":"BIOSPAN","Contact":"Gena Delaney","Phone":"(831) 425-3991","Email":"genadelaney@biospan.com","Address":"699 Sunnyside Avenue","City":"Grayhawk","State":"NJ","Zip":50463,"Status":"Active"},{"ClientId":7675,"Company":"XOGGLE","Contact":"Mcbride Mullen","Phone":"(881) 523-2834","Email":"mcbridemullen@xoggle.com","Address":"774 Milton Street","City":"Ribera","State":"MP","Zip":78739,"Status":"Active"},{"ClientId":867,"Company":"BLUEGRAIN","Contact":"Rivera Huff","Phone":"(963) 496-3615","Email":"riverahuff@bluegrain.com","Address":"697 Richmond Street","City":"Beyerville","State":"PA","Zip":72982,"Status":"Active"},{"ClientId":1662,"Company":"ELENTRIX","Contact":"Margie Bonner","Phone":"(990) 591-2627","Email":"margiebonner@elentrix.com","Address":"594 Ryder Street","City":"Holcombe","State":"CA","Zip":63936,"Status":"Active"},{"ClientId":3526,"Company":"ZERBINA","Contact":"Mathis Cobb","Phone":"(819) 554-3617","Email":"mathiscobb@zerbina.com","Address":"456 Goodwin Place","City":"Hickory","State":"GU","Zip":14618,"Status":"Active"},{"ClientId":133,"Company":"ZIORE","Contact":"Moreno Mccarthy","Phone":"(842) 479-2203","Email":"morenomccarthy@ziore.com","Address":"853 Boardwalk ","City":"Tilleda","State":"AS","Zip":75106,"Status":"Active"},{"ClientId":7449,"Company":"ZYTREK","Contact":"Dale Medina","Phone":"(941) 569-2968","Email":"dalemedina@zytrek.com","Address":"782 Eldert Street","City":"Roulette","State":"NH","Zip":76069,"Status":"Active"},{"ClientId":4539,"Company":"GEEKOLOGY","Contact":"Keith Bender","Phone":"(910) 442-2847","Email":"keithbender@geekology.com","Address":"568 Winthrop Street","City":"Kansas","State":"CT","Zip":11887,"Status":"Active"},{"ClientId":2373,"Company":"KOG","Contact":"Hutchinson Klein","Phone":"(872) 564-3381","Email":"hutchinsonklein@kog.com","Address":"778 Carroll Street","City":"Elfrida","State":"RI","Zip":59421,"Status":"Active"},{"ClientId":8804,"Company":"ZOLAR","Contact":"Ruiz Guerra","Phone":"(965) 419-2035","Email":"ruizguerra@zolar.com","Address":"758 Bush Street","City":"Dotsero","State":"AL","Zip":61875,"Status":"Active"},{"ClientId":7336,"Company":"HAIRPORT","Contact":"Tamera Shelton","Phone":"(969) 550-3574","Email":"tamerashelton@hairport.com","Address":"204 Coventry Road","City":"Herbster","State":"ND","Zip":34475,"Status":"Active"},{"ClientId":7869,"Company":"GEEKOLA","Contact":"Guerra Webster","Phone":"(930) 580-3982","Email":"guerrawebster@geekola.com","Address":"121 Wyckoff Street","City":"Fruitdale","State":"NV","Zip":11647,"Status":"Active"},{"ClientId":9207,"Company":"TELPOD","Contact":"Gillespie Hernandez","Phone":"(887) 477-2518","Email":"gillespiehernandez@telpod.com","Address":"991 Fleet Walk","City":"Onton","State":"MN","Zip":55788,"Status":"Active"},{"ClientId":6461,"Company":"ECLIPTO","Contact":"June Holden","Phone":"(829) 506-3506","Email":"juneholden@eclipto.com","Address":"704 Nevins Street","City":"Westboro","State":"TN","Zip":58293,"Status":"Active"},{"ClientId":6448,"Company":"EARGO","Contact":"Cash Gamble","Phone":"(891) 493-2034","Email":"cashgamble@eargo.com","Address":"511 Bridgewater Street","City":"Stewartville","State":"CO","Zip":50792,"Status":"Active"},{"ClientId":4480,"Company":"PEARLESEX","Contact":"Muriel Guzman","Phone":"(821) 542-3209","Email":"murielguzman@pearlesex.com","Address":"157 Lake Avenue","City":"Brogan","State":"VT","Zip":35289,"Status":"Active"},{"ClientId":7583,"Company":"LEXICONDO","Contact":"Salazar Woodard","Phone":"(833) 461-3412","Email":"salazarwoodard@lexicondo.com","Address":"571 Union Street","City":"Grahamtown","State":"VI","Zip":40227,"Status":"Active"},{"ClientId":1020,"Company":"BYTREX","Contact":"Fry Raymond","Phone":"(884) 440-2793","Email":"fryraymond@bytrex.com","Address":"873 Miami Court","City":"Clay","State":"WI","Zip":53425,"Status":"Active"},{"ClientId":9204,"Company":"FLUMBO","Contact":"Gladys Wooten","Phone":"(800) 509-2143","Email":"gladyswooten@flumbo.com","Address":"674 Vandervoort Avenue","City":"Dunnavant","State":"OH","Zip":70264,"Status":"Active"},{"ClientId":1403,"Company":"IDEGO","Contact":"Joyce Moore","Phone":"(877) 509-3661","Email":"joycemoore@idego.com","Address":"102 President Street","City":"Davenport","State":"FL","Zip":63139,"Status":"Active"},{"ClientId":6285,"Company":"LOVEPAD","Contact":"Sherman Kirk","Phone":"(876) 473-2949","Email":"shermankirk@lovepad.com","Address":"470 Crosby Avenue","City":"Turah","State":"WA","Zip":29969,"Status":"Active"},{"ClientId":3068,"Company":"TETAK","Contact":"Valencia Murray","Phone":"(839) 557-3159","Email":"valenciamurray@tetak.com","Address":"457 Covert Street","City":"Brownlee","State":"WY","Zip":86029,"Status":"Active"},{"ClientId":7463,"Company":"BUZZOPIA","Contact":"Enid Berry","Phone":"(858) 428-3075","Email":"enidberry@buzzopia.com","Address":"926 Fillmore Place","City":"Mahtowa","State":"MI","Zip":35560,"Status":"Active"},{"ClientId":1579,"Company":"FUELTON","Contact":"Henderson Rivas","Phone":"(874) 595-3455","Email":"hendersonrivas@fuelton.com","Address":"750 Vernon Avenue","City":"Whitehaven","State":"GA","Zip":38686,"Status":"Active"},{"ClientId":1402,"Company":"QUARX","Contact":"Britt Mason","Phone":"(812) 417-3693","Email":"brittmason@quarx.com","Address":"768 Bayview Place","City":"Waiohinu","State":"OR","Zip":40387,"Status":"Active"},{"ClientId":7445,"Company":"MOTOVATE","Contact":"Debora Brennan","Phone":"(815) 571-3879","Email":"deborabrennan@motovate.com","Address":"332 Everett Avenue","City":"Brenton","State":"LA","Zip":23425,"Status":"Active"},{"ClientId":1467,"Company":"ZAPHIRE","Contact":"Reva Hood","Phone":"(845) 539-2254","Email":"revahood@zaphire.com","Address":"737 Macon Street","City":"Hollins","State":"KY","Zip":71606,"Status":"Active"},{"ClientId":3045,"Company":"CORPORANA","Contact":"Karin Patrick","Phone":"(912) 466-3840","Email":"karinpatrick@corporana.com","Address":"396 Grimes Road","City":"Canby","State":"AZ","Zip":82619,"Status":"Active"},{"ClientId":2110,"Company":"GAPTEC","Contact":"Bonnie Velazquez","Phone":"(913) 537-2061","Email":"bonnievelazquez@gaptec.com","Address":"261 Oriental Boulevard","City":"Sultana","State":"IN","Zip":94292,"Status":"Active"},{"ClientId":1665,"Company":"NETAGY","Contact":"Pennington Mcclain","Phone":"(890) 471-3680","Email":"penningtonmcclain@netagy.com","Address":"872 Sunnyside Court","City":"Edmund","State":"MH","Zip":56055,"Status":"Active"},{"ClientId":51,"Company":"VANTAGE","Contact":"Samantha Boyer","Phone":"(960) 549-3485","Email":"samanthaboyer@vantage.com","Address":"275 Sullivan Place","City":"Hoehne","State":"NM","Zip":55165,"Status":"Active"},{"ClientId":7178,"Company":"SHEPARD","Contact":"Lenore Holt","Phone":"(916) 528-2258","Email":"lenoreholt@shepard.com","Address":"179 Seigel Court","City":"Clayville","State":"MO","Zip":59879,"Status":"Active"},{"ClientId":7480,"Company":"SUREPLEX","Contact":"Ebony Chaney","Phone":"(851) 475-2745","Email":"ebonychaney@sureplex.com","Address":"404 Crooke Avenue","City":"Hebron","State":"AR","Zip":57539,"Status":"Active"},{"ClientId":5427,"Company":"AUSTECH","Contact":"Mosley Grimes","Phone":"(911) 515-2908","Email":"mosleygrimes@austech.com","Address":"883 Lawn Court","City":"Devon","State":"IA","Zip":36453,"Status":"Active"},{"ClientId":8362,"Company":"ONTAGENE","Contact":"Imogene Carpenter","Phone":"(964) 428-3273","Email":"imogenecarpenter@ontagene.com","Address":"892 Quincy Street","City":"Clarksburg","State":"DC","Zip":14540,"Status":"Active"},{"ClientId":4972,"Company":"OPTICON","Contact":"Mason Mccoy","Phone":"(880) 590-3095","Email":"masonmccoy@opticon.com","Address":"161 Woodbine Street","City":"Coloma","State":"UT","Zip":84891,"Status":"Active"},{"ClientId":5443,"Company":"COMVEYER","Contact":"Lillian Baird","Phone":"(871) 462-3372","Email":"lillianbaird@comveyer.com","Address":"297 Martense Street","City":"Tyhee","State":"SC","Zip":75257,"Status":"Active"},{"ClientId":4661,"Company":"QIAO","Contact":"Latasha Matthews","Phone":"(876) 507-2096","Email":"latashamatthews@qiao.com","Address":"735 Marconi Place","City":"Cataract","State":"TX","Zip":64256,"Status":"Active"},{"ClientId":2802,"Company":"APEX","Contact":"Manning Pugh","Phone":"(907) 571-2771","Email":"manningpugh@apex.com","Address":"816 Irwin Street","City":"Zarephath","State":"VA","Zip":21957,"Status":"Active"},{"ClientId":8247,"Company":"AUTOMON","Contact":"Cathryn Brewer","Phone":"(856) 554-2844","Email":"cathrynbrewer@automon.com","Address":"741 Henry Street","City":"Walker","State":"NC","Zip":36967,"Status":"Active"},{"ClientId":7882,"Company":"AUSTEX","Contact":"Riggs Allison","Phone":"(951) 427-2348","Email":"riggsallison@austex.com","Address":"676 Whitty Lane","City":"Churchill","State":"IL","Zip":75003,"Status":"Active"},{"ClientId":842,"Company":"INTERLOO","Contact":"Mccall Thompson","Phone":"(829) 403-3444","Email":"mccallthompson@interloo.com","Address":"242 Railroad Avenue","City":"Colton","State":"MT","Zip":80769,"Status":"Active"},{"ClientId":6260,"Company":"QUINEX","Contact":"Boyer Buckley","Phone":"(945) 569-3528","Email":"boyerbuckley@quinex.com","Address":"414 Apollo Street","City":"Twilight","State":"NE","Zip":79502,"Status":"Active"},{"ClientId":8328,"Company":"MARQET","Contact":"Doyle Nieves","Phone":"(918) 457-3239","Email":"doylenieves@marqet.com","Address":"370 Bushwick Place","City":"Emerald","State":"HI","Zip":94393,"Status":"Active"},{"ClientId":3502,"Company":"DECRATEX","Contact":"Hodge Yates","Phone":"(845) 470-3990","Email":"hodgeyates@decratex.com","Address":"746 Lincoln Place","City":"Hall","State":"SD","Zip":20752,"Status":"Active"},{"ClientId":7433,"Company":"EARTHMARK","Contact":"Lacey Carrillo","Phone":"(802) 576-2236","Email":"laceycarrillo@earthmark.com","Address":"850 Porter Avenue","City":"Garnet","State":"OK","Zip":11954,"Status":"Active"},{"ClientId":4320,"Company":"CENTREGY","Contact":"Coleman Mullins","Phone":"(843) 526-2874","Email":"colemanmullins@centregy.com","Address":"267 High Street","City":"Salunga","State":"MD","Zip":34552,"Status":"Active"},{"ClientId":9458,"Company":"LUXURIA","Contact":"Paige Miller","Phone":"(973) 515-3028","Email":"paigemiller@luxuria.com","Address":"421 Walker Court","City":"Oley","State":"NY","Zip":75422,"Status":"Active"},{"ClientId":6017,"Company":"GENMY","Contact":"Jeanie Kline","Phone":"(966) 417-3386","Email":"jeaniekline@genmy.com","Address":"160 Williamsburg Street","City":"Babb","State":"ME","Zip":60147,"Status":"Active"},{"ClientId":9234,"Company":"XEREX","Contact":"Nunez Sloan","Phone":"(976) 583-3354","Email":"nunezsloan@xerex.com","Address":"353 Lake Place","City":"Fairacres","State":"FM","Zip":95974,"Status":"Active"},{"ClientId":1942,"Company":"VOLAX","Contact":"Bray Leblanc","Phone":"(838) 466-2330","Email":"brayleblanc@volax.com","Address":"345 Abbey Court","City":"Irwin","State":"MA","Zip":52982,"Status":"Active"},{"ClientId":6402,"Company":"MEDCOM","Contact":"Glenna Monroe","Phone":"(989) 576-3331","Email":"glennamonroe@medcom.com","Address":"150 Broome Street","City":"Sunwest","State":"MS","Zip":86926,"Status":"Active"},{"ClientId":3650,"Company":"OPTICOM","Contact":"Warner Giles","Phone":"(959) 487-3525","Email":"warnergiles@opticom.com","Address":"288 Essex Street","City":"Waterview","State":"PW","Zip":87537,"Status":"Active"},{"ClientId":9031,"Company":"DREAMIA","Contact":"Goodman Serrano","Phone":"(907) 584-3569","Email":"goodmanserrano@dreamia.com","Address":"963 Tapscott Street","City":"Coaldale","State":"PR","Zip":32758,"Status":"Active"},{"ClientId":2963,"Company":"ANIMALIA","Contact":"Nadia Adams","Phone":"(957) 572-2336","Email":"nadiaadams@animalia.com","Address":"652 Moffat Street","City":"Harrison","State":"AK","Zip":70736,"Status":"Active"},{"ClientId":6151,"Company":"CENTREE","Contact":"Roman Merrill","Phone":"(824) 500-2194","Email":"romanmerrill@centree.com","Address":"472 Hull Street","City":"Bowie","State":"ID","Zip":42671,"Status":"Active"},{"ClientId":1514,"Company":"KENEGY","Contact":"Horton Owen","Phone":"(810) 400-3920","Email":"hortonowen@kenegy.com","Address":"254 Bedford Avenue","City":"Edgar","State":"WV","Zip":27068,"Status":"Active"},{"ClientId":444,"Company":"ORBAXTER","Contact":"Mcfarland Ingram","Phone":"(898) 430-2069","Email":"mcfarlandingram@orbaxter.com","Address":"665 Mermaid Avenue","City":"Skyland","State":"DE","Zip":39107,"Status":"Active"},{"ClientId":1213,"Company":"VALPREAL","Contact":"Amanda Molina","Phone":"(905) 589-2805","Email":"amandamolina@valpreal.com","Address":"747 Barbey Street","City":"Carrizo","State":"NJ","Zip":64131,"Status":"Active"},{"ClientId":4828,"Company":"ZOID","Contact":"Charity Gonzalez","Phone":"(887) 579-3843","Email":"charitygonzalez@zoid.com","Address":"535 Charles Place","City":"Muir","State":"MP","Zip":61492,"Status":"Active"},{"ClientId":5200,"Company":"FUTURIZE","Contact":"Saundra Pierce","Phone":"(958) 593-2334","Email":"saundrapierce@futurize.com","Address":"745 Dewitt Avenue","City":"Belva","State":"PA","Zip":40782,"Status":"Active"},{"ClientId":4736,"Company":"TUBESYS","Contact":"Kari Harris","Phone":"(868) 416-3192","Email":"kariharris@tubesys.com","Address":"511 Degraw Street","City":"Crucible","State":"CA","Zip":71474,"Status":"Active"}];
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