import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, Inject, NgZone } from '@angular/core';
import { JQUERY_TOKEN } from './jquery.service';

type eventTypeString = 'show.bs.modal' | 'shown.bs.modal' | 'hide.bs.modal' | 'hidden.bs.modal';

@Component({
	selector: 'simple-modal'
	, templateUrl: './simpleModal.component.html'
})
export class SimpleModalComponent implements OnInit {
	@Input() modalTitle: string;
	@Input() elementId: string;
	@Input() modalSizeClass: string;
	@Input() titleBgClass: string;
	@Input() titleColorClass: string;
	@Output() onHide = new EventEmitter();
	@Output() onHidden = new EventEmitter();
	@Output() onShow = new EventEmitter();
	@Output() onShown = new EventEmitter();
	@ViewChild('modalContainer') containerEl: ElementRef;

	constructor(@Inject(JQUERY_TOKEN) private $: JQueryStatic, private zone: NgZone) {}

	ngOnInit() {
		this.modalEventHandler('hide.bs.modal', e => this.onHide.emit(e));
		this.modalEventHandler('hidden.bs.modal', e => this.onHidden.emit(e));
		this.modalEventHandler('show.bs.modal', e => this.onShow.emit(e));
		this.modalEventHandler('shown.bs.modal', e => this.onShown.emit(e));
	}

	closeModal() {
		this.$(this.containerEl.nativeElement).modal('hide');
	}

	openModal() {
		this.$(this.containerEl.nativeElement).modal('show');
	}

	modalOptions(opts: string|ModalOptions|ModalOptionsBackdropString) {
		this.$(this.containerEl.nativeElement).modal(<any>opts);
	}

	modalEventHandler(eventType: eventTypeString, onFunction: (e: Event) => void) {
		this.$(this.containerEl.nativeElement).on(eventType, (e:Event) => {
			e.stopPropagation();
			// Needs to run in Zone or Angular might not pick up changes
			this.zone.run(() => {
				onFunction(e);
			});
		});
	}
}
