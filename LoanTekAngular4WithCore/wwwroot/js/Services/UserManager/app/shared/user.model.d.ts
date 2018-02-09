import { IFilterOperator, ILoggedInUserInfo } from 'ltCommon/index';


export interface IUserListInfo {
	userList: IUserRow[];
	loggedInUserInfo: ILoggedInUserInfo;
	userCount: number;
	currentPage: number;
	pageSize: number;
}

// export interface ILoggedInUserInfo {
// 	ActiveClientId: number;
// 	ActiveUserId: number;
// 	ClientId: number;
// 	UserId: number;
// 	IsLtAdmin: boolean;
// 	Role: string;
// }

export interface IUserRow {
	UserId: number;
	Title: string;
	FirstName: string;
	LastName: string;
	Address: string;
	City: string;
	State: string;
	ZipCode: string;
	Phone: string;
	Ext: string;
	CellPhone: string;
	HomePhone: string;
	TimeZonePreference: string;
	NMLS: string;
	WebSite: string;
	UserRole: string;
	Email: string;
	LastEdit: string|Date;
	LastLogin: string|Date;
	LastEditBy: number;
	LastEditByName: string;
	Active: boolean;
	LockedOut?: boolean;
}

export interface IUser extends IUserRow {
	// UserType: string;
	// Title: string;
	// Address: string;
	// City: string;
	// State: string;
	// Zip: string;
	// PhoneExt: string;
	// CellPhone: string;
	// HomePhone: string;
	// TimeZonePreference: string;
	// NmlsNumber: string;
	// Url: string;
	// Email: string;
	Password?: string;
	// LastEdit: string|Date;
	// LockedOut: boolean;
}

export type IUserListSort = 'UserId'|'ClientName'|'FirstName'|'LastName'|'Phone'|'Email'|'LastLogin'|'Active'|'UserRole';

// export interface IFilterTest {
// 	filter: string;
// 	test: string;
// }

export interface IUserListFilter {
	// clientNameFilter: string;
	firstNameFilter: string;
	lastNameFilter: string;
	phoneFilter: string;
	emailFilter: string;
	lastLoginFilter: string;
	lastLoginOpFilter: IFilterOperator;
	activeFilter: string;
	userRoleFilter: string;
}

export interface IChangeUserRoleModel {
	UserName: string;
	SecurityRole: string;
}

export interface IUpdatePasswordModel {
	UserId: number;
	UserName: string;
	NewPassword: string;
}

export interface IUserNoteListInfo {
	noteList: IUserNote[];
	noteCount: number;
	currentPage: number;
	pageSize: number;
}

export interface IUserNote extends IUpdateNoteModel {
	// NoteId: number;
	NoteType?: string;
	// LinkedId?: number;
	// Note: string;
	Created?: string|Date;
	EditBy?: number;
	EditByName?: string;
}

export interface ISaveNewNoteModel {
	Note: string;
	LinkedId: number;
}

export interface IUpdateNoteModel extends ISaveNewNoteModel {
	NoteId: number;
}

export type IUserNoteListSort = 'Created'|'EditByName'|'Note';

export interface IUserNoteListFilter {
	createDateFilter: string;
	createDateOpFilter: IFilterOperator
	editByNameFilter: string;
	noteFilter: string;
}

export interface IDeliverByEmailOption {
	Id: number;
	Email: string;
	UseForTaskReminder: boolean;
}

export interface IDeliverBySmsOption {
	Id: number;
	SmsNumber: string;
	SpId: number; // SMS Provider Id
	SpName: string;
	UseForTaskReminder: boolean;
}
