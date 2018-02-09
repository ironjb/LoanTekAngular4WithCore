import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/toPromise';
import { LODASH_TOKEN, CommonMethodsService, IFilterTest, ISelectOption, IFilterOperator, ILoggedInUserInfo } from 'ltCommon/index';

import { IUserListInfo, IUserRow, IUser, IUserListFilter, IChangeUserRoleModel, IUpdatePasswordModel, IUserNote, IUserNoteListFilter
	, IUserNoteListInfo, ISaveNewNoteModel, IUpdateNoteModel, IDeliverByEmailOption, IDeliverBySmsOption } from './user.model.d';

@Injectable()
export class UserService {
	userListData: Promise<IUserRow[]>;
	userNoteListData: Promise<IUserNote[]>;
	loggedInUserInfo: Promise<ILoggedInUserInfo>;

	constructor(private http: Http, private cm: CommonMethodsService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	// #region GET methods

		getUser(userId: number): Promise<IUser> {
			return this.cm.getRequest<IUser>(`/Services/UserManager/GetUser/${userId}`);
			// return new Promise<IUser>(resolve => {
			// 	setTimeout(() => {
			// 		resolve(this.fakeList.filter(u => u.UserId === userId)[0]);
			// 	}, 500);
			// });
		}

		getAllUsers(): Promise<IUserRow[]> {
			if (!this.loggedInUserInfo) {
				this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			}

			return this.loggedInUserInfo.then(userInfo => {
				return this.cm.getRequest<IUserRow[]>(`/Services/UserManager/GetAllUsers/${userInfo.ActiveClientId}?includeInactiveUsers=true`);
			});
			// return new Promise<IUserRow[]>(resolve => {
			// 	setTimeout(() => {
			// 		resolve(this.fakeList);
			// 	}, 500);
			// });
		}

		// getLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
		// 	return this.cm.getRequest<ILoggedInUserInfo>('/Services/ClientManager/GetLoggedInUserInfo');
		// }
		initLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
			if (!this.loggedInUserInfo) {
				this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			}

			return this.loggedInUserInfo;
		}

		getFilteredUserList(currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IUserListFilter): Promise<IUserListInfo> {
			// if (!this.loggedInUserInfo) {
			// 	this.loggedInUserInfo = this.cm.getLoggedInUserInfo();
			// }
			this.initLoggedInUserInfo();

			if (!this.userListData) {
				this.userListData = this.getAllUsers();
			}

			return this.loggedInUserInfo.then((userInfo: ILoggedInUserInfo) => {
				return this.userListData.then((userList: IUserRow[]) => {
					// Copy userList so we don't edit the original
					var sortList: IUserRow[] = userList.slice();

					// Sorting
					if (sortBy) {
						sortList = sortList.sort(this.cm.sortFn<IUserRow>(sortBy, reverse));
					} else {
						// If not sorting, puts the logged in active user first
						let currentUserIndex = this._.findIndex(sortList, { UserId: userInfo.ActiveUserId });

						if (currentUserIndex !== -1) {
							let currentUserRow = sortList.splice(currentUserIndex, 1)[0];
							sortList.unshift(currentUserRow);
						}
					}

					// Filtering
					if (filter) {
						sortList = sortList.filter(u => {
							var containsMatchArray: IFilterTest[] = [
								// { filter: filter.clientNameFilter, value: u.ClientName }
								{ filter: filter.firstNameFilter, value: u.FirstName }
								, { filter: filter.lastNameFilter, value: u.LastName }
								, { filter: filter.phoneFilter, value: u.Phone, type: 'fuzzy' }
								, { filter: filter.emailFilter, value: u.Email }
								, { filter: filter.lastLoginFilter, value: u.LastLogin.toString(), type: 'date', operator: filter.lastLoginOpFilter }
								, { filter: filter.activeFilter, value: u.Active ? 'true' : 'false' }
								, { filter: filter.userRoleFilter, value: u.UserRole }
							];

							return this.cm.filterFn(containsMatchArray);
						});
					}

					var sliceStart = (currentPage-1)*pageSize;
					var sliceEnd = sliceStart + pageSize;

					return new Promise<IUserListInfo>(resolve => {
						var uListInfo: IUserListInfo = {
							userCount: sortList.length
							, pageSize: pageSize
							, currentPage: currentPage
							, userList: sortList.slice(sliceStart, sliceEnd)
							, loggedInUserInfo: userInfo
						};
						setTimeout(() => {
							resolve(uListInfo as IUserListInfo);
						}, 100);
					});
				});
			});
		}

