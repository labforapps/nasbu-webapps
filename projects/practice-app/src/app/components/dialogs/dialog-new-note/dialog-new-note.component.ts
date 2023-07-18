import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PracticeService } from 'core-services';
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
  caseFile!:CaseFile;
  caseFileNote!:CaseFileNote | null;
  autosaveTrigger: Subject<void> = new Subject<void>();

  constructor(private formBuilder:FormBuilder,
              public dialogRef: MatDialogRef<DialogNewNoteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {caseFile:CaseFile,caseFileNote:CaseFileNote},
              private practiceService:PracticeService,
              private toastr: ToastrService,
              private translateService:TranslateService,
              ) { }

  ngOnInit(): void {
    this.caseFile = this.data.caseFile;
    this.caseFileNote = this.data.caseFileNote ? this.data.caseFileNote : null;
    this.initForm();
    this.setFormValue();

    if(this.caseFileNote){
      this.autosaveTrigger.subscribe(() => {
        this.submitForm(false,true);
      });
    }

  }

  initForm() {
    this.caseFileNoteForm = this.formBuilder.group({
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
  }

  submitForm(createAnother = false,autoSave = false){

    const caseFileNotePayload:CaseFileNote = {
      ...this.caseFileNoteForm.value,
      case_file: this.caseFile.uuid || '',
      subscription: this.caseFile.subscription
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
