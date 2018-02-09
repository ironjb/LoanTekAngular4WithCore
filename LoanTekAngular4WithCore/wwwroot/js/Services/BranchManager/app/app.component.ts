import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { JQUERY_TOKEN, TOASTR_TOKEN, SimpleModalComponent, multipleCheckRequireOne } from 'ltCommon/index';
import { IClientBranchesInfo, IBranch, INewBranchAssets, IBranchManager, IBranchUser, IPricingRule
	, ISaveBranchModel, IAddBranchUsersModel, ICurrentBranchUser, ICheckedItem
	, IBranchFormGroupModel, IAddUsersFormGroupModel, BranchService } from './shared/index';
import { DeleteBranchComponent } from './delete-branch.component';

@Component({
	selector: 'my-app',
	templateUrl: './app.component.html',
	styles: [`
		.checkbox-group-height {
			height: 12rem;
			overflow: auto;
		}
	`]
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('addBranchModal') addBranchModal: SimpleModalComponent;
	@ViewChild('addUsersModal') addUsersModal: SimpleModalComponent;
	@ViewChild('deleteBranchModalComp') deleteBranchModalComp: DeleteBranchComponent;
	@ViewChild('removeBranchUserModal') removeBranchUserModal: SimpleModalComponent;
	clientBranchInfo: IClientBranchesInfo;
	currentBranch: IBranch;
	newBranchAssets: INewBranchAssets;
	disableShowAddBranchModalBtn: boolean = false;
	disableAddBranchBtn: boolean = false;
	disableAddUsersBtn: boolean = false;
	disableRemoveUserBtn: boolean = false;
	showAddBranchError: boolean = false;
	addBranchErrorText: string = '';
	showAddUsersError: boolean = false;
	addUsersErrorText: string = '';
	currentBranchUser: ICurrentBranchUser = null;
	isAddManager: boolean = false;
	private getNewBranchAssetsPromise: Promise<INewBranchAssets>;

	addBranchFG: FormGroup;
	addUsersFG: FormGroup;

	constructor(private branchService: BranchService, @Inject(JQUERY_TOKEN) private $: JQueryStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr, private formBuilder: FormBuilder) {}

	// #region Init
		ngOnInit() {
			// Set Up Forms
			this.addBranchFG = this.formBuilder.group({
				branchName: ['', Validators.required]
				, branchManagers: this.formBuilder.array([])
				, branchUsers: this.formBuilder.array([])
				, pricingRules: this.formBuilder.array([])
			});
			this.addUsersFG = this.formBuilder.group({
				auBranchUsers: this.formBuilder.array([])
			});

			// Get Branch data
			this.getAllBranchInfo();

			// Gets this data in the background
			this.getNewBranchAssetsPromise = this.branchService.getNewBranchAssets();
			this.getNewBranchAssetsPromise.then(branchAssets => {
				this.newBranchAssets = branchAssets;
				window.console && console.info('Done getting newBranchAssets');
			}).catch(this.handleError);
		}

		ngAfterViewInit() {
			// Focus on Add Branch Modal
			this.addBranchModal.modalEventHandler('shown.bs.modal', (e: Event) => {
				this.$('#NewBranchName').focus();
			});
		}

		get	branchName() { return this.addBranchFG.get('branchName'); }
		get branchManagers() { return this.addBranchFG.get('branchManagers'); }
		get branchUsers() { return this.addBranchFG.get('branchUsers'); }
		get pricingRules() { return this.addBranchFG.get('pricingRules'); }
		get auBranchUsers() { return this.addUsersFG.get('auBranchUsers'); }
	// #endregion

	// #region New Branch
		showAddBranch(e: Event) {
			e.preventDefault();

			this.disableShowAddBranchModalBtn = true;
			this.resetAddBranch();

			this.getOrUpdateNewBranchAssets(this.clientBranchInfo.ActiveUser.ClientId).then(branchAssets => {
				this.setAllCheckboxListFormArrays(branchAssets);
				this.showAddBranchModal();
			}).catch(this.handleError);
		}

		setAllCheckboxListFormArrays(branchAssets: INewBranchAssets) {
			this.setCheckboxListFormArray(this.addBranchFG, 'branchManagers', branchAssets.BranchManagers);
			this.setCheckboxListFormArray(this.addBranchFG, 'branchUsers', branchAssets.BranchUsers);
			this.setCheckboxListFormArray(this.addBranchFG, 'pricingRules', branchAssets.PricingRules);
		}

		addBranch(e: Event) {
			e.preventDefault();
			this.disableAddBranchBtn = true;
			this.resetAddBranchError();

			if (this.addBranchFG.invalid) {
				this.branchName.markAsTouched();
				this.branchManagers.markAsTouched();
				this.branchUsers.markAsTouched();
				this.pricingRules.markAsTouched();
				this.disableAddBranchBtn = false;
				this.showAddBranchError = true;
				this.addBranchErrorText = 'Please update the required fields';
			} else {
				let bModel: IBranchFormGroupModel = this.addBranchFG.value;
				let bManagers: number[] = bModel.branchManagers.filter(fbm => fbm.isChecked).map(bm => bm.id);
				let bUsers: number[] = bModel.branchUsers.filter(fbu => fbu.isChecked).map(bu => bu.id);
				let pricingRules: number[] = bModel.pricingRules.filter(fpr => fpr.isChecked).map(pr => pr.id);

				let branchModel: ISaveBranchModel = {
					ClientId: this.clientBranchInfo.ActiveUser.ClientId
					, ActiveUserId: this.clientBranchInfo.ActiveUser.UserId
					, BranchName: bModel.branchName
					, ManagerUserIds: bManagers
					, UserIds: bUsers
					, PricingRuleIds: pricingRules
				};

				this.branchService.saveBranch(branchModel).then(response => {
					if (response) {
						this.getAllBranchInfo(() => {
							this.addBranchModal.closeModal();
							this.disableAddBranchBtn = false;
							this.resetAddBranch();
						});
					}
				}).catch(this.handleAddBranchError());
			}
		}

		private showAddBranchModal() {
			this.$('#addBranchModal').modal({});
			this.disableShowAddBranchModalBtn = false;
			this.disableAddBranchBtn = false;
		}

		private resetAddBranch() {
			this.addBranchFG.reset({branchName: ''});
			this.resetAddBranchError();
		}

		private handleAddBranchError() {
			let _this = this;
			return function (error: Response) {
				window.console && console.error('ERROR:', error);
				_this.disableAddBranchBtn = false;
				_this.showAddBranchError = true;
				_this.addBranchErrorText = error['_body'];
				return Observable.throw(error.statusText);
			}
		}

		private resetAddBranchError() {
			this.showAddBranchError = false;
			this.addBranchErrorText = '';
		}
	// #endregion

	// #region Add Manager/User
		showAddBranchUser(e: Event, buttonId: string, branch: IBranch, isManager: boolean) {
			e.preventDefault();
			this.disableButton(buttonId, true);
			this.currentBranch = branch;
			this.isAddManager = isManager;
			this.resetAddUser();

			this.getNewBranchAssetsPromise.then(branchAssets => {
				// Show only remaining available users to choose from
				let currentBranchUsersList = this.newBranchAssets.BranchManagers.filter(branchMgr => {
					let idList: number[] = isManager ? branch.BranchManagers.map(bm => bm.UserId) : branch.BranchUsers.map(bu => bu.userid);
					return idList.indexOf(branchMgr.userid) === -1;
				});
				this.setCheckboxListFormArray(this.addUsersFG, 'auBranchUsers', currentBranchUsersList);

				// Open Modal
				this.disableAddUsersBtn = false;
				this.$('#addUsersModal').modal({});
				this.disableButton(buttonId, false);
			}).catch(this.handleError);
		}

		addBranchUsers(e: Event, branch: IBranch) {
			e.preventDefault();
			this.disableAddUsersBtn = true;
			this.resetAddUsersError();

			if (this.addUsersFG.invalid) {
				this.auBranchUsers.markAsTouched();
				this.disableAddUsersBtn = false;
				this.showAddUsersError = true;
				this.addUsersErrorText = 'Please update the required fields';
			} else {
				let auModel: IAddUsersFormGroupModel = this.addUsersFG.value;
				let abUsers: number[] = auModel.auBranchUsers.filter(fau => fau.isChecked).map(au => au.id);

				let usersModel: IAddBranchUsersModel = {
					ClientId: this.clientBranchInfo.ActiveUser.ClientId
					, ActiveUserId: this.clientBranchInfo.ActiveUser.UserId
					, BranchId: branch.BranchId
					, UserIds: abUsers
				};

				this.branchService.addUsers(usersModel, this.isAddManager).then(response => {
					if (response) {
						this.getAllBranchInfo(() => {
							this.addUsersModal.closeModal();
							this.disableAddUsersBtn = false;
							this.resetAddUser();
							this.resetAddUsersError();
						});
					}
				}).catch(this.handleAddUsersError());
			}
		}

		private resetAddUser() {
			this.addUsersFG.reset();
			this.resetAddUsersError();
		}

		private handleAddUsersError() {
			return (error: Response) => {
				window.console && console.error('ERROR:', error);
				this.disableAddUsersBtn = false;
				this.showAddUsersError = true;
				this.addUsersErrorText = error['_body'];
				return Observable.throw(error.statusText);
			}
		}

		private resetAddUsersError() {
			this.showAddUsersError = false;
			this.addUsersErrorText = '';
		}
	// #endregion

	// #region Delete Branch
		confirmDeleteBranch(e: Event, branch: IBranch) {
			e.preventDefault();
			e.stopPropagation();
			this.currentBranch = branch;
			this.deleteBranchModalComp.showDeleteBranchModal();
		}
	// #endregion

	// #region Remove User
		confirmRemoveUser(e: Event, branch: IBranch, branchUser: IBranchUser|IBranchManager, isBranchManager: boolean) {
			e.preventDefault();
			e.stopPropagation();
			this.currentBranch = branch;

			if (isBranchManager) {
				this.currentBranchUser = {
					id: (<IBranchManager>branchUser).UserId
					, name: branchUser.FullName
					, email: (<IBranchManager>branchUser).Email
					, isManager: true
					, userObject: branchUser
				};
			} else {
				this.currentBranchUser = {
					id: (<IBranchUser>branchUser).userid
					, name: branchUser.FullName
					, email: (<IBranchUser>branchUser).email
					, isManager: false
					, userObject: branchUser
				};
			}
			// window.console && console.log('branchUser', isBranchManager, branchUser);
			this.disableRemoveUserBtn = false;
			this.$('#removeUserModal').modal({});
		}

		removeUser(e: Event, currentUser: ICurrentBranchUser, currentBranch: IBranch) {
			e.preventDefault();
			this.disableRemoveUserBtn = true;

			this.branchService.deleteUser(this.clientBranchInfo.ActiveUser.ClientId,currentBranch.BranchId, currentUser.id, currentUser.isManager).then((response) => {
				if (response) {
					this.removeBranchUserModal.closeModal();
					this.disableRemoveUserBtn = false;

					if (currentUser.isManager) {
						let indexOfManager = currentBranch.BranchManagers.indexOf(<IBranchManager>currentUser.userObject);
						if (indexOfManager !== -1) {
							currentBranch.BranchManagers.splice(indexOfManager,1);
						}
					} else {
						let indexOfUser = currentBranch.BranchUsers.indexOf(<IBranchUser>currentUser.userObject);
						if (indexOfUser !== -1) {
							currentBranch.BranchUsers.splice(indexOfUser,1);
						}
					}
				} else {
					this.disableRemoveUserBtn = false;
					this.toastr.error('Error removing user from branch', null, { closeButton: true });
					window.console && console.error('Error in removing user from branch. Response:\n', response);
				}
			}).catch(this.handleError);
		}
	// #endregion

	// #region Shared Methods
		getAllBranchInfo(callback?: () => void) {
			this.branchService.getAllClientBranches().then(branchInfo => {
				this.clientBranchInfo = branchInfo;

				if (callback) {
					callback();
				}
			}).catch(this.handleError);
		}

		setCheckboxListFormArray(formGroup: FormGroup, controlName: string, assetList: (IBranchUser|IPricingRule)[]) {
			let checkFGs: FormGroup[] = (<(IBranchUser|IPricingRule)[]>assetList).map(assetItem => {
				let aId: number = (<IPricingRule>assetItem).RuleId || (<IBranchUser>assetItem).userid || null;
				let aName: string = (<IPricingRule>assetItem).RuleDescription || (<IBranchUser>assetItem).FullName || null;
				let checkItem: ICheckedItem = { id: aId, name: aName, isChecked: false };
				return this.formBuilder.group(checkItem);
			});
			let checkFA = this.formBuilder.array(checkFGs, multipleCheckRequireOne('isChecked'));
			formGroup.setControl(controlName, checkFA);
		}

		checkAllGroup(formArray: FormArray, keyName: string, isChecked?: boolean) {
			formArray.markAsTouched();
			formArray.markAsDirty();
			for (var facI = 0, facL = formArray.controls.length; facI < facL; facI++) {
				let formGroup = formArray.controls[facI];
				formGroup.patchValue({ isChecked: !!isChecked });
			}
		}

		isInvalidDirtyTouched(control: AbstractControl) {
			return control.invalid && (control.dirty || control.touched);
		}

		private getOrUpdateNewBranchAssets(clientId: number): Promise<INewBranchAssets> {
			if (this.newBranchAssets) {
				return this.branchService.getUsersWithNoBranch(clientId).then(branchUsers => {
					this.newBranchAssets.BranchUsers = branchUsers;
					return this.newBranchAssets;
				});
			} else {
				return this.getNewBranchAssetsPromise;
			}
		}

		private populateBranchArray(branchAssetList: (IBranchUser|IPricingRule)[], checkedObj: Object, branchPrefix: string): number[] {
			let bArr: number[] = [];

			for (var baI = 0, baL = branchAssetList.length; baI < baL; baI++) {
				let baItem = branchAssetList[baI];
				let baId: number = (<IPricingRule>baItem).RuleId || (<IBranchUser>baItem).userid || null;

				if (baId) {
					let bChckName: string = branchPrefix + baId.toString();

					if (checkedObj[bChckName]) {
						bArr.push(baId);
					}
				}
			}

			return bArr;
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

		private disableButton(buttonId: string, disableBtn: boolean) {
			if (disableBtn) {
				this.$(`#${buttonId}`).addClass('btn-loading').prop('disabled', true);
			} else {
				this.$(`#${buttonId}`).removeClass('btn-loading').prop('disabled', false);
			}
		}
	// #endregion
}
