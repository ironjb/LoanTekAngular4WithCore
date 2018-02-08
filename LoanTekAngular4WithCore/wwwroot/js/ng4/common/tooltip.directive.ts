import { Directive, Inject, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { JQUERY_TOKEN } from './jquery.service';

@Directive({
	selector: '[data-toggle="tooltip"]'
})
export class TooltipDirective implements OnInit, OnDestroy {
	private el: HTMLElement;

	constructor(elRef: ElementRef, @Inject(JQUERY_TOKEN) private $: JQueryStatic) {
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
		this.$(this.el).tooltip();
	}

	ngOnDestroy() {
		this.$(this.el).tooltip('dispose');
	}
}
