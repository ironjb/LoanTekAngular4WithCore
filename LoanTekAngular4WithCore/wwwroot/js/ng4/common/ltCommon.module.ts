import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SimpleModalComponent, PagingComponent, ModalTriggerDirective, TooltipDirective, TabGroupDirective, TabGroupLinkDirective, TabGroupContentDirective
	, CommonMethodsService, TabClickEventService, multipleCheckRequireOne, customEmailValidator } from './index';
import { JQUERY_TOKEN } from './jquery.service';
import { TOASTR_TOKEN } from './toastr.service';
import { LODASH_TOKEN } from './lodash.service';

export let jQuery: JQueryStatic = window['jQuery'];
export let toastr: Toastr = window['toastr'];
export let lodash: _.LoDashStatic = window['_'];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		HttpModule
	],
	declarations: [
		SimpleModalComponent
		, PagingComponent
		, ModalTriggerDirective
		, TooltipDirective
		, TabGroupDirective
		, TabGroupLinkDirective
		, TabGroupContentDirective
	],
	providers: [
		CommonMethodsService,
		TabClickEventService,
		{ provide: JQUERY_TOKEN, useValue: jQuery },
		{ provide: TOASTR_TOKEN, useValue: toastr },
		{ provide: LODASH_TOKEN, useValue: lodash }
	],
	exports: [
		SimpleModalComponent
		, PagingComponent
		, ModalTriggerDirective
		, TooltipDirective
		, TabGroupDirective
		, TabGroupLinkDirective
		, TabGroupContentDirective
	]
})
export class LtCommonModule {}
