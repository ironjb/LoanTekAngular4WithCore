import './rxjs-extensions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BranchService } from './shared/index';
import { DeleteBranchComponent } from './delete-branch.component';
import { LtCommonModule } from 'ltCommon/ltCommon.module'

@NgModule({
	imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, LtCommonModule],
	declarations: [AppComponent, DeleteBranchComponent],
	providers: [
		BranchService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
