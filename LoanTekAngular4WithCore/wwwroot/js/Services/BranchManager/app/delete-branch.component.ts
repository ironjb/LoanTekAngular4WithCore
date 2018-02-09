import { Component, Input, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { JQUERY_TOKEN, TOASTR_TOKEN, SimpleModalComponent } from 'ltCommon/index';
import { IClientBranchesInfo, IBranch, BranchService } from './shared/index';

@Component({
	selector: 'delete-branch'
	, templateUrl: './delete-branch.component.html'
})
export class DeleteBranchComponent {
	@Input() clientBranchInfo: IClientBranchesInfo;
	@Input() currentBranch: IBranch;
	@ViewChild('deleteBranchModal') deleteBranchModal: SimpleModalComponent;
	disableDeleteBranchBtn: boolean = false;

	constructor(private branchService: BranchService, @Inject(JQUERY_TOKEN) private $: JQueryStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr) {}

	showDeleteBranchModal() {
		this.disableDeleteBranchBtn = false;
		this.$('#deleteBranchModal').modal({});
	}

	deleteBranch(e: Event, branch: IBranch) {
		e.preventDefault();
		this.disableDeleteBranchBtn = true;

		this.branchService.deleteBranch(this.clientBranchInfo.ActiveUser.ClientId, branch.BranchId).then((response) => {
			if (response) {
				this.deleteBranchModal.closeModal();
				this.disableDeleteBranchBtn = false;

				let indexOfBranch = this.clientBranchInfo.Branches.indexOf(branch);
				if (indexOfBranch !== -1) {
					this.clientBranchInfo.Branches.splice(indexOfBranch,1);
				}

				this.toastr.success('The branch was DELETED', null, { closeButton: true });
			} else {
				this.disableDeleteBranchBtn = false;
				this.toastr.error('Error deleting branch', null, { closeButton: true });
				window.console && console.error('Error in deleting branch. Response:\n', response);
			}
		}).catch(this.handleError);
	}

	private handleError(error: Response) {
		window.console && console.error('ERROR:', error);
		return Observable.throw(error.statusText);
	}
}
