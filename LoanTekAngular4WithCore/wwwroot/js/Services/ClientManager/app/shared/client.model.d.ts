import { ILoggedInUserInfo } from 'ltCommon/index';

export interface IClientListInfo {
	clientList: IClientRow[];
	loggedInUserInfo: ILoggedInUserInfo;
	clientCount: number;
	currentPage: number;
	pageSize: number;
}

export interface IClientRow {
	City: string;
	ClientId: number;
	Company: string;
	Contact?: string;
	Email: string;
	Phone: string;
	State: string;
	Status?: string;
}

export interface IClient extends IClientRow {
	ContactUserId: number;
	Address: string;
	Zip: string;
	Fax: string;
	Created: string|Date;
	LastEdit: string|Date;
	IpAddress: string;
	UserId: string;
	Status_Id: number;
	Url: string;
	Alternate_Email: string;
	LicenseRenewaldate: string|Date;
	BillingFrequency: number;
	CompanyNmls: string;
	NationalLender: boolean;
	BypassCreditCardPayment: boolean;
	ResetDailyLeadQuota: boolean;
	DropDownDisplay: string;
	SalesRep?: number;
	SalesRepName: string;
	CustomerServiceRep?: number;
	CustomerServiceRepName: string;
	PricingUserId: number;
}

export type IClientListSort = 'ClientId'|'Company'|'Contact'|'Phone'|'Email'|'City'|'State'|'Status';

export interface IClientListFilter {
	companyFilter: string;
	contactFilter: string;
	phoneFilter: string;
	emailFilter: string;
	cityFilter: string;
	stateFilter: string;
	statusFilter: string;
}

export interface ISelectOption {
	Text: string;
	Value: string|number;
}

export interface IClientUser {
	UserId: number;
	User: string;
	Active?: boolean;
}

export interface IBillHistoryInfo {
	billHistoryList: IBillingHistory[];
	billHistoryCount: number;
	currentPage: number;
	pageSize: number;
}

export interface IBillingHistory {
	PaymentComments: string;
	PaymentType: string;
	PaymentAmount: number;
	PaymentDate: string;
	PaymentStatus: string;
	PaymentResponse: string;
	BillingSystemVersion: number;
	InvoiceId: number;
}

export type IBillingHistorySort = 'PaymentComments'|'PaymentType'|'PaymentStatus'|'PaymentDate'|'PaymentAmount';

export interface IBillingHistoryFilter {
	paymentCommentsFilter: string;
	paymentTypeFilter: string;
	paymentStatusFilter: string;
}

export interface IInvoicingModel {
	ClientId: number;
	InvoiceId: number;
	BillingVersion: number;
}

export interface IInvoicingPrintModel {
	PaymentDate?: string|Date;
	PaymentResponse?: string;
	CustomerName?: string;
	CardType?: string;
	ReferenceNumber?: string;
	FormattedCardNumber?: string;
	PaymentAmount?: number;
	AppCode?: string;
	AppMessage?: string;
	AvsResponse?: string;
	CscRepsonse?: string;
	InvoiceNumber?: string;
	InvoiceComments?: string;
}

export interface IClientChange {
	ClientId: number;
	EditBy: number;
	EditByName: string;
	Edited: string|Date;
	WhatChanged: string;
	Note: string;
}

export interface ISave {

}

export interface ISalesRepModel {
	ClientId: number;
	SalesRepUserId: number;
}

export interface ICustomerServiceRepModel {
	ClientId: number;
	CustomerServiceRepUserId: number;
}

export interface IPrimaryContactModel {
	ClientId: number;
	NewUserId: number;
	RemoveCurrentUserFromAdminRole: boolean;
}

export interface IRenewalDateModel {
	ClientId: number;
	RenewalDate: Date;
	ReasonForChange: string;
}

export interface IBillingFrequencyModel {
	ClientId: number;
	BillingFrequency: number;
}

export interface IClientSaveModel {
	Client: IClient;
	ChangeNotes: string;
}

export interface ICreditCardModel {
	CardId?: number;
	Created?: string|Date;
	ClientId?: number;
	CardType?: string;
	CardStatus?: string;
	FirstName?: string;
	LastName?: string;
	Phone?: string;
	Address1?: string;
	Address2?: string;
	City?: string;
	State?: string;
	Zip?: string;
	Country?: string;
	ExpirationMonth?: number;
	ExpirationYear?: number;
	CVV?: string;
	Number?: string;
	DecryptedNumber?: string;
	Name?: string;
}