		// getUserTypeOptions(): Promise<ISelectOption[]> {
		// 	return new Promise<ISelectOption[]>(resolve => {
		// 		setTimeout(() => {
		// 			let userTypeOpts: ISelectOption[] = [
		// 				{ Text: 'Standard', Value: '1' }
		// 				, { Text: 'Quote Widget Domain', Value: '2' }
		// 			];
		// 			resolve(userTypeOpts);
		// 		}, 500)
		// 	});
		// }

		getTimeZoneOptions(): Promise<ISelectOption[]> {
			return this.cm.getRequest<ISelectOption[]>('/Services/UserManager/GetTimeZoneOptions');
			// return new Promise<ISelectOption[]>(resolve => {
			// 	setTimeout(() => {
			// 		let timeZoneOpts: ISelectOption[] = [
			// 			{ Text: 'Atlantic Time', Value: '1' }
			// 			, { Text: 'Eastern Time', Value: '2' }
			// 			, { Text: 'Central Time', Value: '3' }
			// 			, { Text: 'Mountain Time', Value: '4' }
			// 			, { Text: 'Pacific Time', Value: '5' }
			// 			, { Text: 'Alaskan Time', Value: '6' }
			// 			, { Text: 'Hawaiian Time', Value: '7' }
			// 		];
			// 		resolve(timeZoneOpts);
			// 	}, 500)
			// });
		}

		getUserRoleOptions(userId: number): Promise<ISelectOption[]> {
			return this.cm.getRequest<ISelectOption[]>(`/Services/UserManager/GetUserRoleOptions/${userId}`);
			// return new Promise<ISelectOption[]>(resolve => {
			// 	setTimeout(() => {
			// 		let userRoleOpts: ISelectOption[] = [
			// 			{ Text: 'ClientUserLMOnly', Value: '1' }
			// 			, { Text: 'ClientUser', Value: '2' }
			// 			, { Text: 'ClientSalesAdmin', Value: '3' }
			// 			, { Text: 'ClientAdmin', Value: '4' }
			// 			, { Text: 'MasterClientUser', Value: '5' }
			// 			, { Text: 'MasterClientAdmin', Value: '6' }
			// 			, { Text: 'LoanTekLoanPricerUser', Value: '7' }
			// 			, { Text: 'LoanTekAdmin', Value: '8' }
			// 		];
			// 		resolve(userRoleOpts);
			// 	}, 500)
			// });
		}

		getNotes(userId: number): Promise<IUserNote[]> {
			return this.cm.getRequest<IUserNote[]>(`/Services/UserManager/GetNotes/${userId}`);
			// return new Promise<IUserNote[]>(resolve => {
			// 	setTimeout(() => {
			// 		resolve(this.fakeNotes);
			// 	}, 500);
			// });
		}

		getFilteredUserNoteList(userId: number, currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IUserNoteListFilter, resetInfo?: boolean): Promise<IUserNoteListInfo> {
			if (resetInfo) {
				this.userNoteListData = null;
			}

			if (!this.userNoteListData) {
				this.userNoteListData = this.getNotes(userId);
			}

			return this.userNoteListData.then((userNoteList: IUserNote[]) => {
				// Copy userNoteList so we don't edit the original
				var sortList: IUserNote[] = userNoteList.slice();

				// Sorting
				if (sortBy) {
					sortList = sortList.sort(this.cm.sortFn<IUserNote>(sortBy, reverse));
				}

				// Filtering
				if (filter) {
					sortList = sortList.filter(n => {
						var containsMatchArray: IFilterTest[] = [
							{ filter: filter.createDateFilter, value: n.Created.toString(), type: 'date', operator: filter.createDateOpFilter }
							, { filter: filter.editByNameFilter, value: n.EditByName }
							, { filter: filter.noteFilter, value: n.Note }
						];

						return this.cm.filterFn(containsMatchArray);
					});
				}

				var sliceStart = (currentPage-1)*pageSize;
				var sliceEnd = sliceStart + pageSize;
				// window.console && console.log('slice', sliceStart, sliceEnd);

				return new Promise<IUserNoteListInfo>(resolve => {
					var unListInfo: IUserNoteListInfo = {
						noteCount: sortList.length
						, pageSize: pageSize
						, currentPage: currentPage
						, noteList: sliceEnd > 0 ? sortList.slice(sliceStart, sliceEnd) : sortList.slice(0)
					};
					setTimeout(() => {
						resolve(unListInfo as IUserNoteListInfo);
					}, 100);
				});
			});
		}

