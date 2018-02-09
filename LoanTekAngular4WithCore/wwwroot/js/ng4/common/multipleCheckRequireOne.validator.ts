import { FormArray, ValidatorFn } from '@angular/forms';

export function multipleCheckRequireOne(keyName?: string): ValidatorFn {
	return (formArray: FormArray): {[key: string]: boolean} => {
		let valid = false;

		for (var faI = 0; faI < formArray.length; faI++) {
			if (keyName) {
				if (formArray.at(faI).value[keyName]) {
					valid = true;
					break;
				}
			} else {
				if (formArray.at(faI).value) {
					valid = true;
					break;
				}
			}
		}
		return valid ? null : { multipleCheckRequireOne: true };
	};
}
