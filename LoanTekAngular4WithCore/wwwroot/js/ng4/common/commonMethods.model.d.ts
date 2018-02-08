export interface IState {
	abbreviation: string;
	name: string;
}

export interface IStates {
	country: string;
	states: IState[];
}

export interface ISelectOption {
	Text: string;
	Value: string|number;
}

export type IFilterOperator = 'cn'|'gt'|'gte'|'lt'|'lte'|'eq';
export type IFilterType = 'string'|'number'|'boolean'|'date'|'fuzzy';

export interface IFilterTest {
	filter: string;
	value: string;
	type?: IFilterType;
	operator?: IFilterOperator;
}

export interface ILoggedInUserInfo {
	ActiveClientId: number;
	ActiveUserId: number;
	ClientId: number;
	UserId: number;
	// IsLtAdmin: boolean;
	// IsClientAdmin: boolean;
	IsRole: {
		LoanTekAdmin: boolean;
		ClientAdmin: boolean;
		ClientSalesAdmin: boolean;
		ClientUser: boolean;
		ClientUserLMOnly: boolean;
	}
	Role: string;
}