		getDeliverByEmailOptions(userId: number): Promise<IDeliverByEmailOption[]> {
			let fakeEmailDeliveryOptions = [{"Id":523,"Email":"hardyDay@kinetica.com","UseForTaskReminder":true},{"Id":524,"Email":"robinRogers@optyk.com","UseForTaskReminder":false},{"Id":525,"Email":"letitiaZamora@frolix.com","UseForTaskReminder":true},{"Id":526,"Email":"santiagoWheeler@kiggle.com","UseForTaskReminder":false}];
			return new Promise<IDeliverByEmailOption[]>(resolve => {
				setTimeout(() => {
					resolve(fakeEmailDeliveryOptions);
				}, 500);
			});
		}

		getDeliverBySmsOptions(userId: number): Promise<IDeliverBySmsOption[]> {
			let fakeDeliverBySmsOptions: IDeliverBySmsOption[] = [{"Id":523,"SmsNumber":"9994613999","SpId":3,"SpName":"T-Mobile","UseForTaskReminder":true},{"Id":524,"SmsNumber":"9614373203","SpId":5,"SpName":"US Cellular","UseForTaskReminder":false},{"Id":525,"SmsNumber":"9355632495","SpId":2,"SpName":"AT&T","UseForTaskReminder":true},{"Id":526,"SmsNumber":"9115453736","SpId":4,"SpName":"Sprint","UseForTaskReminder":true}];
			return new Promise<IDeliverBySmsOption[]>(resolve => {
				setTimeout(() => {
					resolve(fakeDeliverBySmsOptions);
				}, 500);
			});
		}

		getSmsProviders(): Promise<ISelectOption[]> {
			let fakeSmsProviders: ISelectOption[] = [
				{ Text: 'Verizon', Value: '1' }
				, { Text: 'AT&T', Value: '2' }
				, { Text: 'T-Mobile', Value: '3' }
				, { Text: 'Sprint', Value: '4' }
				, { Text: 'US Cellular', Value: '5' }
			];
			fakeSmsProviders = fakeSmsProviders.map(opt => {
				opt.Value = +opt.Value;
				return opt;
			});
			return new Promise<ISelectOption[]>(resolve => {
				setTimeout(() => {
					resolve(fakeSmsProviders);
				}, 500);
			});
		}

	// #endregion

	// #region POST methods

		changeUserRole(userRoleModel: IChangeUserRoleModel): Promise<boolean|string> {
			return this.cm.postRequest<boolean|string>('/Services/UserManager/ChangeUserRole', userRoleModel);
		}

		updatePassword(passwordModel: IUpdatePasswordModel): Promise<boolean|string> {
			return this.cm.postRequest<boolean|string>('/Services/UserManager/UpdatePassword', passwordModel);
		}

		saveUser(user: IUser): Promise<boolean|string> {
			return this.cm.postRequest<boolean|string>('/Services/UserManager/SaveUser', user);
		}

		saveNewNote(saveNoteModel: ISaveNewNoteModel): Promise<boolean|string> {
			return this.cm.postRequest<boolean|string>('/Services/UserManager/SaveNewNote', saveNoteModel);
		}

		deleteNote(noteId: number): Promise<boolean|string> {
			return this.cm.deleteRequest<boolean|string>(`/Services/UserManager/DeleteNote/${noteId}`);
		}

