import { Directive, OnInit, Inject, ElementRef, Input } from '@angular/core';
import { JQUERY_TOKEN } from './jquery.service';

@Directive({
	selector: '[modal-trigger]'
})
export class ModalTriggerDirective implements OnInit {
	@Input('modal-trigger') modalId: string;
	private el: HTMLElement;

	constructor(elRef: ElementRef, @Inject(JQUERY_TOKEN) private $: JQueryStatic) {
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
		this.el.addEventListener('click', e => {
			this.$(`#${this.modalId}`).modal({});
		});
	}
}
