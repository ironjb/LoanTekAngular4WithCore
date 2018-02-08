import { Directive, OnInit, Inject, Input, ElementRef, ContentChildren, QueryList, AfterContentInit, HostListener, HostBinding, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LODASH_TOKEN } from './lodash.service';


export interface ITabServiceSubject {
	groupName: string;
	contentName: string;
}

@Injectable()
export class TabClickEventService {
	private _tabClickEvent = new Subject<ITabServiceSubject>();

	get tabClickEvent(): Observable<ITabServiceSubject> {
		return this._tabClickEvent.asObservable();
	}

	trigger(value: ITabServiceSubject) {
		this._tabClickEvent.next(value);
	}
}

@Directive({
	selector: '[tab-group-link]'
})
export class TabGroupLinkDirective implements OnInit {
	@Input('href') tabContentName: string;
	@Input('tab-group-link') tabGroupName: string;
	@HostBinding('class.active') isActiveTab: boolean = false;
	// elem: ElementRef;

	constructor(private el: ElementRef, private tabService: TabClickEventService) {
		// window.console && console.log('tablink el', el);
		// this.elem = el;
	}

	ngOnInit() {
		this.tabContentName = this.tabContentName.slice(1);
		// window.console && console.log('tabContentName', this.tabContentName);
	}

	@HostListener('click', ['$event']) onClick(e: Event) {
		// window.console && console.log('tab clicked', e);
		e.preventDefault();
		// alert('tab clicked');
		// this.isActiveTab = true;
		// window.console && console.log('hostlistener', { groupName: this.tabGroupName, contentName: this.tabContentName });
		this.tabService.trigger({ groupName: this.tabGroupName, contentName: this.tabContentName });
	}

	activateTab() {
		this.isActiveTab = true;
	}

	deactivateTab() {
		this.isActiveTab = false;
	}
}


@Directive({
	selector: '[tab-group-content]'
})
export class TabGroupContentDirective {
	@Input('id') tabContentName: string;
	@Input('tab-group-content') tabGroupName: string;
	@HostBinding('class.fade') isFadeClass: boolean = false;
	@HostBinding('class.show') isShowClass: boolean = false;
	@HostBinding('class.active') isActiveClass: boolean = false;
	private timeoutTime: number = 200;

	activateTab() {
		// window.console && console.log('clear timeout', this.removeActiveTimeout, 'end clear');
		if (this.isFadeClass) {
			setTimeout(() => {
				this.isActiveClass = true;
				this.isShowClass = true;
			}, this.timeoutTime);
		} else {
			this.isActiveClass = true;
		}
	}

	deactivateTab() {
		this.isShowClass = false;
		if (this.isFadeClass) {
			setTimeout(() => {
				// window.console && console.log('settimeout remove active');
				this.isActiveClass = false;
			}, this.timeoutTime);
		} else {
			this.isActiveClass = false;
		}
	}

	tabFade(isFade: boolean) {
		this.isFadeClass = isFade;
	}
}


@Directive({
	selector: '[tab-group]'
})
export class TabGroupDirective implements OnInit, AfterContentInit {
	@Input('tab-group') tabGroup: string;
	@Input('tab-fade') tabFade: boolean;
	@ContentChildren(TabGroupLinkDirective) tabLinks: QueryList<TabGroupLinkDirective>;
	@ContentChildren(TabGroupContentDirective) tabs: QueryList<TabGroupContentDirective>;

	constructor(private tabService: TabClickEventService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic) {}

	ngOnInit() {
		// window.console && console.log('tabGroup', this.tabGroup, this.tabLinks);
	}

	ngAfterContentInit() {
		// Filter out tabs for this group only
		let currentTabLinks = this.tabLinks.filter(tl => { return tl.tabGroupName === this.tabGroup });
		let currentTabs = this.tabs.filter(tb => { return tb.tabGroupName === this.tabGroup });
		if (this.tabFade) {
			currentTabs.forEach(tb => {tb.tabFade(true)});
		}
		// window.console && console.log('tabfade', this.tabFade);

		// Set active tab
		let activeTabIndex = this._.findIndex(currentTabLinks, tl => { return tl.isActiveTab === true; });
		activeTabIndex = activeTabIndex === -1 ? 0 : activeTabIndex;
		let initCorrTabLink = currentTabLinks[activeTabIndex];
		let initCorrTab = currentTabs.filter(tab => { return tab.tabContentName === initCorrTabLink.tabContentName })[0];
		if (initCorrTabLink && initCorrTab) {
			initCorrTabLink.activateTab();
			initCorrTab.activateTab();
		}
		// window.console && console.log('active Index', activeTabIndex);

		// Click event on Tab Links
		this.tabService.tabClickEvent.subscribe(tabInfo => {
			if (this.tabGroup === tabInfo.groupName) {
				// window.console && console.log('tabInfo', tabInfo, currentTabs.length);
				currentTabLinks.forEach(lnk => {
					// Get  corresponding tab content
					let corTab = currentTabs.filter(tab => { return tab.tabContentName === lnk.tabContentName})[0];
					if (corTab) {
						if (lnk.tabContentName === tabInfo.contentName) {
							lnk.activateTab();
							corTab.activateTab();
						} else {
							lnk.deactivateTab();
							corTab.deactivateTab();
						}
					} else {
						window.console && console.error('Error, no corresponding tab content.');
					}
				});
			}
		});
	}
}
