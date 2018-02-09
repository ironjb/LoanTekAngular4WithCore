import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonMethodsService } from './commonMethods.service';

export interface IPagingChangeInfo {
	page: number;
	pageSize: number;
}

export interface IPageSizeOption {
	value: number;
	display?: string;
}

@Component({
	selector: 'paging'
	, templateUrl: './paging.component.html'
})
export class PagingComponent implements OnInit, OnChanges {
	@Input() elementid: string = 'Paging';
	@Input() cssclass: string = 'form-row align-content-start justify-content-center';
	@Input() page: number = 1;
	@Input() totalcount: number = 1;
	@Input() pagesize: number = 10;
	@Input() pagesizeclass: string = '';
	@Input() numericbtncount: number = 5;
	@Input() hidetotals: boolean = false;
	@Input() displaytextclass: string = 'ml-auto';
	@Input() pagesizingoptions: IPageSizeOption[] = [ { value: 10 }, { value: 20 }, { value: 50 } ];
	@Input() displaytext: string = '#{startCount} - #{endCount} of #{totalCount}';	// <-- You can include any of the following: #{page}, #{lastPage}, #{startCount}, #{endCount}, and #{totalCount}
	@Output() pagechange: EventEmitter<IPagingChangeInfo> = new EventEmitter();
	pageCount: number;
	firstNumericButton: number;
	numericBtnArray: number[] = [];
	displayStartCount: number;
	displayEndCount: number;
	displayCountsText: string;
	pageSizeFG: FormGroup;

	constructor(private formBuilder: FormBuilder, private cm: CommonMethodsService) {}

	ngOnInit() {
		this.pageSizeFG = this.formBuilder.group({
			pageSizeCtrl: this.pagesize
		});
	}

	get	pageSizeCtrl() { return this.pageSizeFG.get('pageSizeCtrl'); }

	ngOnChanges() {
		this.pageCount = (this.pagesize < 1) ? 1 : Math.ceil(this.totalcount / this.pagesize);
		this.firstNumericButton = (Math.floor((this.page - 1) / this.numericbtncount) * this.numericbtncount) + 1;
		this.numericBtnArray.length = 0;

		this.displayStartCount = (this.pagesize * (this.page - 1) + 1);
		this.displayEndCount = (this.pagesize * this.page) > this.totalcount ? this.totalcount : this.pagesize * this.page;

		if (this.pageSizeFG) {
			this.pageSizeCtrl.patchValue(this.pagesize);
		}

		this.displayCountsText = this.cm.Interpolate(this.displaytext, { page: this.page, lastPage: this.pageCount, startCount: this.displayStartCount, endCount: this.displayEndCount, totalCount: this.totalcount });

		let lastNumericButton: number = this.firstNumericButton + this.numericbtncount - 1;
		lastNumericButton = (lastNumericButton > this.pageCount) ? this.pageCount : lastNumericButton;

		for (var i = this.firstNumericButton; i <= lastNumericButton; i++) {
			this.numericBtnArray.push(i);
		}
	}

	setPage(pg: number) {
		if (pg !== this.page) {
			this.pagechange.emit({ page: pg, pageSize: this.pagesize });
		}
	}

	setPageSize() {
		let pgSize = +this.pageSizeCtrl.value;
		this.pagechange.emit({ page: 1, pageSize: pgSize });
	}
}
