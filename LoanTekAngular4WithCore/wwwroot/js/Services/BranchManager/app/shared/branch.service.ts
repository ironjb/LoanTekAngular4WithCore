import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IBranch, IFakeBranch, IBranchManager, IBranchUser, IClientBranchesInfo, IActiveUser, INewBranchAssets, IAddBranchUsersModel, ISaveBranchModel } from './branch.model';

@Injectable()
export class BranchService {

	_fakeBranches: IBranch[];
	_fakeUsers: IBranchUser[];
	_fakeManagers: IBranchManager[];

	constructor(private http: Http) {
		this._fakeBranches = this.convertFakeBranchsToBranchs(this.getFakeBranches);
		this._fakeUsers = this.getFakeUsers;
		this._fakeManagers = this.getFakeManagers;
	}

	get getFakeUsers(): IBranchUser[] { return this.fakeBranchUsers.slice(); }
	get getFakeManagers(): IBranchManager[] { return this.fakeBranchManagers.slice(); }
	get getFakeBranches(): IFakeBranch[] { return this.fakeBranches.slice(); }
	get getFakePricingRules() { return this.fakePricingRules.slice(); }

	convertFakeBranchsToBranchs(fakeBranches: IFakeBranch[]): IBranch[] {
		return fakeBranches.map(b => {
			return this.convertFakeBranchToBranch(b);
		});
	}

	convertFakeBranchToBranch(fakeBranch: IFakeBranch): IBranch {
		return {
			BranchId: fakeBranch.BranchId
			, BranchName: fakeBranch.BranchName
			, BranchManagers: this.fakeBranchManagers.filter(m => fakeBranch.BranchManagers.indexOf(m.UserId) !== -1)
			, BranchUsers: this.fakeBranchUsers.filter(m => fakeBranch.BranchUsers.indexOf(m.userid) !== -1)
		};
	}

	getAllClientBranches(): Promise<IClientBranchesInfo> {
		// return this.http.get('/Services/BranchManager/GetAllClientBranches').toPromise().then((response: Response) => {
		// 	return response.json() as IClientBranchesInfo;
		// });
		return new Promise<IClientBranchesInfo>(resolve => {
			var fakeClientBranchInfo: IClientBranchesInfo = {
				ActiveUser: { ClientId: 13, UserId: 44 }
				, Branches: this._fakeBranches
			};
			setTimeout(() => {
				resolve(fakeClientBranchInfo);
			}, 100);
		});
	}

	getNewBranchAssets(): Promise<INewBranchAssets> {
		// return this.http.get('/Services/BranchManager/GetNewBranchAssets').toPromise().then((response: Response) => {
		// 	return response.json() as INewBranchAssets;
		// });
		return new Promise<INewBranchAssets>(resolve => {
			// var usersAlreadyInBranch = this._fakeBranches.map(b => {
			// 	var branchUsers
			// });
			var fakeBranchAssets: INewBranchAssets = {
				BranchManagers: this.getFakeUsers
				, BranchUsers: []
				, PricingRules: this.getFakePricingRules
			};
			setTimeout(() => {
				resolve(fakeBranchAssets);
			}, 100);
		});
	}

	getAllUsers(clientId: number): Promise<IBranchUser[]> {
		return this.http.get(`/Services/BranchManager/GetAllUsers?clientId=${clientId}`).toPromise().then((response: Response) => {
			return response.json() as IBranchUser[];
		});
	}

	getUsersWithNoBranch(clientId: number): Promise<IBranchUser[]> {
		// return this.http.get(`/Services/BranchManager/GetUsersWithNoBranch?clientId=${clientId}`).toPromise().then((response: Response) => {
		// 	return response.json() as IBranchUser[];
		// });
		return new Promise<IBranchUser[]>(resolve => {
			var usersAlreadyInBranch: number[] = [];
			this._fakeBranches.forEach(b => {
				usersAlreadyInBranch = usersAlreadyInBranch.concat(b.BranchUsers.map(u => u.userid));
			});
			var remainingBranchUsers = this.getFakeUsers.filter(u => {
				return usersAlreadyInBranch.indexOf(u.userid) === -1;
			});
			setTimeout(() => {
				resolve(remainingBranchUsers);
			}, 100);
		});
	}

	saveBranch(branchModel: ISaveBranchModel): Promise<boolean> {
		// let headers = new Headers({ 'Content-Type': 'application/json' });
		// let options = new RequestOptions({ headers: headers });
		// return this.http.post('/Services/BranchManager/Save', branchModel, options).toPromise().then((response: Response) => {
		// 	return response.json() as boolean;
		// });
		return new Promise<boolean>(resolve => {
			var branchIdList = this._fakeBranches.map(fb => fb.BranchId);
			var maxBranchId = branchIdList.reduce((a,b) => { return Math.max(a,b); });
			var fakeBranch: IFakeBranch = {
				BranchId: ++maxBranchId
				, BranchName: branchModel.BranchName
				, BranchManagers: branchModel.ManagerUserIds
				, BranchUsers: branchModel.UserIds
			};
			var newBranch: IBranch = this.convertFakeBranchToBranch(fakeBranch);
			this._fakeBranches.push(newBranch);
			setTimeout(() => {
				resolve(true);
			}, 100);
		});
	}

