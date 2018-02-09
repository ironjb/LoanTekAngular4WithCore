import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { AppComponent } from './app.component';
import { UserService } from './shared/index';
import { AddNewUserCompmonent, UserDetailTabCompmonent, UserInfoCompmonent, UserNotesCompmonent, LeadDeliveryOptionsCompmonent
	, LDO_EmailEditRowCompmonent } from './detail/index';
import { LtCommonModule } from 'ltCommon/ltCommon.module'

@NgModule({
	imports: [
		BrowserModule
		, BrowserAnimationsModule
		, HttpModule
		, ReactiveFormsModule
		, LtCommonModule
		// , BsDatepickerModule.forRoot()
		, IntlModule
		, DateInputsModule
		, InputsModule
		// , DropDownsModule
	],
	declarations: [
		AppComponent
		, AddNewUserCompmonent
		, UserDetailTabCompmonent
		, UserInfoCompmonent
		, UserNotesCompmonent
		, LeadDeliveryOptionsCompmonent
		, LDO_EmailEditRowCompmonent
	],
	providers: [
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
