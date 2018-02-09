webpackJsonp([0],{

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var platform_browser_dynamic_1 = __webpack_require__(214);
var app_module_1 = __webpack_require__(805);
window.console && console.log('Running JIT compiled');
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
__webpack_require__(806);
var core_1 = __webpack_require__(1);
var platform_browser_1 = __webpack_require__(46);
var http_1 = __webpack_require__(137);
var forms_1 = __webpack_require__(20);
var app_component_1 = __webpack_require__(807);
var index_1 = __webpack_require__(809);
// import { /*LtCommonModule, JQUERY_TOKEN, TOASTR_TOKEN, ModalTriggerDirective*//*, SimpleModalComponent*/ } from './common/index';
var delete_branch_component_1 = __webpack_require__(811);
// import { LtCommonModule } from './../../../../../Scripts/ng4/common/ltCommon.module'
var ltCommon_module_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ltCommon/ltCommon.module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// export let jQuery: JQueryStatic = window['jQuery'];
// export let toastr: Toastr = window['toastr'];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, ltCommon_module_1.LtCommonModule],
        declarations: [app_component_1.AppComponent, /*ModalTriggerDirective, SimpleModalComponent,*/ delete_branch_component_1.DeleteBranchComponent],
        providers: [
            index_1.BranchService /*,
            { provide: JQUERY_TOKEN, useValue: jQuery },
            { provide: TOASTR_TOKEN, useValue: toastr }*/
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
__webpack_require__(249);
__webpack_require__(226);
__webpack_require__(287);


/***/ }),

/***/ 807:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(20);
var Observable_1 = __webpack_require__(0);
var index_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ltCommon/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var AppComponent = (function () {
    function AppComponent(branchService, $, toastr, formBuilder) {
        this.branchService = branchService;
        this.$ = $;
        this.toastr = toastr;
        this.formBuilder = formBuilder;
        this.disableShowAddBranchModalBtn = false;
        this.disableAddBranchBtn = false;
        this.disableAddUsersBtn = false;
        this.disableRemoveUserBtn = false;
        this.showAddBranchError = false;
        this.addBranchErrorText = '';
        this.showAddUsersError = false;
        this.addUsersErrorText = '';
        this.currentBranchUser = null;
        this.isAddManager = false;
    }
    // #region Init
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set Up Forms
        this.addBranchFG = this.formBuilder.group({
            branchName: ['', forms_1.Validators.required],
            branchManagers: this.formBuilder.array([]),
            branchUsers: this.formBuilder.array([]),
            pricingRules: this.formBuilder.array([])
        });
        this.addUsersFG = this.formBuilder.group({
            auBranchUsers: this.formBuilder.array([])
        });
        // Get Branch data
        this.getAllBranchInfo();
        // Gets this data in the background
        this.getNewBranchAssetsPromise = this.branchService.getNewBranchAssets();
        this.getNewBranchAssetsPromise.then(function (branchAssets) {
            _this.newBranchAssets = branchAssets;
            window.console && console.info('Done getting newBranchAssets');
        })["catch"](this.handleError);
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Focus on Add Branch Modal
        this.addBranchModal.modalEventHandler('shown.bs.modal', function (e) {
            _this.$('#NewBranchName').focus();
        });
    };
    Object.defineProperty(AppComponent.prototype, "branchName", {
        get: function () { return this.addBranchFG.get('branchName'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "branchManagers", {
        get: function () { return this.addBranchFG.get('branchManagers'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "branchUsers", {
        get: function () { return this.addBranchFG.get('branchUsers'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "pricingRules", {
        get: function () { return this.addBranchFG.get('pricingRules'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "auBranchUsers", {
        get: function () { return this.addUsersFG.get('auBranchUsers'); },
        enumerable: true,
        configurable: true
    });
    // #endregion
    // #region New Branch
    AppComponent.prototype.showAddBranch = function (e) {
        var _this = this;
        e.preventDefault();
        this.disableShowAddBranchModalBtn = true;
        this.resetAddBranch();
        this.getOrUpdateNewBranchAssets(this.clientBranchInfo.ActiveUser.ClientId).then(function (branchAssets) {
            _this.setAllCheckboxListFormArrays(branchAssets);
            _this.showAddBranchModal();
        })["catch"](this.handleError);
    };
    AppComponent.prototype.setAllCheckboxListFormArrays = function (branchAssets) {
        this.setCheckboxListFormArray(this.addBranchFG, 'branchManagers', branchAssets.BranchManagers);
        this.setCheckboxListFormArray(this.addBranchFG, 'branchUsers', branchAssets.BranchUsers);
        this.setCheckboxListFormArray(this.addBranchFG, 'pricingRules', branchAssets.PricingRules);
    };
    AppComponent.prototype.addBranch = function (e) {
        var _this = this;
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
        }
        else {
            var bModel = this.addBranchFG.value;
            var bManagers = bModel.branchManagers.filter(function (fbm) { return fbm.isChecked; }).map(function (bm) { return bm.id; });
            var bUsers = bModel.branchUsers.filter(function (fbu) { return fbu.isChecked; }).map(function (bu) { return bu.id; });
            var pricingRules = bModel.pricingRules.filter(function (fpr) { return fpr.isChecked; }).map(function (pr) { return pr.id; });
            var branchModel = {
                ClientId: this.clientBranchInfo.ActiveUser.ClientId,
                ActiveUserId: this.clientBranchInfo.ActiveUser.UserId,
                BranchName: bModel.branchName,
                ManagerUserIds: bManagers,
                UserIds: bUsers,
                PricingRuleIds: pricingRules
            };
            this.branchService.saveBranch(branchModel).then(function (response) {
                if (response) {
                    _this.getAllBranchInfo(function () {
                        _this.addBranchModal.closeModal();
                        _this.disableAddBranchBtn = false;
                        _this.resetAddBranch();
                    });
                }
            })["catch"](this.handleAddBranchError());
        }
    };
    AppComponent.prototype.showAddBranchModal = function () {
        this.$('#addBranchModal').modal({});
        this.disableShowAddBranchModalBtn = false;
        this.disableAddBranchBtn = false;
    };
    AppComponent.prototype.resetAddBranch = function () {
        this.addBranchFG.reset({ branchName: '' });
        this.resetAddBranchError();
    };
    AppComponent.prototype.handleAddBranchError = function () {
        var _this = this;
        return function (error) {
            window.console && console.error('ERROR:', error);
            _this.disableAddBranchBtn = false;
            _this.showAddBranchError = true;
            _this.addBranchErrorText = error['_body'];
            return Observable_1.Observable["throw"](error.statusText);
        };
    };
    AppComponent.prototype.resetAddBranchError = function () {
        this.showAddBranchError = false;
        this.addBranchErrorText = '';
    };
    // #endregion
    // #region Add Manager/User
    AppComponent.prototype.showAddBranchUser = function (e, buttonId, branch, isManager) {
        var _this = this;
        e.preventDefault();
        this.disableButton(buttonId, true);
        this.currentBranch = branch;
        this.isAddManager = isManager;
        this.resetAddUser();
        this.getNewBranchAssetsPromise.then(function (branchAssets) {
            // Show only remaining available users to choose from
            var currentBranchUsersList = _this.newBranchAssets.BranchManagers.filter(function (branchMgr) {
                var idList = isManager ? branch.BranchManagers.map(function (bm) { return bm.UserId; }) : branch.BranchUsers.map(function (bu) { return bu.userid; });
                return idList.indexOf(branchMgr.userid) === -1;
            });
            _this.setCheckboxListFormArray(_this.addUsersFG, 'auBranchUsers', currentBranchUsersList);
            // Open Modal
            _this.disableAddUsersBtn = false;
            _this.$('#addUsersModal').modal({});
            _this.disableButton(buttonId, false);
        })["catch"](this.handleError);
    };
    AppComponent.prototype.addBranchUsers = function (e, branch) {
        var _this = this;
        e.preventDefault();
        this.disableAddUsersBtn = true;
        this.resetAddUsersError();
        if (this.addUsersFG.invalid) {
            this.auBranchUsers.markAsTouched();
            this.disableAddUsersBtn = false;
            this.showAddUsersError = true;
            this.addUsersErrorText = 'Please update the required fields';
        }
        else {
            var auModel = this.addUsersFG.value;
            var abUsers = auModel.auBranchUsers.filter(function (fau) { return fau.isChecked; }).map(function (au) { return au.id; });
            var usersModel = {
                ClientId: this.clientBranchInfo.ActiveUser.ClientId,
                ActiveUserId: this.clientBranchInfo.ActiveUser.UserId,
                BranchId: branch.BranchId,
                UserIds: abUsers
            };
            this.branchService.addUsers(usersModel, this.isAddManager).then(function (response) {
                if (response) {
                    _this.getAllBranchInfo(function () {
                        _this.addUsersModal.closeModal();
                        _this.disableAddUsersBtn = false;
                        _this.resetAddUser();
                        _this.resetAddUsersError();
                    });
                }
            })["catch"](this.handleAddUsersError());
        }
    };
    AppComponent.prototype.resetAddUser = function () {
        this.addUsersFG.reset();
        this.resetAddUsersError();
    };
    AppComponent.prototype.handleAddUsersError = function () {
        var _this = this;
        return function (error) {
            window.console && console.error('ERROR:', error);
            _this.disableAddUsersBtn = false;
            _this.showAddUsersError = true;
            _this.addUsersErrorText = error['_body'];
            return Observable_1.Observable["throw"](error.statusText);
        };
    };
    AppComponent.prototype.resetAddUsersError = function () {
        this.showAddUsersError = false;
        this.addUsersErrorText = '';
    };
    // #endregion
    // #region Delete Branch
    AppComponent.prototype.confirmDeleteBranch = function (e, branch) {
        e.preventDefault();
        e.stopPropagation();
        this.currentBranch = branch;
        this.deleteBranchModalComp.showDeleteBranchModal();
    };
    // #endregion
    // #region Remove User
    AppComponent.prototype.confirmRemoveUser = function (e, branch, branchUser, isBranchManager) {
        e.preventDefault();
        e.stopPropagation();
        this.currentBranch = branch;
        if (isBranchManager) {
            this.currentBranchUser = {
                id: branchUser.UserId,
                name: branchUser.FullName,
                email: branchUser.Email,
                isManager: true,
                userObject: branchUser
            };
        }
        else {
            this.currentBranchUser = {
                id: branchUser.userid,
                name: branchUser.FullName,
                email: branchUser.email,
                isManager: false,
                userObject: branchUser
            };
        }
        // window.console && console.log('branchUser', isBranchManager, branchUser);
        this.disableRemoveUserBtn = false;
        this.$('#removeUserModal').modal({});
    };
    AppComponent.prototype.removeUser = function (e, currentUser, currentBranch) {
        var _this = this;
        e.preventDefault();
        this.disableRemoveUserBtn = true;
        this.branchService.deleteUser(this.clientBranchInfo.ActiveUser.ClientId, currentBranch.BranchId, currentUser.id, currentUser.isManager).then(function (response) {
            if (response) {
                _this.removeBranchUserModal.closeModal();
                _this.disableRemoveUserBtn = false;
                if (currentUser.isManager) {
                    var indexOfManager = currentBranch.BranchManagers.indexOf(currentUser.userObject);
                    if (indexOfManager !== -1) {
                        currentBranch.BranchManagers.splice(indexOfManager, 1);
                    }
                }
                else {
                    var indexOfUser = currentBranch.BranchUsers.indexOf(currentUser.userObject);
                    if (indexOfUser !== -1) {
                        currentBranch.BranchUsers.splice(indexOfUser, 1);
                    }
                }
            }
            else {
                _this.disableRemoveUserBtn = false;
                _this.toastr.error('Error removing user from branch', null, { closeButton: true });
                window.console && console.error('Error in removing user from branch. Response:\n', response);
            }
        })["catch"](this.handleError);
    };
    // #endregion
    // #region Shared Methods
    AppComponent.prototype.getAllBranchInfo = function (callback) {
        var _this = this;
        this.branchService.getAllClientBranches().then(function (branchInfo) {
            _this.clientBranchInfo = branchInfo;
            if (callback) {
                callback();
            }
        })["catch"](this.handleError);
    };
    AppComponent.prototype.setCheckboxListFormArray = function (formGroup, controlName, assetList) {
        var _this = this;
        var checkFGs = assetList.map(function (assetItem) {
            var aId = assetItem.RuleId || assetItem.userid || null;
            var aName = assetItem.RuleDescription || assetItem.FullName || null;
            var checkItem = { id: aId, name: aName, isChecked: false };
            return _this.formBuilder.group(checkItem);
        });
        var checkFA = this.formBuilder.array(checkFGs, index_1.multipleCheckRequireOne('isChecked'));
        formGroup.setControl(controlName, checkFA);
    };
    AppComponent.prototype.checkAllGroup = function (formArray, keyName, isChecked) {
        formArray.markAsTouched();
        formArray.markAsDirty();
        for (var facI = 0, facL = formArray.controls.length; facI < facL; facI++) {
            var formGroup = formArray.controls[facI];
            formGroup.patchValue({ isChecked: !!isChecked });
        }
    };
    AppComponent.prototype.isInvalidDirtyTouched = function (control) {
        return control.invalid && (control.dirty || control.touched);
    };
    AppComponent.prototype.getOrUpdateNewBranchAssets = function (clientId) {
        var _this = this;
        if (this.newBranchAssets) {
            return this.branchService.getUsersWithNoBranch(clientId).then(function (branchUsers) {
                _this.newBranchAssets.BranchUsers = branchUsers;
                return _this.newBranchAssets;
            });
        }
        else {
            return this.getNewBranchAssetsPromise;
        }
    };
    AppComponent.prototype.populateBranchArray = function (branchAssetList, checkedObj, branchPrefix) {
        var bArr = [];
        for (var baI = 0, baL = branchAssetList.length; baI < baL; baI++) {
            var baItem = branchAssetList[baI];
            var baId = baItem.RuleId || baItem.userid || null;
            if (baId) {
                var bChckName = branchPrefix + baId.toString();
                if (checkedObj[bChckName]) {
                    bArr.push(baId);
                }
            }
        }
        return bArr;
    };
    AppComponent.prototype.handleError = function (error) {
        window.console && console.error('ERROR:', error);
        return Observable_1.Observable["throw"](error.statusText);
    };
    AppComponent.prototype.disableButton = function (buttonId, disableBtn) {
        if (disableBtn) {
            this.$("#" + buttonId).addClass('btn-loading').prop('disabled', true);
        }
        else {
            this.$("#" + buttonId).removeClass('btn-loading').prop('disabled', false);
        }
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('addBranchModal')
], AppComponent.prototype, "addBranchModal");
__decorate([
    core_1.ViewChild('addUsersModal')
], AppComponent.prototype, "addUsersModal");
__decorate([
    core_1.ViewChild('deleteBranchModalComp')
], AppComponent.prototype, "deleteBranchModalComp");
__decorate([
    core_1.ViewChild('removeBranchUserModal')
], AppComponent.prototype, "removeBranchUserModal");
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: __webpack_require__(808),
        styles: ["\n\t\t.checkbox-group-height {\n\t\t\theight: 12rem;\n\t\t\toverflow: auto;\n\t\t}\n\t"]
    }),
    __param(1, core_1.Inject(index_1.JQUERY_TOKEN)), __param(2, core_1.Inject(index_1.TOASTR_TOKEN))
], AppComponent);
exports.AppComponent = AppComponent;


/***/ }),

/***/ 808:
/***/ (function(module, exports) {

module.exports = "<ng-template #RetrievingData>\r\n\t<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i> Retrieving Data...\r\n</ng-template>\r\n<form class=\"pb-5\" *ngIf=\"clientBranchInfo else RetrievingData\">\r\n\t<div class=\"row form-group\">\r\n\t\t<div class=\"col-sm-12\">\r\n\t\t\t<button class=\"btn btn-success\" type=\"button\" (click)=\"showAddBranch($event)\" [class.btn-loading]=\"disableShowAddBranchModalBtn\" [disabled]=\"disableShowAddBranchModalBtn\"><i class=\"fa fa-plus\"></i> Add Branch</button>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"row\" *ngFor=\"let branch of clientBranchInfo.Branches; let bI=index;\">\r\n\t\t<div class=\"col-sm-12\">\r\n\t\t\t<div class=\"card panel-default\">\r\n\t\t\t\t<div class=\"card-header d-flex flex-row collapsed\" data-toggle=\"collapse\" [attr.data-target]=\"'.branch-wrapper-' + bI\">\r\n\t\t\t\t\t<span class=\"p-1 mr-auto\"><span class=\"collapse-chevron mr-2\"></span><strong>Branch:</strong> {{branch.BranchName}}</span>\r\n\t\t\t\t\t<button class=\"btn btn-sm btn-danger\" type=\"button\" (click)=\"confirmDeleteBranch($event, branch)\"><i class=\"fa fa-trash\"></i> Delete</button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"collapse branch-wrapper-{{bI}}\">\r\n\t\t\t\t\t<div class=\"card-body\">\r\n\t\t\t\t\t\t<div class=\"ml-4\">\r\n\t\t\t\t\t\t\t<strong>Branch Managers</strong>\r\n\t\t\t\t\t\t\t<div class=\"table-responsive\">\r\n\t\t\t\t\t\t\t\t<table class=\"table table-sm table-condensed table-bordered table-striped table-hover\">\r\n\t\t\t\t\t\t\t\t\t<thead class=\"bg-primary text-white\">\r\n\t\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t\t<th>Manager</th>\r\n\t\t\t\t\t\t\t\t\t\t\t<th>Email</th>\r\n\t\t\t\t\t\t\t\t\t\t\t<th class=\"w-0 text-right\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<button id=\"AddBranchManagers_{{branch.BranchId}}\" class=\"btn btn-xs btn-success\" type=\"button\" (click)=\"showAddBranchUser($event, 'AddBranchManagers_' + branch.BranchId, branch, true)\"><i class=\"fa fa-plus\"></i> Add Manager</button>\r\n\t\t\t\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t\t\t\t<tbody *ngIf=\"branch.BranchManagers.length > 0\">\r\n\t\t\t\t\t\t\t\t\t\t<tr *ngFor=\"let branchManager of branch.BranchManagers\">\r\n\t\t\t\t\t\t\t\t\t\t\t<td>{{branchManager.FullName}}</td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td>{{branchManager.Email}}</td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"text-right\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs btn-danger\" (click)=\"confirmRemoveUser($event, branch, branchManager, true)\"><i class=\"fa fa-trash\"></i> Delete</button>\r\n\t\t\t\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t\t\t\t\t<tbody *ngIf=\"!(branch.BranchManagers.length > 0)\">\r\n\t\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t\t<td colspan=\"3\">No Branch Managers</td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"ml-4\">\r\n\t\t\t\t\t\t\t<strong>Branch Users</strong>\r\n\t\t\t\t\t\t\t<div class=\"table-responsive\">\r\n\t\t\t\t\t\t\t\t<table class=\"table table-sm table-condensed table-bordered table-striped table-hover\">\r\n\t\t\t\t\t\t\t\t\t<thead class=\"bg-dark text-white\">\r\n\t\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t\t<th>User</th>\r\n\t\t\t\t\t\t\t\t\t\t\t<th>Email</th>\r\n\t\t\t\t\t\t\t\t\t\t\t<th class=\"w-0 text-right\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<button id=\"AddBranchUsers_{{branch.BranchId}}\" class=\"btn btn-xs btn-success\" type=\"button\" (click)=\"showAddBranchUser($event, 'AddBranchUsers_' + branch.BranchId, branch, false)\"><i class=\"fa fa-plus\"></i> Add User</button>\r\n\t\t\t\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t\t\t\t<tbody *ngIf=\"branch.BranchUsers.length > 0\">\r\n\t\t\t\t\t\t\t\t\t\t<tr *ngFor=\"let branchUser of branch.BranchUsers\">\r\n\t\t\t\t\t\t\t\t\t\t\t<td>{{branchUser.FullName}}</td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td>{{branchUser.email}}</td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"text-right\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs btn-danger\" (click)=\"confirmRemoveUser($event, branch, branchUser, false)\"><i class=\"fa fa-trash\"></i> Delete</button>\r\n\t\t\t\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t\t\t\t\t<tbody *ngIf=\"!(branch.BranchUsers.length > 0)\">\r\n\t\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t\t<td colspan=\"3\">No Branch Users</td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</form>\r\n\r\n\r\n<simple-modal #addBranchModal modalTitle=\"Add Branch\" elementId=\"addBranchModal\" modalSizeClass=\"modal-lg\" titleBgClass=\"bg-success\" titleColorClass=\"text-white\">\r\n\t<ng-template #LoadingCurrentUsersList>\r\n\t\t<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i> Loading...\r\n\t</ng-template>\r\n\t<div *ngIf=\"newBranchAssets else LoadingCurrentUsersList\">\r\n\t\t<form #AddBranchForm [formGroup]=\"addBranchFG\" (ngSubmit)=\"addBranch($event)\" novalidate=\"novalidate\">\r\n\t\t\t<div class=\"alert alert-danger\" *ngIf=\"showAddBranchError && addBranchFG.invalid\">\r\n\t\t\t\tError: {{addBranchErrorText}}\r\n\t\t\t</div>\r\n\t\t\t<div class=\"form-row\">\r\n\t\t\t\t<div class=\"form-group col-md-4\">\r\n\t\t\t\t\t<label for=\"NewBranchName\" class=\"col-form-label h6\">Branch Name*</label>\r\n\t\t\t\t\t<input type=\"text\" id=\"NewBranchName\" name=\"NewBranchName\" class=\"form-control\" [class.is-invalid]=\"isInvalidDirtyTouched(branchName)\" formControlName=\"branchName\" placeholder=\"Enter a Branch Name\" />\r\n\t\t\t\t\t<div class=\"invalid-feedback\">*Branch Name is required</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"form-row\">\r\n\t\t\t\t<div class=\"form-group col-lg-4\">\r\n\t\t\t\t\t<label class=\"col-form-label h6 d-block\">Branch Managers</label>\r\n\t\t\t\t\t<div class=\"btn-group pb-2\">\r\n\t\t\t\t\t\t<button class=\"btn btn-info btn-xs\" type=\"button\" (click)=\"checkAllGroup(branchManagers, 'isChecked', true)\">Check All</button>\r\n\t\t\t\t\t\t<button class=\"btn btn-outline-secondary btn-xs\" type=\"button\" (click)=\"checkAllGroup(branchManagers, 'isChecked', false)\">Uncheck All</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"border p-2 checkbox-group-height\" [ngClass]=\"isInvalidDirtyTouched(branchManagers) ? 'border-danger' : 'border-secondary'\" formArrayName=\"branchManagers\">\r\n\t\t\t\t\t\t<div *ngFor=\"let bm of branchManagers.controls; let bmI=index;\" class=\"form-check checkbox-fa\" [formGroupName]=\"bmI\">\r\n\t\t\t\t\t\t\t<label [attr.for]=\"'bManager' + bmI\" class=\"form-check-label\">\r\n\t\t\t\t\t\t\t\t<input [attr.id]=\"'bManager' + bmI\" name=\"{{'bManager' + bmI}}\" type=\"checkbox\" class=\"form-check-input\" formControlName=\"isChecked\" /><i class=\"checkbox-i\"></i> {{bm.get('name').value}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"text-danger small\" *ngIf=\"isInvalidDirtyTouched(branchManagers)\">*Please check at least one</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-group col-lg-4\">\r\n\t\t\t\t\t<label class=\"col-form-label h6 d-block\">Branch Users</label>\r\n\t\t\t\t\t<div class=\"btn-group pb-2\">\r\n\t\t\t\t\t\t<button class=\"btn btn-info btn-xs\" type=\"button\" (click)=\"checkAllGroup(branchUsers, 'isChecked', true)\">Check All</button>\r\n\t\t\t\t\t\t<button class=\"btn btn-outline-secondary btn-xs\" type=\"button\" (click)=\"checkAllGroup(branchUsers, 'isChecked', false)\">Uncheck All</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"border p-2 checkbox-group-height\" [ngClass]=\"isInvalidDirtyTouched(branchUsers) ? 'border-danger' : 'border-secondary'\" formArrayName=\"branchUsers\">\r\n\t\t\t\t\t\t<div *ngFor=\"let bu of branchUsers.controls; let buI=index;\" class=\"form-check checkbox-fa\" [formGroupName]=\"buI\">\r\n\t\t\t\t\t\t\t<label [attr.for]=\"'bUser' + buI\" class=\"form-check-label\">\r\n\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" formControlName=\"isChecked\" [attr.id]=\"'bUser' + buI\" name=\"{{'bUser' + buI}}\" /><i class=\"checkbox-i\"></i> {{bu.get('name').value}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"text-danger small\" *ngIf=\"isInvalidDirtyTouched(branchUsers)\">*Please check at least one</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-group col-lg-4\">\r\n\t\t\t\t\t<label class=\"col-form-label h6 d-block\">Pricing Rules</label>\r\n\t\t\t\t\t<div class=\"btn-group pb-2\">\r\n\t\t\t\t\t\t<button class=\"btn btn-info btn-xs\" type=\"button\" (click)=\"checkAllGroup(pricingRules, 'isChecked', true)\">Check All</button>\r\n\t\t\t\t\t\t<button class=\"btn btn-outline-secondary btn-xs\" type=\"button\" (click)=\"checkAllGroup(pricingRules, 'isChecked', false)\">Uncheck All</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"border p-2 checkbox-group-height\" [ngClass]=\"isInvalidDirtyTouched(pricingRules) ? 'border-danger' : 'border-secondary'\" formArrayName=\"pricingRules\">\r\n\t\t\t\t\t\t<div *ngFor=\"let pr of pricingRules.controls; let prI=index;\" class=\"form-check checkbox-fa\" [formGroupName]=\"prI\">\r\n\t\t\t\t\t\t\t<label [attr.for]=\"'bPricingRule' + prI\" class=\"form-check-label\">\r\n\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" formControlName=\"isChecked\" [attr.id]=\"'bPricingRule' + prI\" name=\"{{'bPricingRule' + prI}}\" /><i class=\"checkbox-i\"></i> {{pr.get('name').value}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"text-danger small\" *ngIf=\"isInvalidDirtyTouched(pricingRules)\">*Please check at least one</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"form-row\">\r\n\t\t\t\t<div class=\"col text-right\">\r\n\t\t\t\t\t<button class=\"btn btn-success\" type=\"submit\" [class.btn-loading]=\"disableAddBranchBtn\" [disabled]=\"disableAddBranchBtn\"><i class=\"fa fa-plus\"></i> Add Branch</button>\r\n\t\t\t\t\t<button class=\"btn btn-secondary\" type=\"button\" (click)=\"addBranchModal.closeModal()\">Cancel</button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</form>\r\n\t</div>\r\n</simple-modal>\r\n\r\n\r\n<simple-modal #addUsersModal modalTitle=\"Add {{isAddManager ? 'Managers' : 'Users'}}\" elementId=\"addUsersModal\" modalSizeClass=\"modal-sm\" titleBgClass=\"bg-success\" titleColorClass=\"text-white\">\r\n\t<ng-template #LoadingAddUsersList>\r\n\t\t<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i> Retrieving Data...\r\n\t</ng-template>\r\n\t<div *ngIf=\"currentBranch else LoadingAddUsersList\">\r\n\t\t<form #AddUsersForm [formGroup]=\"addUsersFG\" (ngSubmit)=\"addBranchUsers($event, currentBranch)\" novalidate=\"novalidate\">\r\n\t\t\t<div class=\"alert alert-danger\" *ngIf=\"showAddUsersError && addUsersFG.invalid\">\r\n\t\t\t\tError: {{addUsersErrorText}}\r\n\t\t\t</div>\r\n\t\t\t<div class=\"form-row\">\r\n\t\t\t\t<div class=\"form-group col\">\r\n\t\t\t\t\t<p><strong>Branch:</strong> {{currentBranch.BranchName}}</p>\r\n\t\t\t\t\t<p>Select from the list of {{isAddManager ? 'Managers' : 'Users'}}</p>\r\n\t\t\t\t\t<div class=\"btn-group pb-2\">\r\n\t\t\t\t\t\t<button class=\"btn btn-info btn-xs\" type=\"button\" (click)=\"checkAllGroup(auBranchUsers, 'isChecked', true)\">Check All</button>\r\n\t\t\t\t\t\t<button class=\"btn btn-outline-secondary btn-xs\" type=\"button\" (click)=\"checkAllGroup(auBranchUsers, 'isChecked', false)\">Uncheck All</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"border p-2 checkbox-group-height\" [ngClass]=\"isInvalidDirtyTouched(auBranchUsers) ? 'border-danger' : 'border-secondary'\" formArrayName=\"auBranchUsers\">\r\n\t\t\t\t\t\t<div *ngFor=\"let user of auBranchUsers.controls; let auI=index;\" class=\"form-check checkbox-fa\" [formGroupName]=\"auI\">\r\n\t\t\t\t\t\t\t<label [attr.for]=\"'auUser' + auI\" class=\"form-check-label\">\r\n\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" formControlName=\"isChecked\" [attr.id]=\"'auUser' + auI\" [attr.name]=\"'auUser' + auI\" /><i class=\"checkbox-i\"></i> {{user.get('name').value}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"text-danger small\" *ngIf=\"isInvalidDirtyTouched(auBranchUsers)\">*Please check at least one</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"form-row\">\r\n\t\t\t\t<div class=\"col text-right\">\r\n\t\t\t\t\t<button class=\"btn btn-success\" type=\"submit\" [class.btn-loading]=\"disableAddUsersBtn\" [disabled]=\"disableAddUsersBtn\"><i class=\"fa fa-plus\"></i> Add {{isAddManager ? 'Managers' : 'Users'}}</button>\r\n\t\t\t\t\t<button class=\"btn btn-secondary\" type=\"button\" (click)=\"addUsersModal.closeModal()\">Cancel</button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</form>\r\n\t</div>\r\n</simple-modal>\r\n\r\n\r\n<delete-branch #deleteBranchModalComp [clientBranchInfo]=\"clientBranchInfo\" [currentBranch]=\"currentBranch\"></delete-branch>\r\n\r\n\r\n<simple-modal #removeBranchUserModal modalTitle=\"Remove from Branch?\" elementId=\"removeUserModal\" modalSizeClass=\"modal-sm\" titleBgClass=\"bg-danger\" titleColorClass=\"text-white\">\r\n\t<ng-template #LoadingCurrentBranchUser>\r\n\t\t<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i> Retrieving Data...\r\n\t</ng-template>\r\n\t<div *ngIf=\"(currentBranchUser && currentBranch) else LoadingCurrentBranchUser\">\r\n\t\t<form (ngSubmit)=\"removeUser($event, currentBranchUser, currentBranch)\">\r\n\t\t\t<p>\r\n\t\t\t\t<strong>{{(currentBranchUser.isManager ? 'Manager': 'User')}}:</strong> {{currentBranchUser.name}}<br />\r\n\t\t\t\t<strong>Branch:</strong> {{currentBranch.BranchName}}\r\n\t\t\t</p>\r\n\t\t\t<p>Are you sure you want to remove this {{(currentBranchUser.isManager ? 'Manager': 'User')}} from this Branch?</p>\r\n\t\t\t<div class=\"text-right\">\r\n\t\t\t\t<button class=\"btn btn-danger mr-1\" type=\"submit\" [class.btn-loading]=\"disableRemoveUserBtn\" [disabled]=\"disableRemoveUserBtn\"><i class=\"fa fa-trash\"></i> Delete</button>\r\n\t\t\t\t<button class=\"btn btn-secondary\" type=\"button\" (click)=\"removeBranchUserModal.closeModal()\">Cancel</button>\r\n\t\t\t</div>\r\n\t\t</form>\r\n\t</div>\r\n</simple-modal>\r\n";

/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(810));


/***/ }),

/***/ 810:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(137);
var BranchService = (function () {
    function BranchService(http) {
        this.http = http;
    }
    BranchService.prototype.getAllClientBranches = function () {
        return this.http.get('/Services/BranchManager/GetAllClientBranches').toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.getNewBranchAssets = function () {
        return this.http.get('/Services/BranchManager/GetNewBranchAssets').toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.getAllUsers = function (clientId) {
        return this.http.get("/Services/BranchManager/GetAllUsers?clientId=" + clientId).toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.getUsersWithNoBranch = function (clientId) {
        return this.http.get("/Services/BranchManager/GetUsersWithNoBranch?clientId=" + clientId).toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.saveBranch = function (branchModel) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/Services/BranchManager/Save', branchModel, options).toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.addUsers = function (addUsersModel, isManager) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var addUsersMethod = isManager ? 'AddManagers' : 'AddUsers';
        var addUsersUrl = "/Services/BranchManager/" + addUsersMethod;
        return this.http.post(addUsersUrl, addUsersModel, options).toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.deleteBranch = function (clientId, branchId) {
        return this.http["delete"]("/Services/BranchManager/DeleteBranch?clientId=" + clientId + "&branchId=" + branchId).toPromise().then(function (response) {
            return response.json();
        });
    };
    BranchService.prototype.deleteUser = function (clientId, branchId, userId, isBranchManager) {
        var deleteControllerMethod = isBranchManager ? 'DeleteManagerFromBranch' : 'DeleteUserFromBranch';
        var deleteUrl = "/Services/BranchManager/" + deleteControllerMethod + "?clientId=" + clientId + "&branchId=" + branchId + "&userId=" + userId;
        return this.http["delete"](deleteUrl).toPromise().then(function (response) {
            return response.json();
        });
    };
    return BranchService;
}());
BranchService = __decorate([
    core_1.Injectable()
], BranchService);
exports.BranchService = BranchService;


/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var core_1 = __webpack_require__(1);
var Observable_1 = __webpack_require__(0);
var index_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ltCommon/index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var DeleteBranchComponent = (function () {
    function DeleteBranchComponent(branchService, $, toastr) {
        this.branchService = branchService;
        this.$ = $;
        this.toastr = toastr;
        this.disableDeleteBranchBtn = false;
    }
    DeleteBranchComponent.prototype.showDeleteBranchModal = function () {
        this.disableDeleteBranchBtn = false;
        this.$('#deleteBranchModal').modal({});
    };
    DeleteBranchComponent.prototype.deleteBranch = function (e, branch) {
        var _this = this;
        e.preventDefault();
        this.disableDeleteBranchBtn = true;
        this.branchService.deleteBranch(this.clientBranchInfo.ActiveUser.ClientId, branch.BranchId).then(function (response) {
            if (response) {
                _this.deleteBranchModal.closeModal();
                _this.disableDeleteBranchBtn = false;
                var indexOfBranch = _this.clientBranchInfo.Branches.indexOf(branch);
                if (indexOfBranch !== -1) {
                    _this.clientBranchInfo.Branches.splice(indexOfBranch, 1);
                }
                _this.toastr.success('The branch was DELETED', null, { closeButton: true });
            }
            else {
                _this.disableDeleteBranchBtn = false;
                _this.toastr.error('Error deleting branch', null, { closeButton: true });
                window.console && console.error('Error in deleting branch. Response:\n', response);
            }
        })["catch"](this.handleError);
    };
    DeleteBranchComponent.prototype.handleError = function (error) {
        window.console && console.error('ERROR:', error);
        return Observable_1.Observable["throw"](error.statusText);
    };
    return DeleteBranchComponent;
}());
__decorate([
    core_1.Input()
], DeleteBranchComponent.prototype, "clientBranchInfo");
__decorate([
    core_1.Input()
], DeleteBranchComponent.prototype, "currentBranch");
__decorate([
    core_1.ViewChild('deleteBranchModal')
], DeleteBranchComponent.prototype, "deleteBranchModal");
DeleteBranchComponent = __decorate([
    core_1.Component({
        selector: 'delete-branch',
        template: __webpack_require__(812)
    }),
    __param(1, core_1.Inject(index_1.JQUERY_TOKEN)), __param(2, core_1.Inject(index_1.TOASTR_TOKEN))
], DeleteBranchComponent);
exports.DeleteBranchComponent = DeleteBranchComponent;


/***/ }),

/***/ 812:
/***/ (function(module, exports) {

module.exports = "<simple-modal #deleteBranchModal modalTitle=\"Delete Branch?\" elementId=\"deleteBranchModal\" modalSizeClass=\"modal-sm\" titleBgClass=\"bg-danger\" titleColorClass=\"text-white\">\r\n\t<div *ngIf=\"currentBranch\">\r\n\t\t<form (ngSubmit)=\"deleteBranch($event, currentBranch)\">\r\n\t\t\t<p><strong>Branch:</strong> {{currentBranch.BranchName}}</p>\r\n\t\t\t<p>Are you sure you want to delete this branch?</p>\r\n\t\t\t<div class=\"text-right\">\r\n\t\t\t\t<button class=\"btn btn-danger mr-1\" type=\"submit\" [class.btn-loading]=\"disableDeleteBranchBtn\" [disabled]=\"disableDeleteBranchBtn\"><i class=\"fa fa-trash\"></i> Delete</button>\r\n\t\t\t\t<button class=\"btn btn-secondary\" type=\"button\" (click)=\"deleteBranchModal.closeModal()\">Cancel</button>\r\n\t\t\t</div>\r\n\t\t</form>\r\n\t</div>\r\n</simple-modal>";

/***/ })

},[804]);
//# sourceMappingURL=app.js.map