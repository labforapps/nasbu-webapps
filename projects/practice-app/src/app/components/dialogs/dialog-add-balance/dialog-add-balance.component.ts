import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileWalletDetail, CaseFileWalletDetailType, Customer } from 'core-models';
import { CustomersService, PracticeService } from 'core-services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-add-balance',
  templateUrl: './dialog-add-balance.component.html',
  styleUrls: ['./dialog-add-balance.component.scss']
})
export class DialogAddBalanceComponent implements OnInit {

  caseFileWalletDetailForm!:FormGroup;
  caseFileWalletDetail!:CaseFileWalletDetail;
  caseFile!:CaseFile;
  caseFileWalletDetailType = CaseFileWalletDetailType;
  private customer!:Customer;

  constructor(
              private formBuilder:FormBuilder,
              public dialogRef: MatDialogRef<DialogAddBalanceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {caseFile:CaseFile,caseFileWalletDetail:CaseFileWalletDetail},
              private practiceService:PracticeService,
              private customerService:CustomersService,
              private toastr: ToastrService,
              private translateService:TranslateService,
  ) { }

  ngOnInit(): void {
    this.caseFile = this.data.caseFile;
    this.caseFileWalletDetail = this.data.caseFileWalletDetail
    this.initForm();
    this.setForm();
    this.getCustomerById();
  }

  initForm() {
    this.caseFileWalletDetailForm = this.formBuilder.group({
      description: ['',Validators.required],
      amt: ['',Validators.required],
    })
  }

  setForm(){
    if(this.caseFileWalletDetail){
      this.caseFileWalletDetailForm.patchValue({
        ...this.caseFileWalletDetail
      })
    }
  }

  getCustomerById(){
    this.customerService.getCustomerById(this.caseFile.subscription,this.caseFile.customer.uuid || '').subscribe(data => {
      this.customer = data;
    })
  }

  submitForm(createAnother = false){

    const caseFileWalletDetailPayload:CaseFileWalletDetail = {
      ...this.caseFileWalletDetailForm.value,
      type: this.caseFileWalletDetailType.CREDIT,
      case_file: this.caseFile.uuid || '',
      wallet: this.customer.wallet,
      subscription: this.caseFile.subscription
    }

    if(this.caseFileWalletDetail) caseFileWalletDetailPayload.uuid = this.caseFileWalletDetail.uuid;

   if(this.caseFileWalletDetailForm.valid){

    this.practiceService.saveCaseFileWalletDetail(caseFileWalletDetailPayload).subscribe(data => {

      if(this.caseFileWalletDetail){
        this.toastr.success('Ok', this.translateService.instant('successMessages.updated_successfully'));
      }
      else{
        this.toastr.success('Ok', this.translateService.instant('successMessages.created_succesfully'));
      }

      this.dialogRef.close(data);

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
