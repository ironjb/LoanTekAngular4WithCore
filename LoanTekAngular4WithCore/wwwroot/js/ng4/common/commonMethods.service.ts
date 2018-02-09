import { Injectable, Inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { JQUERY_TOKEN } from './jquery.service';
import 'rxjs/add/operator/toPromise';
import { test as fuzzyTest } from 'fuzzy';

import { IState, IStates, ISelectOption, IFilterTest, ILoggedInUserInfo } from './commonMethods.model';

@Injectable()
export class CommonMethodsService {
	constructor(private http: Http, @Inject(JQUERY_TOKEN) private $: JQueryStatic) {}

	/**
	 * Returns a random integer.
	 * @param  {number} intMax Maximum integer
	 * @param  {number}	intMin Minimum integer
	 * @return {number}        Returns a random integer.
	 */
	getRandomInt(maxInt?: number, minInt?: number): number {
		var returnNumber: number = 0;
		var defaultMax = 999999999;
		var maxVal = Number.MAX_VALUE - 1 || Math.pow(2,53) - 1 || defaultMax;
		var intMax = maxInt || defaultMax;
		var intMin = minInt || 0;

		// Max should not be less than or equal to 0
		if (intMax <= 0) { intMax = 1; }

		// Max should not be too high or may cause problems
		if (intMax > maxVal) { intMax = maxVal; }

		// Min should not be less than 0
		if (intMin < 0) { intMin = 0; }

		// Min should be less than Max
		if (intMin >= intMax) { intMin = intMax - 1; }

		intMax = intMax - intMin;

		returnNumber = Math.floor(Math.random() * (intMax + 1)) + intMin;
		return returnNumber;
	}

	/**
	 * Returns a string of random characters
	 * @param {number} length The lenght of the string you want to return
	 * @param {string} chars  The type of characters you want to include.
	 *                        Pass '#' to include numbers.
	 *                        Pass 'A' to include capital letters.
	 *                        Pass 'a' to include lowercase letters.
	 *                        Pass '!' to include special characters.
	 *                        Default is '#A'
	 * @return {string}       Returns a string of random characters.
	 */
	getRandomString(length?: number, chars?: string) {
		length = length || 16;
		chars = chars || '#A';
		var mask = '';
		if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
		if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		if (chars.indexOf('#') > -1) mask += '0123456789';
		if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
		var result = '';
		for (var i = length; i > 0; --i) {
			result += mask[Math.floor(Math.random() * mask.length)];
		}
		return result;
	}

	/**
	 * Returns the current time (or time passed as parameter) in 'ticks'.
	 * @param  {Date}   dateTime Optional. Pass a date as a parameter.
	 * @return {number}          Returns the number of 'ticks' for the date.
	 */
	getDateTimeTicks(dateTime?: Date): number {
		dateTime = dateTime || new Date();
		return dateTime.getTime();
	}

	/**
	 * Returns a unique string
	 * @param  {string} prefix         Prefix for the unique string
	 * @param  {number} lengthOfTicks  Uses a number of characters from the Date 'ticks'
	 * @param  {number} lengthOfRandom Length of the randome string
	 * @return {string}                Returns a string of random numbers and characters
	 */
	getUniqueQualifier(prefix?: string, lengthOfTicks?: number, lengthOfRandom?: number): string {
		var ticks: string = this.getDateTimeTicks() + '';
		var pfx = prefix || 'LT';

		var lots = lengthOfTicks || 2;
		lots = lots === -1 ? ticks.length : lots;
		lots = lots < 1 ? 1 : lots > ticks.length ? ticks.length : lots;

		var lor = lengthOfRandom || 4;
		lor = lor < 1 ? 1 : lor;
		return pfx + ticks.substring(ticks.length - lots, ticks.length) + this.getRandomString(lor);
	}

	/**
	 * Performs string interpolation similar to the style of Ruby
	 * @param  {string}   text       String to interpolate
	 * @param  {Object}   parameters Parameters passed in that will placed in the string
	 * @param  {Function} fn         Optional: function that performs additional modifications
	 * @param  {RegExp}   regex      Optional: new RegEx to use
	 * @return {string}              Return of updated string
	 */
	Interpolate(text: string, parameters: Object, fn?: Function, regex?: RegExp): string {
		// window.console && console.log('interpolate text', text, '\nparams', parameters);
		var txt = text || '';
		parameters = parameters || {};
		fn = fn || function (x: any) { return x; };
		regex = regex || /#{[^\}]+}/g;
		return txt.replace(regex, function (match, p1, offset, wholeString) {
			var returnValue: any;
			var indexOfStart = match.indexOf('{') + 1;
			var spaceFromEnd = match.length - match.indexOf('}');
			var key = match.substr(indexOfStart);
			key = key.substr(0, key.length - spaceFromEnd);
			var keySplit = key.split('.');

			returnValue = parameters[keySplit[0]];
			if (returnValue === 0) {
				returnValue = returnValue.toString();
			}
			// window.console && console.log('returnValue', returnValue);

			for (var iKey = 1; iKey < keySplit.length; iKey++) {
				var pathName = keySplit[iKey];
				returnValue = returnValue[pathName];
				if (!returnValue) {
					break;
				}
			}

			if (!returnValue) {
				window.console && console.warn('Interpolate Warning: Parameter not found for ' + match);
				returnValue = match;
			}
			return fn(returnValue);
		});
	}

	isNumber(numCheck: any): boolean {
		return typeof numCheck === 'number' && !isNaN(numCheck);
	}

	isValidDate(d: Date): boolean {
		if (Object.prototype.toString.call(d) === '[object Date]' && !isNaN(d.getTime())) {
			return true;
		}

		return false;
	}

	isStringNullOrEmpty(stringCheck: string): boolean {
		return stringCheck === '' || typeof stringCheck !== 'string';
	}

	/**
	 * Takes a number and returns that number as a string of a specific character length.
	 * Will include a padding of zeros in front to reach the required string length.
	 * @param  {number} num  Passing in the number
	 * @param  {number} size The length of the number including preceding zeros
	 * @return {string}      Returns a number as a string with a specific character length.
	 */
	padZeros(num: number, size: number): string {
		var s = num + '';
		while (s.length < size) {
			s = '0' + s;
		}
		return s;
	}

	/**
	 * Formats a number into a string
	 * @param  {number}  n                        The number passed in
	 * @param  {number}  decimalPlaces            How many decimal places to show
	 * @param  {boolean} useParentheseForNegative Uses parentheses for negative values
	 * @param  {string}  prefix                   Add a prefix to the number
	 * @param  {string}  suffix                   Add a suffix to the number
	 * @return {string}                           Returns a string of the formated number
	 */
	FormatNumber(n: number, decimalPlaces?: number, useParentheseForNegative?: boolean, prefix?: string, suffix?: string): string {
		useParentheseForNegative = useParentheseForNegative || false;
		prefix = prefix || '';
		suffix = suffix || '';
		var newNumber: string;
		var decimalPower: number;
		var isNeg: boolean = false;

		// Remove negative temporarily
		if (n < 0) {
			isNeg = true;
			n = -n;
		}

		// Round to decimal place
		if (this.isNumber(decimalPlaces)) {
			decimalPower = Math.pow(10, decimalPlaces);
			n = Math.round(n * decimalPower) / decimalPower;
		}

		// Add commas in number (note: toLocaleString() not used... does not work in Safari)
		var numberParts = n.toString().split('.');
		numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		// Add extra zeros at end
		if (decimalPlaces > 0) {
			numberParts[1] = numberParts[1] || '';
			while (numberParts[1].length < decimalPlaces) {
				numberParts[1] += '0';
			}
		}

		// Join parts together
		newNumber = numberParts.join('.');

		// Add prefix/suffix
		newNumber = prefix + newNumber + suffix;

		// Apply negative to string value
		if (isNeg) {
			newNumber = useParentheseForNegative ?  '(' + newNumber + ')' : '-' + newNumber;
		}

		return newNumber;
	}

	/**
	 * Scrolls to an anchor tag
	 * @param {string} anchorName  The name attribute of the anchor tag
	 * @param {number} scrollSpeed Speed of scroll. Default is 200.
	 * @param {number} topOffset   Offset from top of anchor tag (in pixels). Default is 50.
	 */
	ScrollToAnchor(anchorName: string, scrollSpeed?: number, topOffset?: number): void {
		var $ = this.$;
		scrollSpeed = scrollSpeed || 200;
		topOffset = topOffset || 50;
		let anchorElem = $('a[name=' + anchorName + ']');
		if (anchorElem.length) {
			$('html, body').animate({
				scrollTop: (anchorElem.offset().top) - topOffset
			}, scrollSpeed);
		}
	}

	sortFn<T>(sortBy: string, reverse?: boolean) {
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

	filterFn(filterTest: IFilterTest[]): boolean {
		// Never return true from inside the for loop.
		// Otherwise, one filter may include something that another filter later on should exlude.
		for (var fti = filterTest.length - 1; fti >= 0; fti--) {
			let fItem = filterTest[fti];

			if (fItem.type === 'date') {
				if (fItem.filter && fItem.value) {
					let dateFilter = new Date(fItem.filter);
					let dateValue = new Date(fItem.value);

					if (this.isValidDate(dateFilter) && this.isValidDate(dateValue)) {
						// Set Hours to zero to ignore hours
						dateFilter.setHours(0,0,0,0);
						dateValue.setHours(0,0,0,0)

						if (fItem.operator === 'eq') {
							if (!(dateValue.getTime() === dateFilter.getTime())) {
								return false;
							}
						} else if (fItem.operator === 'lt') {
							if (!(dateValue < dateFilter)) {
								return false;
							}
						} else if (fItem.operator === 'lte') {
							if (!(dateValue <= dateFilter)) {
								return false;
							}
						} else if (fItem.operator === 'gt') {
							if (!(dateValue > dateFilter)) {
								return false;
							}
						} else {
							if (!(dateValue >= dateFilter)) {
								return false;
							}
						}
					}
				} else if (fItem.filter && !fItem.value) {
					return false;
				}
			} else if (fItem.type === 'fuzzy') {
				let fuzzyResult = fuzzyTest(fItem.filter, fItem.value);
				if (!fuzzyResult) {
					return false;
				}
			} else {
				fItem.filter = fItem.filter || '';
				let isMatch: boolean = RegExp(fItem.filter, 'i').test(fItem.value);
				if (!isMatch) {
					return false;
				}
			}
		}

		return true;
	}

	getRequest<T>(getUrl: string): Promise<T> {
		return this.http.get(getUrl).toPromise().then((response: Response) => {
			return response.json() as T;
		});
	}

	postRequest<T>(postUrl: string, model: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(postUrl, model, options).toPromise().then((response: Response) => {
			return response.json() as T;
		});
	}

	deleteRequest<T>(deleteUrl: string): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.delete(deleteUrl, options).toPromise().then((response: Response) => {
			return response.json() as T;
		});
	}

	getLoggedInUserInfo(): Promise<ILoggedInUserInfo> {
		return this.getRequest<ILoggedInUserInfo>('/Services/Home/GetLoggedInUserInfo');
	}

	isInvalidDirtyOrTouched(control: AbstractControl) {
		return control.invalid && (control.dirty || control.touched);
	}

	isInvalidDirtyAndTouched(control: AbstractControl) {
		return control.invalid && (control.dirty && control.touched);
	}

	MonthList(): ISelectOption[] {
		return [
			{ Text: 'January', Value: 1 }
			, { Text: 'February', Value: 2 }
			, { Text: 'March', Value: 3 }
			, { Text: 'April', Value: 4 }
			, { Text: 'May', Value: 5 }
			, { Text: 'June', Value: 6 }
			, { Text: 'July', Value: 7 }
			, { Text: 'August', Value: 8 }
			, { Text: 'September', Value: 9 }
			, { Text: 'October', Value: 10 }
			, { Text: 'November', Value: 11 }
			, { Text: 'December', Value: 12 }
		];
	}

	US_States(): IState[] {
		var s: IState[] =[
			{ abbreviation: 'AL', name: 'Alabama' },
			{ abbreviation: 'AK', name: 'Alaska' },
			{ abbreviation: 'AZ', name: 'Arizona' },
			{ abbreviation: 'AR', name: 'Arkansas' },
			{ abbreviation: 'CA', name: 'California' },
			{ abbreviation: 'CO', name: 'Colorado' },
			{ abbreviation: 'CT', name: 'Connecticut' },
			{ abbreviation: 'DE', name: 'Delaware' },
			{ abbreviation: 'DC', name: 'District Of Columbia' },
			{ abbreviation: 'FL', name: 'Florida' },
			{ abbreviation: 'GA', name: 'Georgia' },
			{ abbreviation: 'HI', name: 'Hawaii' },
			{ abbreviation: 'ID', name: 'Idaho' },
			{ abbreviation: 'IL', name: 'Illinois' },
			{ abbreviation: 'IN', name: 'Indiana' },
			{ abbreviation: 'IA', name: 'Iowa' },
			{ abbreviation: 'KS', name: 'Kansas' },
			{ abbreviation: 'KY', name: 'Kentucky' },
			{ abbreviation: 'LA', name: 'Louisiana' },
			{ abbreviation: 'ME', name: 'Maine' },
			{ abbreviation: 'MD', name: 'Maryland' },
			{ abbreviation: 'MA', name: 'Massachusetts' },
			{ abbreviation: 'MI', name: 'Michigan' },
			{ abbreviation: 'MN', name: 'Minnesota' },
			{ abbreviation: 'MS', name: 'Mississippi' },
			{ abbreviation: 'MO', name: 'Missouri' },
			{ abbreviation: 'MT', name: 'Montana' },
			{ abbreviation: 'NE', name: 'Nebraska' },
			{ abbreviation: 'NV', name: 'Nevada' },
			{ abbreviation: 'NH', name: 'New Hampshire' },
			{ abbreviation: 'NJ', name: 'New Jersey' },
			{ abbreviation: 'NM', name: 'New Mexico' },
			{ abbreviation: 'NY', name: 'New York' },
			{ abbreviation: 'NC', name: 'North Carolina' },
			{ abbreviation: 'ND', name: 'North Dakota' },
			{ abbreviation: 'OH', name: 'Ohio' },
			{ abbreviation: 'OK', name: 'Oklahoma' },
			{ abbreviation: 'OR', name: 'Oregon' },
			{ abbreviation: 'PA', name: 'Pennsylvania' },
			{ abbreviation: 'RI', name: 'Rhode Island' },
			{ abbreviation: 'SC', name: 'South Carolina' },
			{ abbreviation: 'SD', name: 'South Dakota' },
			{ abbreviation: 'TN', name: 'Tennessee' },
			{ abbreviation: 'TX', name: 'Texas' },
			{ abbreviation: 'UT', name: 'Utah' },
			{ abbreviation: 'VT', name: 'Vermont' },
			{ abbreviation: 'VA', name: 'Virginia' },
			{ abbreviation: 'WA', name: 'Washington' },
			{ abbreviation: 'WV', name: 'West Virginia' },
			{ abbreviation: 'WI', name: 'Wisconsin' },
			{ abbreviation: 'WY', name: 'Wyoming' }
		];
		return s;
	}
}
