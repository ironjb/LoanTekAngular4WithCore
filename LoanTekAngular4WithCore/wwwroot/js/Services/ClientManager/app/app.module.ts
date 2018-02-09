import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { AppComponent } from './app.component';
import { ClientService } from './shared/index';
import { ClientDetailTabCompmonent, ClientInfoCompmonent, BillingHistoryTabCompmonent, BillingHistoryListCompmonent
	, CreditCardsCompmonent, CreditCardEditCompmonent } from './detail/index';
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
		, DropDownsModule
	],
	declarations: [
		AppComponent
		, ClientDetailTabCompmonent
		, ClientInfoCompmonent
		, BillingHistoryTabCompmonent
		, BillingHistoryListCompmonent
		, CreditCardsCompmonent
		, CreditCardEditCompmonent
	],
	providers: [
		ClientService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
