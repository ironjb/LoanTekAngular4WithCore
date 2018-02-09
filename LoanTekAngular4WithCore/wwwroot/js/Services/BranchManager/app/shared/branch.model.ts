export interface IBranch {
	BranchId: number;
	BranchName: string;
	BranchManagers: IBranchManager[];
	BranchUsers: IBranchUser[];
}

export interface IBranchManager {
	UserId: number;
	FullName: string;
	Email: string;
}

export interface IBranchUser {
	userid: number;
	FullName: string;
	email: string;
}

export interface IActiveUser {
	ClientId: number;
	UserId: number;
}

export interface IPricingRule {
	RuleId: number;
	RuleDescription: string;
}

export interface IClientBranchesInfo {
	ActiveUser: IActiveUser;
	Branches: IBranch[];
}

export interface INewBranchAssets {
	BranchManagers: IBranchUser[];
	BranchUsers: IBranchUser[];
	PricingRules: IPricingRule[];
}

export interface ICheckedItem {
	id: number;
	name: string;
	isChecked: boolean;
}

export interface IBranchFormGroupModel {
	branchName: string;
	branchManagers: ICheckedItem[];
	branchUsers: ICheckedItem[];
	pricingRules: ICheckedItem[];
}

export interface IAddUsersFormGroupModel {
	auBranchUsers: ICheckedItem[];
}

export interface ISaveBranchModel {
	ClientId: number;
	ActiveUserId: number;
	BranchName: string;
	ManagerUserIds: number[];
	UserIds: number[];
	PricingRuleIds: number[];
}

export interface IAddBranchUsersModel {
	ClientId: number;
	ActiveUserId: number;
	BranchId: number;
	UserIds: number[];
}

export interface ICurrentBranchUser {
	id: number;
	name: string;
	email: string;
	isManager: boolean;
	userObject: IBranchManager|IBranchUser;
}
