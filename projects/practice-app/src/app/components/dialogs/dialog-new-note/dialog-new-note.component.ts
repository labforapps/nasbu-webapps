import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogNewExpedientComponent } from '../dialog-new-expedient/dialog-new-expedient.component';
import { PracticeService } from 'core-services';
import { CaseFile, CaseFileNote } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-new-note',
  templateUrl: './dialog-new-note.component.html',
  styleUrls: ['./dialog-new-note.component.scss']
})
export class DialogNewNoteComponent implements OnInit {

  caseFileNoteForm!:FormGroup;
  caseFile!:CaseFile;
  caseFileNote!:CaseFileNote | null;

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
  }

  initForm() {
    this.caseFileNoteForm = this.formBuilder.group({
      title: ['',Validators.required],
      body: ['',Validators.required]
    })
  }

  setFormValue(){
    if(this.caseFileNote){
      this.caseFileNoteForm.patchValue({
        ...this.caseFileNote
      })
    }
  }

  submitForm(createAnother = false){

    const caseFileNotePayload:CaseFileNote = {
      ...this.caseFileNoteForm.value,
      case_file: this.caseFile.uuid || '',
      subscription: this.caseFile.subscription
    }

    if(this.caseFileNote) caseFileNotePayload.uuid = this.caseFileNote.uuid;

   if(this.caseFileNoteForm.valid){

    this.practiceService.saveCaseFileNote(caseFileNotePayload).subscribe(data => {

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

    this.toastr.error(
      'Error',
      'Completar campos obligatorios'
      //this.translateService.instant('errorMessages.InvalidForm')
    );

   }
  }

}
