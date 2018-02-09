import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IBranch, IBranchManager, IBranchUser, IClientBranchesInfo, IActiveUser, INewBranchAssets, IAddBranchUsersModel, ISaveBranchModel } from './branch.model';

@Injectable()
export class BranchService {

	constructor(private http: Http) {}

	getAllClientBranches(): Promise<IClientBranchesInfo> {
		return this.http.get('/Services/BranchManager/GetAllClientBranches').toPromise().then((response: Response) => {
			return response.json() as IClientBranchesInfo;
		});
	}

	getNewBranchAssets(): Promise<INewBranchAssets> {
		return this.http.get('/Services/BranchManager/GetNewBranchAssets').toPromise().then((response: Response) => {
			return response.json() as INewBranchAssets;
		});
	}

	getAllUsers(clientId: number): Promise<IBranchUser[]> {
		return this.http.get(`/Services/BranchManager/GetAllUsers?clientId=${clientId}`).toPromise().then((response: Response) => {
			return response.json() as IBranchUser[];
		});
	}

	getUsersWithNoBranch(clientId: number): Promise<IBranchUser[]> {
		return this.http.get(`/Services/BranchManager/GetUsersWithNoBranch?clientId=${clientId}`).toPromise().then((response: Response) => {
			return response.json() as IBranchUser[];
		});
	}

	saveBranch(branchModel: ISaveBranchModel): Promise<boolean> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post('/Services/BranchManager/Save', branchModel, options).toPromise().then((response: Response) => {
			return response.json() as boolean;
		});
	}

	addUsers(addUsersModel: IAddBranchUsersModel, isManager: boolean): Promise<boolean> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let addUsersMethod: string = isManager ? 'AddManagers' : 'AddUsers';
		let addUsersUrl = `/Services/BranchManager/${addUsersMethod}`;
		return this.http.post(addUsersUrl, addUsersModel, options).toPromise().then((response: Response) => {
			return response.json() as boolean;
		});
	}

	deleteBranch(clientId: number, branchId: number): Promise<boolean> {
		return this.http.delete(`/Services/BranchManager/DeleteBranch?clientId=${clientId}&branchId=${branchId}`).toPromise().then((response: Response) => {
			return response.json() as boolean;
		});
	}

	deleteUser(clientId: number, branchId: number, userId: number, isBranchManager?: boolean): Promise<boolean> {
		let deleteControllerMethod: string = isBranchManager ? 'DeleteManagerFromBranch' : 'DeleteUserFromBranch';
		let deleteUrl: string = `/Services/BranchManager/${deleteControllerMethod}?clientId=${clientId}&branchId=${branchId}&userId=${userId}`;
		return this.http.delete(deleteUrl).toPromise().then((response: Response) => {
			return response.json() as boolean;
		});
	}
}
