import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService, PracticeService } from 'core-services';
import { CaseFile, CaseFileNote } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-new-note',
  templateUrl: './dialog-new-note.component.html',
  styleUrls: ['./dialog-new-note.component.scss']
})
export class DialogNewNoteComponent implements OnInit {

  caseFileNoteForm!:FormGroup;
  caseFile!:CaseFile | null;
  caseFileNote!:CaseFileNote | null;
  autosaveTrigger: Subject<void> = new Subject<void>();
  caseFiles!:CaseFile[] | null
  selectedSubscription!: any;

  constructor(private formBuilder:FormBuilder,
              public dialogRef: MatDialogRef<DialogNewNoteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {caseFile:CaseFile,caseFileNote:CaseFileNote},
              private practiceService:PracticeService,
              private toastr: ToastrService,
              private translateService:TranslateService,
              private authService: AuthService,
              ) { }

  ngOnInit(): void {
    this.caseFile = this.data && this.data.caseFile ? this.data.caseFile : null;
    this.caseFileNote = this.data && this.data.caseFileNote ? this.data.caseFileNote : null;
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.setFormValue();
    this.getCaseFiles();

    if(this.caseFileNote){
      this.autosaveTrigger.subscribe(() => {
        this.submitForm(false,true);
      });
    }

  }

  initForm() {
    this.caseFileNoteForm = this.formBuilder.group({
      case_file: ['',Validators.required],
      title: ['',Validators.required],
      body: ['',Validators.required]
    });

    this.caseFileNoteForm.valueChanges
    .pipe(debounceTime(250))
    .subscribe(() => {
      this.autosaveTrigger.next();
    });

  }

  setFormValue(){

    if(this.caseFileNote){

      this.practiceService.getCaseFileNoteById(this.caseFileNote.subscription,this.caseFileNote.uuid || '').subscribe(data => {
        this.caseFileNoteForm.patchValue({
          ...data
        })
      })
    }
    else if(this.caseFile){
      this.caseFileNoteForm.patchValue({
        case_file: this.caseFile.uuid
      })
    }
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFiles = data
    })
  }

  submitForm(createAnother = false,autoSave = false){

    const caseFileNotePayload:CaseFileNote = {
      ...this.caseFileNoteForm.value,
      subscription: this.selectedSubscription?.ssid.uuid
    }

    if(this.caseFileNote) caseFileNotePayload.uuid = this.caseFileNote.uuid;

   if(this.caseFileNoteForm.valid){

    this.practiceService.saveCaseFileNote(caseFileNotePayload).subscribe(data => {

      if(autoSave) return;

      if(this.caseFileNote){
        this.toastr.success('Ok', this.translateService.instant('successMessages.updated_successfully'));
      }
      else{
        this.toastr.success('Ok', this.translateService.instant('successMessages.created_succesfully'));
      }

      this.dialogRef.close({caseFileNote: data,createAnother});

    })

   }
   else{
    if(!autoSave)  this.toastr.error('Error','Completar campos obligatorios');
   }
  }

}