		updateNote(updateNoteModel: IUpdateNoteModel): Promise<boolean|string> {
			return this.cm.postRequest<boolean|string>('/Services/UserManager/UpdateNote', updateNoteModel);
		}

		// Deliver By Email
		deleteDeliverByEmail(deliverByEmailId: number): Promise<boolean|string> {
			// return this.cm.deleteRequest<boolean|string>(`/Services/UserManager/DeleteDeliverByEmail/${deliverByEmailId}`);
			return new Promise<boolean|string>(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 500);
			});
		}

		saveDeliverByEmail(emailOpt: IDeliverByEmailOption): Promise<boolean|string> {
			return new Promise<boolean|string>(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 500);
			});
		}

		// Deliver By SMS
		deleteDeliverBySms(deliverBySmsId: number): Promise<boolean|string> {
			return new Promise<boolean|string>(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 500);
			});
		}

		saveDeliverBySms(smsOpt: IDeliverBySmsOption): Promise<boolean|string> {
			return new Promise<boolean|string>(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 500);
			});
		}

	// #endregion

	// #region Shared methods

		handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

		// private getRequest<T>(getUrl: string): Promise<T> {
		// 	return this.http.get(getUrl).toPromise().then((response: Response) => {
		// 		return response.json() as T;
		// 	});
		// }

		// private postRequest<T>(postUrl: string, model: any): Promise<T> {
		// 	let headers = new Headers({ 'Content-Type': 'application/json' });
		// 	let options = new RequestOptions({ headers: headers });
		// 	return this.http.post(postUrl, model, options).toPromise().then((response: Response) => {
		// 		return response.json() as T;
		// 	});
		// }

		// private fakeList: IUser[] = [{"UserId":31,"FirstName":"Yvonne","LastName":"Morrison","Phone":"(876) 558-3990","LastLogin":"2017-01-13T02:16:42","Active":false,"UserRole":"MasterClientAdmin","Title":"Some Other Title","Address":"622 Dunne Place","City":"Cataract","State":"Georgia","ZipCode":"62498z","Ext":"ex 236","CellPhone":"(992) 400-3882","HomePhone":"(954) 584-2846","TimeZonePreference":"Pacific Time","NMLS":"NMLS472392","WebSite":"www.locazone.com","Email":"yvonnemorrison@locazone.com","Password":"18e57b7f-4952-4d8b-84c6-f08bc9858812","LastEdit":"2014-11-27T05:08:55","LastEditBy":47,"LastEditByName":"Mckenzie Schwartz"},{"UserId":32,"FirstName":"Augusta","LastName":"Roberson","Phone":"(809) 479-2443","LastLogin":"2015-04-04T09:05:20","Active":true,"UserRole":"ClientUser","Title":"Some Other Title","Address":"885 Jodie Court","City":"Galesville","State":"Nevada","ZipCode":"67005z","Ext":"ex 201","CellPhone":"(865) 442-3470","HomePhone":"(960) 455-3206","TimeZonePreference":"Alaskan Time","NMLS":"NMLS436192","WebSite":"www.prosely.com","Email":"augustaroberson@prosely.com","Password":"bab4d927-762e-4603-89fc-6d94fcf342eb","LastEdit":"2014-08-30T05:05:06","LastEditBy":26,"LastEditByName":"Alston Roman"},{"UserId":33,"FirstName":"Olive","LastName":"Townsend","Phone":"(995) 533-3240","LastLogin":"2017-09-04T06:28:35","Active":false,"UserRole":"MasterClientAdmin","Title":"Some Other Title","Address":"682 Ira Court","City":"Farmington","State":"Minnesota","ZipCode":"35690z","Ext":"ex 331","CellPhone":"(946) 443-2029","HomePhone":"(811) 551-2520","TimeZonePreference":"Hawaiian Time","NMLS":"NMLS845511","WebSite":"www.unq.com","Email":"olivetownsend@unq.com","Password":"0bb6dd35-58bc-4760-aa0f-c6afe2360ec7","LastEdit":"2014-03-01T07:24:43","LastEditBy":96,"LastEditByName":"Rice Tillman"},{"UserId":34,"FirstName":"Lesley","LastName":"White","Phone":"(844) 561-3205","LastLogin":"2017-11-07T07:33:16","Active":true,"UserRole":"ClientSalesAdmin","Title":"Account Manager Title","Address":"672 Tapscott Avenue","City":"Connerton","State":"Nebraska","ZipCode":"20413z","Ext":"ex 793","CellPhone":"(853) 591-3269","HomePhone":"(971) 594-3561","TimeZonePreference":"Mountain Time","NMLS":"NMLS685090","WebSite":"www.pulze.com","Email":"lesleywhite@pulze.com","Password":"336bbb27-7972-4230-9c2c-a42465cb5490","LastEdit":"2015-03-26T01:04:34","LastEditBy":49,"LastEditByName":"White Howe"},{"UserId":35,"FirstName":"Melisa","LastName":"Sutton","Phone":"(941) 563-3731","LastLogin":"2017-11-17T05:20:35","Active":true,"UserRole":"MasterClientAdmin","Title":"Some Other Title","Address":"393 Front Street","City":"Clarktown","State":"District Of Columbia","ZipCode":"96099z","Ext":"ex 459","CellPhone":"(993) 535-2685","HomePhone":"(829) 413-2630","TimeZonePreference":"Eastern Time","NMLS":"NMLS831996","WebSite":"www.steelfab.com","Email":"melisasutton@steelfab.com","Password":"7999726b-cba7-4cf1-a4fd-e4ca1b3ead19","LastEdit":"2017-02-13T03:00:18","LastEditBy":58,"LastEditByName":"Delores Branch"},{"UserId":36,"FirstName":"Jerry","LastName":"Haynes","Phone":"(817) 492-3024","LastLogin":"2016-07-01T05:07:27","Active":true,"UserRole":"ClientAdmin","Title":"Account Manager Title","Address":"853 Townsend Street","City":"Savannah","State":"New York","ZipCode":"22676z","Ext":"ex 314","CellPhone":"(966) 510-2149","HomePhone":"(976) 533-3986","TimeZonePreference":"Hawaiian Time","NMLS":"NMLS633061","WebSite":"www.netropic.com","Email":"jerryhaynes@netropic.com","Password":"39886cc3-9c47-4e68-9364-8042f7260279","LastEdit":"2017-04-26T01:57:50","LastEditBy":49,"LastEditByName":"Ross Dickerson"},{"UserId":37,"FirstName":"Williams","LastName":"Fulton","Phone":"(876) 443-2981","LastLogin":"2017-08-06T01:48:33","Active":false,"UserRole":"LoanTekLoanPricerUser","Title":"Account User Title","Address":"254 Dinsmore Place","City":"Warren","State":"Tennessee","ZipCode":"71059z","Ext":"ex 661","CellPhone":"(889) 515-3265","HomePhone":"(921) 524-2986","TimeZonePreference":"Hawaiian Time","NMLS":"NMLS607497","WebSite":"www.accuprint.com","Email":"williamsfulton@accuprint.com","Password":"bf27294e-220b-4682-b695-927a3762e3c8","LastEdit":"2014-01-20T04:06:25","LastEditBy":12,"LastEditByName":"Donaldson Noble"},{"UserId":38,"FirstName":"Bird","LastName":"Wagner","Phone":"(907) 420-3872","LastLogin":"2016-10-07T11:04:33","Active":true,"UserRole":"ClientUser","Title":"Account Manager Title","Address":"611 Hudson Avenue","City":"Ryderwood","State":"New Jersey","ZipCode":"33226z","Ext":"ex 778","CellPhone":"(881) 423-2931","HomePhone":"(973) 429-3264","TimeZonePreference":"Pacific Time","NMLS":"NMLS809370","WebSite":"www.optyk.com","Email":"birdwagner@optyk.com","Password":"32d5cac7-c75e-4fc3-b0dd-87156f51851c","LastEdit":"2015-01-31T01:50:34","LastEditBy":84,"LastEditByName":"Therese Lynch"},{"UserId":39,"FirstName":"Bond","LastName":"Huff","Phone":"(930) 562-2985","LastLogin":"2017-09-24T06:56:45","Active":true,"UserRole":"ClientUser","Title":"Some Other Title","Address":"378 High Street","City":"Eagleville","State":"Virginia","ZipCode":"92190z","Ext":"ex 143","CellPhone":"(926) 529-3995","HomePhone":"(947) 402-2585","TimeZonePreference":"Mountain Time","NMLS":"NMLS890944","WebSite":"www.konnect.com","Email":"bondhuff@konnect.com","Password":"c4d08404-b8dd-45fc-af5e-929e41c10481","LastEdit":"2016-12-16T12:04:02","LastEditBy":88,"LastEditByName":"Kimberley Conner"},{"UserId":40,"FirstName":"Ford","LastName":"Knowles","Phone":"(831) 510-3409","LastLogin":"2017-07-30T02:18:55","Active":false,"UserRole":"ClientSalesAdmin","Title":"Account Manager Title","Address":"971 Narrows Avenue","City":"Neahkahnie","State":"Alabama","ZipCode":"99025z","Ext":"ex 917","CellPhone":"(818) 502-3394","HomePhone":"(882) 567-3188","TimeZonePreference":"Central Time","NMLS":"NMLS385521","WebSite":"www.zoxy.com","Email":"fordknowles@zoxy.com","Password":"14c42717-4456-44ba-85d7-7ab6bf9d9b29","LastEdit":"2017-11-26T04:34:34","LastEditBy":31,"LastEditByName":"Savannah Ochoa"},{"UserId":41,"FirstName":"Florence","LastName":"Barnes","Phone":"(855) 548-3945","LastLogin":"2016-09-02T12:14:31","Active":false,"UserRole":"LoanTekLoanPricerUser","Title":"Account User Title","Address":"706 Alton Place","City":"Canterwood","State":"Indiana","ZipCode":"14707z","Ext":"ex 974","CellPhone":"(933) 457-2440","HomePhone":"(850) 442-2540","TimeZonePreference":"Mountain Time","NMLS":"NMLS571691","WebSite":"www.blurrybus.com","Email":"florencebarnes@blurrybus.com","Password":"5ef790c4-6c4a-41bd-9b05-70ea8292318a","LastEdit":"2015-02-19T07:56:40","LastEditBy":75,"LastEditByName":"Clayton Hyde"},{"UserId":42,"FirstName":"Mary","LastName":"Aguilar","Phone":"(926) 585-2581","LastLogin":"2014-03-26T11:40:20","Active":false,"UserRole":"LoanTekLoanPricerUser","Title":"Account Manager Title","Address":"292 Polhemus Place","City":"Chamizal","State":"Northern Mariana Islands","ZipCode":"40855z","Ext":"ex 451","CellPhone":"(814) 469-2293","HomePhone":"(891) 437-3171","TimeZonePreference":"Hawaiian Time","NMLS":"NMLS250037","WebSite":"www.zilidium.com","Email":"maryaguilar@zilidium.com","Password":"c4f5cdc7-59f7-4641-b9ce-8987e79e924e","LastEdit":"2017-04-26T06:40:14","LastEditBy":85,"LastEditByName":"Lynette Everett"},{"UserId":43,"FirstName":"Lila","LastName":"Williams","Phone":"(884) 417-3680","LastLogin":"2015-11-06T11:22:42","Active":true,"UserRole":"LoanTekLoanPricerUser","Title":"Account Manager Title","Address":"189 Everett Avenue","City":"Rosburg","State":"Oregon","ZipCode":"80295z","Ext":"ex 245","CellPhone":"(980) 466-2037","HomePhone":"(941) 493-3735","TimeZonePreference":"Eastern Time","NMLS":"NMLS712783","WebSite":"www.insectus.com","Email":"lilawilliams@insectus.com","Password":"d7c4b893-ff3c-4005-9137-096b9084ae55","LastEdit":"2014-04-25T11:22:24","LastEditBy":26,"LastEditByName":"Ollie Wooten"},{"UserId":44,"FirstName":"Joyner","LastName":"Norris","Phone":"(804) 437-2259","LastLogin":"2014-12-08T11:31:57","Active":false,"UserRole":"MasterClientAdmin","Title":"Account User Title","Address":"529 Stuyvesant Avenue","City":"Gardners","State":"Michigan","ZipCode":"27471z","Ext":"ex 442","CellPhone":"(850) 516-2802","HomePhone":"(929) 534-2292","TimeZonePreference":"Pacific Time","NMLS":"NMLS601582","WebSite":"www.rubadub.com","Email":"joynernorris@rubadub.com","Password":"1253bb8a-45f3-46bb-93e2-642cdc9dc7d9","LastEdit":"2017-10-18T08:25:38","LastEditBy":58,"LastEditByName":"Diaz Bright"},{"UserId":45,"FirstName":"Drake","LastName":"Landry","Phone":"(860) 414-2463","LastLogin":"2015-07-22T09:37:45","Active":false,"UserRole":"ClientAdmin","Title":"Some Other Title","Address":"659 Dewitt Avenue","City":"Ronco","State":"Puerto Rico","ZipCode":"40060z","Ext":"ex 594","CellPhone":"(881) 520-3729","HomePhone":"(891) 457-2569","TimeZonePreference":"Atlantic Time","NMLS":"NMLS268552","WebSite":"www.ludak.com","Email":"drakelandry@ludak.com","Password":"ce74230b-903c-4bc2-bc6a-00253ab33fc1","LastEdit":"2016-10-03T06:29:14","LastEditBy":98,"LastEditByName":"Wallace Mitchell"},{"UserId":46,"FirstName":"Meadows","LastName":"Burke","Phone":"(945) 525-3227","LastLogin":"2017-03-25T09:05:25","Active":false,"UserRole":"ClientSalesAdmin","Title":"Account User Title","Address":"187 Hinckley Place","City":"Venice","State":"North Dakota","ZipCode":"47388z","Ext":"ex 823","CellPhone":"(807) 583-3772","HomePhone":"(856) 600-3679","TimeZonePreference":"Mountain Time","NMLS":"NMLS880122","WebSite":"www.webiotic.com","Email":"meadowsburke@webiotic.com","Password":"d463f67b-78fd-4306-916d-1bd3f266e9c0","LastEdit":"2015-12-28T09:29:17","LastEditBy":24,"LastEditByName":"Deborah Knox"}];

		// private fakeNotes: IUserNote[] = [{"NoteId":523,"EditByName":"Ashlee Bailey","Created":"2017-02-23T10:09:38","Note":"Cillum ullamco dolor dolore laboris proident nisi minim."},{"NoteId":524,"EditByName":"Vicki Horn","Created":"2014-04-07T05:36:21","Note":"Incididunt deserunt ipsum nulla nulla minim et aute labore sint elit et laborum."},{"NoteId":525,"EditByName":"Kennedy Marks","Created":"2015-01-10T05:12:21","Note":"Culpa cillum ad sint laborum nulla deserunt exercitation."},{"NoteId":526,"EditByName":"Mcintosh Spence","Created":"2017-11-16T02:06:04","Note":"Consectetur eu ea consequat do veniam deserunt eiusmod cupidatat qui ipsum."},{"NoteId":527,"EditByName":"Powell Hinton","Created":"2015-05-24T08:46:49","Note":"Magna nulla qui eiusmod qui voluptate."},{"NoteId":528,"EditByName":"Katharine Bird","Created":"2015-06-19T08:56:47","Note":"Mollit voluptate ex commodo nostrud esse qui."},{"NoteId":529,"EditByName":"Sheri Hawkins","Created":"2017-02-04T09:41:30","Note":"Non non consequat nulla eu."},{"NoteId":530,"EditByName":"Bridgett Vang","Created":"2017-11-02T03:56:20","Note":"Ullamco labore consequat tempor qui exercitation elit laborum consectetur irure enim elit id."},{"NoteId":531,"EditByName":"Castro Fuentes","Created":"2016-08-28T05:38:13","Note":"Veniam cillum eiusmod minim non culpa velit minim consectetur ullamco Lorem."},{"NoteId":532,"EditByName":"Jordan Hammond","Created":"2017-07-16T11:48:27","Note":"Reprehenderit occaecat consequat cillum in."},{"NoteId":533,"EditByName":"Hanson Hart","Created":"2015-04-01T03:16:31","Note":"Qui tempor dolor amet labore fugiat nulla."},{"NoteId":534,"EditByName":"Puckett Bentley","Created":"2014-12-28T10:08:03","Note":"Consequat labore reprehenderit officia tempor occaecat dolore Lorem sit adipisicing."},{"NoteId":535,"EditByName":"Carole Kirby","Created":"2017-10-09T02:57:50","Note":"Ipsum ad culpa qui ex."},{"NoteId":536,"EditByName":"Luann Carpenter","Created":"2017-06-16T05:52:45","Note":"Proident velit velit veniam est deserunt laboris laborum consectetur sunt excepteur."},{"NoteId":537,"EditByName":"Paulette Mcclure","Created":"2015-03-03T07:30:51","Note":"Ad minim duis ullamco Lorem anim reprehenderit reprehenderit tempor sit ad."},{"NoteId":538,"EditByName":"Glass Luna","Created":"2015-10-04T03:59:30","Note":"Irure non officia aute pariatur consequat amet aliquip."}];

	// #endregion
}


