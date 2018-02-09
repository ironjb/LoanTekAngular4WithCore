import './rxjs-extensions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BranchService } from './shared/index';
// import { /*LtCommonModule, JQUERY_TOKEN, TOASTR_TOKEN, ModalTriggerDirective*//*, SimpleModalComponent*/ } from './common/index';
import { DeleteBranchComponent } from './delete-branch.component';
// import { LtCommonModule } from './../../../../../Scripts/ng4/common/ltCommon.module'
import { LtCommonModule } from 'ltCommon/ltCommon.module'

// export let jQuery: JQueryStatic = window['jQuery'];
// export let toastr: Toastr = window['toastr'];

@NgModule({
	imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, LtCommonModule],
	declarations: [AppComponent, /*ModalTriggerDirective, SimpleModalComponent,*/ DeleteBranchComponent],
	providers: [
		BranchService/*,
		{ provide: JQUERY_TOKEN, useValue: jQuery },
		{ provide: TOASTR_TOKEN, useValue: toastr }*/
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