	addUsers(addUsersModel: IAddBranchUsersModel, isManager: boolean): Promise<boolean> {
		// let headers = new Headers({ 'Content-Type': 'application/json' });
		// let options = new RequestOptions({ headers: headers });
		// let addUsersMethod: string = isManager ? 'AddManagers' : 'AddUsers';
		// let addUsersUrl = `/Services/BranchManager/${addUsersMethod}`;
		// return this.http.post(addUsersUrl, addUsersModel, options).toPromise().then((response: Response) => {
		// 	return response.json() as boolean;
		// });
		return new Promise<boolean>(resolve => {
			var resolved = false;
			var branch = this._fakeBranches.filter(b => b.BranchId === addUsersModel.BranchId)[0];
			var mgrList = this.getFakeManagers;
			var userList = this.getFakeUsers;
			if (branch) {
				addUsersModel.UserIds.forEach(uId => {
					if (isManager) {
						var mgr: IBranchManager = mgrList.filter(bm => bm.UserId === uId)[0];
						if (mgr) {
							branch.BranchManagers.push(mgr);
							resolved = true;
						}
					} else {
						var usr: IBranchUser = userList.filter(bu => bu.userid === uId)[0];
						if (usr) {
							branch.BranchUsers.push(usr);
							resolved = true;
						}
					}
				});
			}
			setTimeout(() => {
				resolve(resolved);
			}, 100);
		});
	}

	deleteBranch(clientId: number, branchId: number): Promise<boolean> {
		// return this.http.delete(`/Services/BranchManager/DeleteBranch?clientId=${clientId}&branchId=${branchId}`).toPromise().then((response: Response) => {
		// 	return response.json() as boolean;
		// });
		return new Promise<boolean>(resolve => {
			this._fakeBranches.filter(b => b.BranchId === branchId).shift();
			setTimeout(() => {
				resolve(true);
			}, 100);
		});
	}

	deleteUser(clientId: number, branchId: number, userId: number, isBranchManager?: boolean): Promise<boolean> {
		let deleteControllerMethod: string = isBranchManager ? 'DeleteManagerFromBranch' : 'DeleteUserFromBranch';
		let deleteUrl: string = `/Services/BranchManager/${deleteControllerMethod}?clientId=${clientId}&branchId=${branchId}&userId=${userId}`;
		return this.http.delete(deleteUrl).toPromise().then((response: Response) => {
			return response.json() as boolean;
		});
	}

	private fakeBranchManagers: IBranchManager[] = [{ "UserId": 1, "FullName": "Garner Whitley", "Email": "garnerwhitley@andershun.com" }, { "UserId": 2, "FullName": "Rodriguez Baker", "Email": "rodriguezbaker@andershun.com" }, { "UserId": 3, "FullName": "Cook Stewart", "Email": "cookstewart@andershun.com" }, { "UserId": 4, "FullName": "Paul Mccall", "Email": "paulmccall@andershun.com" }, { "UserId": 5, "FullName": "Lucille Mckinney", "Email": "lucillemckinney@andershun.com" }, { "UserId": 6, "FullName": "Alyce Fletcher", "Email": "alycefletcher@andershun.com" }, { "UserId": 7, "FullName": "Carolina Ray", "Email": "carolinaray@andershun.com" }, { "UserId": 8, "FullName": "Bettie Rodriquez", "Email": "bettierodriquez@andershun.com" }, { "UserId": 9, "FullName": "Christie Lester", "Email": "christielester@andershun.com" }, { "UserId": 10, "FullName": "Cindy Aguirre", "Email": "cindyaguirre@andershun.com" }, { "UserId": 11, "FullName": "Browning Cantu", "Email": "browningcantu@andershun.com" }];
	private fakeBranchUsers: IBranchUser[] = this.fakeBranchManagers.map(u => {
		return { userid: u.UserId, FullName: u.FullName, email: u.Email };
	});
	private fakeBranches: IFakeBranch[] = [{ "BranchId": 1, "BranchName": "Firewax", "BranchUsers": [2, 3, 4], "BranchManagers": [2] }, { "BranchId": 2, "BranchName": "Slambda", "BranchUsers": [11], "BranchManagers": [11] }, { "BranchId": 3, "BranchName": "Anixang", "BranchUsers": [5, 6, 7], "BranchManagers": [5] }];
	private fakePricingRules = [{ RuleId: 1, RuleDescription: 'Pricing Rule 1' }, { RuleId: 2, RuleDescription: 'Pricing Rule 2' }, { RuleId: 3, RuleDescription: 'Pricing Rule 3' }, { RuleId: 4, RuleDescription: 'Pricing Rule 4' }];
}

/*
[
	'{{repeat(11)}}',
	{
		UserId: '{{index() + 1}}',
		FullName: '{{firstName()}} {{surname()}}',
		Email: '{{email()}}'
	}
]


[
	'{{repeat(3)}}',
	{
		BranchId: '{{index() + 1}}',
		BranchName: '{{company()}}',
		BranchUsers: function (tags) {
			if (!window.myList) {
				window.myList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
			}
			var randomIndex = Math.floor((Math.random() * window.myList.length));
			var randomIndex2 = Math.floor((Math.random() * 3) + 1);
			var myUsers = window.myList.splice(randomIndex, randomIndex2);
			window.myMgr = [myUsers[0]];
			return myUsers;
		},
		BranchManagers: function (tags) {
			return window.myMgr;
		}
	}
]
*/