// Radom data by https://www.json-generator.com
/*

[
	'{{repeat(16)}}',
	{
		UserId: '{{index() + 31}}',
		// ClientName: '{{company()}}',
		FirstName: '{{firstName()}}',
		LastName: '{{surname()}}',
		Phone: '{{phone()}}',
		// UserName: function(tags) {return this.FirstName.toLowerCase().replace(/\s+/g, "") + "." + this.LastName.toLowerCase().replace(/\s+/g, "");},
		LastLogin: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		Active: '{{bool()}}',
		UserRole: '{{random("ClientAdmin", "ClientUser", "ClientSalesAdmin", "LoanTekLoanPricerUser", "MasterClientAdmin")}}',
		// UserType: '{{random("Standard", "Quote Widget Domain")}}',
		Title: '{{random("Account Manager Title", "Account User Title", "Some Other Title")}}',
		Address: '{{integer(100, 999)}} {{street()}}',
		City: '{{city()}}',
		State: '{{state()}}',
		ZipCode: '{{integer(10000,99999)}}z',
		Ext: 'ex {{integer(100,999)}}',
		CellPhone: '{{phone()}}',
		HomePhone: '{{phone()}}',
		TimeZonePreference: '{{random("Mountain Time", "Atlantic Time", "Eastern Time", "Central Time", "Pacific Time", "Alaskan Time", "Hawaiian Time")}}',
		NMLS: 'NMLS{{integer(100000,999999)}}',
		WebSite: 'www.{{company().toLowerCase()}}.com',
		Email: '{{email()}}',
		Password: '{{guid()}}',
		LastEdit: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		LastEditBy: '{{integer(10,99)}}',
		LastEditByName: '{{firstName()}} {{surname()}}'
		//LockedOut: '{{bool()}}'
	}
]

[
	'{{repeat(16)}}',
	{
		NoteId: '{{index() + 523}}',
		EditByName: '{{firstName()}} {{surname()}}',
		Created: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
		Note: '{{lorem(1, "sentences")}}'
	}
]

[
	'{{repeat(4)}}',
	{
		Id: '{{index() + 523}}',
		Email: '{{firstName().toLowerCase()}}{{surname()}}@{{company().toLowerCase()}}.com',
		UseForTaskReminder: '{{bool()}}'
	}
]

[
	'{{repeat(4)}}',
	{
		Id: '{{index() + 523}}',
		SmsNumber: 'zzz{{phone().replace(/[^\\d]+/g,"")}}',
		SpId: '{{integer(1,5)}}',
		SpName: function (tags) {
			var spName = '';
			switch(this.SpId) {
				case 1:
					spName = 'Verizon';
					break;
				case 2:
					spName = 'AT&T';
					break;
				case 3:
					spName = 'T-Mobile';
					break;
				case 4:
					spName = 'Sprint';
					break;
				case 5:
					spName = 'US Cellular';
					break;
				default:
					spName = 'Other';
			}
			return spName;
		},
		UseForTaskReminder: '{{bool()}}'
	}
]


*/
