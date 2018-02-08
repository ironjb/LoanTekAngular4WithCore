import { AbstractControl, Validators, ValidationErrors } from '@angular/forms';

// This custom email validator allows the email field to be blank. Only shows error if something invalid is typed.
export function customEmailValidator(control: AbstractControl): ValidationErrors {
	if (!control.value) {
		return null;
	}
	return Validators.email(control);
}
