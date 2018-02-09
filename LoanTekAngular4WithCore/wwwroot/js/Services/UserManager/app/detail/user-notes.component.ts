import { Component, Input, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { LODASH_TOKEN, TOASTR_TOKEN, IFilterOperator, SimpleModalComponent } from 'ltCommon/index';
import { IUser, IUserNote, UserService, IUserNoteListFilter, IUserNoteListSort, ISaveNewNoteModel, IUpdateNoteModel } from './../shared/index';

@Component({
	selector: 'sum-user-notes'
	, templateUrl: './user-notes.component.html'
	, styles: [`
		.createDateFilterWrap {min-width: 160px;}
	`]
})
export class UserNotesCompmonent implements OnInit {
	@ViewChild('deleteNoteModal') deleteNoteModal: SimpleModalComponent;
	@ViewChild('editNoteModal') editNoteModal: SimpleModalComponent;
	@Input() user: IUser;
	userNotes: IUserNote[];
	noteFilterFG: FormGroup;
	editNoteFG: FormGroup;
	isGettingNoteList: boolean = false;
	sortBy: IUserNoteListSort = null;
	reverseSort: boolean = false;
	currentNote: IUserNote;
	isDeleteNoteBtnDisabled: boolean = false;
	isSaveNoteBtnDisabled: boolean = false;

	constructor(private formBuilder: FormBuilder, private uServ: UserService, @Inject(LODASH_TOKEN) private _: _.LoDashStatic, @Inject(TOASTR_TOKEN) private toastr: Toastr) {}

	// #region Init Methods

		ngOnInit() {
			// window.console && console.log('user-notes init');
			this.noteFilterFG = this.formBuilder.group(this.initNotesFilterForm());
			this.editNoteFG = this.formBuilder.group(this.initEditNotesForm());

			if (this.user) {
				this.filterNoteList(this.user.UserId, 1, 0, null, null, null, null, true);
			}
		}

		get createDateOpFilter() { return this.noteFilterFG.get('createDateOpFilter'); }
		get Note() { return this.editNoteFG.get('Note'); }

	// #endregion

	// #region Main Methods

		filterNotes(resetResults?: boolean) {
			this.isGettingNoteList = true;
			this.filterNoteList(this.user.UserId, 1, 0, this.sortBy, this.reverseSort, this.noteFilterFG.value, () => {
				this.isGettingNoteList = false;
			}, resetResults);
		}

		filterNotesDebounce = this._.debounce(() => {
			this.filterNotes();
		}, 400);

		clearFilter() {
			this.isGettingNoteList = true;
			this.noteFilterFG.reset(this.initNotesFilterForm());
			this.filterNoteList(this.user.UserId, 1, 0, this.sortBy, this.reverseSort, null, () => {
				this.isGettingNoteList = false;
			});
		}

		changeCreateDateOp(op: IFilterOperator) {
			this.createDateOpFilter.setValue(op);
			this.filterNotes();
		}

		changeSort(sortBy: IUserNoteListSort) {
			this.isGettingNoteList = true;

			if (sortBy === this.sortBy) {
				if (this.reverseSort) {
					this.sortBy = null;
					this.reverseSort = false;
				} else {
					this.reverseSort = !this.reverseSort;
				}
			} else {
				this.sortBy = sortBy;
				this.reverseSort = false;
			}

			this.filterNoteList(this.user.UserId, 1, 0, this.sortBy, this.reverseSort, this.noteFilterFG.value, () => {
				this.isGettingNoteList = false;
			});
		}

		clearCurrentNote() {
			// window.console && console.log('currentNote cleared');
			this.currentNote = null;
		}

		showDeleteNoteConfirm(note: IUserNote) {
			this.isDeleteNoteBtnDisabled = false;
			this.currentNote = note;
			this.deleteNoteModal.openModal();
		}

		deleteNote(note: IUserNote) {
			this.isDeleteNoteBtnDisabled = true;

			this.uServ.deleteNote(note.NoteId).then(isDeleted => {
				let noteIndex = this.userNotes.indexOf(note);
				if (noteIndex !== -1) {
					this.userNotes.splice(noteIndex, 1);
				}

				this.isDeleteNoteBtnDisabled = false;
				this.deleteNoteModal.closeModal();
				this.toastr.success('The Note was DELETED');
			}).catch((error: Response) => {
				window.console && console.error('Could not delete Note', error);
				this.isDeleteNoteBtnDisabled = false;
				this.toastr.error('Could not delete Note', 'Error');
			});

			// setTimeout(() => {
			// 	this.deleteNoteModal.closeModal();
			// 	this.isDeleteNoteBtnDisabled = false;

			// 	let noteIndex = this.userNotes.indexOf(note);
			// 	if (noteIndex !== -1) {
			// 		this.userNotes.splice(noteIndex, 1);
			// 	}

			// 	this.toastr.success('The Note was DELETED');
			// }, 500);
		}

		showEditNote(note: IUserNote) {
			this.isSaveNoteBtnDisabled = false;
			this.editNoteFG.reset(this.initEditNotesForm());
			if (note) {
				this.currentNote = note;
				this.Note.setValue(note.Note);
			} else {
				this.currentNote = { NoteId: null, LinkedId: this.user.UserId, Note: '' };
				this.Note.setValue('');
			}
			this.editNoteModal.openModal();
		}

		editNote() {
			this.isSaveNoteBtnDisabled = true;

			let saveNote: IUpdateNoteModel = this._.cloneDeep(this.currentNote);
			this._.assign(saveNote, this.editNoteFG.value);

			// window.console && console.log('saveNote', saveNote, this.editNoteFG.value);
			if (this.currentNote.NoteId) {
				this.uServ.updateNote(saveNote).then(isUpdated => {
					this.resetAndCloseNoteModal('Note Updated');
				}).catch((error: Response) => {
					window.console && console.error('Update Note Error:', error);
					this.isSaveNoteBtnDisabled = false;
					this.toastr.error('Could not update Note', 'Error');
				});
			} else {
				this.uServ.saveNewNote(saveNote).then(isCreated => {
					this.resetAndCloseNoteModal('Note Created');
				}).catch((error: Response) => {
					window.console && console.error('Create Note Error:', error);
					this.isSaveNoteBtnDisabled = false;
					this.toastr.error('Could not create Note', 'Error');
				});
			}

			// setTimeout(() => {
			// 	this.isSaveNoteBtnDisabled = false;
			// 	this.editNoteFG.reset(this.initEditNotesForm());
			// 	this.Note.setValue('');
			// 	this.toastr.success('Note Saved');
			// 	this.editNoteModal.closeModal();
			// }, 500);
		}

	// #endregion

	// #region Shared Methods

		isInvalidDirtyTouched(control: AbstractControl) {
			return control.invalid && (control.dirty || control.touched);
		}

		private resetAndCloseNoteModal(toastrMsg: string) {
			this.filterNotes(true);
			this.isSaveNoteBtnDisabled = false;
			this.editNoteFG.reset(this.initEditNotesForm());
			this.Note.setValue('');
			this.toastr.success(toastrMsg);
			this.editNoteModal.closeModal();
		}

		private filterNoteList(userId: number, currentPage: number, pageSize: number, sortBy?: string, reverse?: boolean, filter?: IUserNoteListFilter, callback?: Function, resetInfo?: boolean) {
			this.uServ.getFilteredUserNoteList(userId, currentPage, pageSize, sortBy, reverse, filter, resetInfo).then(notesInfo => {
				this.userNotes = notesInfo.noteList.map(note => {
					delete note['LoanTekUser'];
					return note;
				});
				if (callback && typeof callback === 'function') { callback(); }
			}).catch(this.handleError);
		}

		private initNotesFilterForm() {
			let filterNotesFormGroup: IUserNoteListFilter = {
				createDateFilter: ''
				, createDateOpFilter: 'gt'
				, editByNameFilter: ''
				, noteFilter: ''
			};

			return filterNotesFormGroup;
		}

		private initEditNotesForm() {
			let editNoteForm = {
				Note: ['', Validators.required]
			};

			return editNoteForm;
		}

		private handleError(error: Response) {
			window.console && console.error('ERROR:', error);
			return Observable.throw(error.statusText);
		}

	// #endregion
}
