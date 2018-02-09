// import './rxjs-extensions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { PrintReceiptComponent } from './print-receipt.component';

@NgModule({
	imports: [
		BrowserModule
		, BrowserAnimationsModule
		, HttpModule
	],
	declarations: [
		PrintReceiptComponent
	],
	providers: [
	],
	bootstrap: [PrintReceiptComponent]
})
export class PrintReceiptModule {}
