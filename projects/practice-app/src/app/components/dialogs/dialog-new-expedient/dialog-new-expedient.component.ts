import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, Customer, SecurityUser, TypeCustomer,CaseFilePayload, BillingType, CaseFileStatus } from 'core-models';
import { AuthService, CustomersService,PracticeService,SecurityService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CreateClientComponent } from '../../../pages/client/create-client/create-client.component';

@Component({
  selector: 'app-dialog-new-expedient',
  templateUrl: './dialog-new-expedient.component.html',
  styleUrls: ['./dialog-new-expedient.component.scss']
})
export class DialogNewExpedientComponent implements OnInit {

  selectedSubscription!:any;
  caseFileForm!:FormGroup;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  securityUserSelected!:SecurityUser | undefined;
  typeCustomer = TypeCustomer;
  caseFile!:CaseFile
  billingType = BillingType;
  caseFileStatus = CaseFileStatus;

  constructor(private formBuilder:FormBuilder,
              private customerService:CustomersService,
              private securityService:SecurityService,
              private authService:AuthService,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<DialogNewExpedientComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
            ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSecurityUsers();
    this.initForm();
    this.setCaseFile();
  }

  initForm(){

    this.caseFileForm = this.formBuilder.group({
      name: ['',Validators.required],
      case_no: ['',Validators.required],
      customer: ['',Validators.required],
      assigned_to: ['',Validators.required],
      bt_price_per_hour: [''],
      bt_increment_factor: [0],
      price_per_increment: [0],
      flat_fee_amt:[0],
      receive_retainer: [false],
      hourly_rate: [false],
      increment_of_time: [false],
      flat_fee:[false],
      retainer_amt: [0],
    })

  }

  openCustomerDialog(){
        const dialogRef = this.dialog.open(CreateClientComponent,{
          panelClass: 'fullscreen',
          data: {
            modal:true
          }
      })

      dialogRef.afterClosed().subscribe((result:Customer) => {
        if(result) this.customers.push(result);
      });
  }

  setCaseFile(){
    if(this.data){
      this.caseFile = this.data.caseFile;

      this.caseFileForm.patchValue({
        name: this.caseFile.name,
        customer: this.caseFile.customer.uuid,
        assigned_to: this.caseFile.assigned_to.uuid,
        case_no: this.caseFile.case_no,
        bt_price_per_hour: this.caseFile.bt_price_per_hour,
        bt_increment_factor: this.caseFile.bt_increment_factor,
        price_per_increment: this.caseFile.billing_type === this.billingType.BY_TIME_INCREMENT ? this.caseFile.bt_amt : 0,
        flat_fee_amt:this.caseFile.billing_type === this.billingType.FLAT_FEE ? this.caseFile.bt_amt : 0,
        receive_retainer: this.caseFile.receive_retainer,
        hourly_rate: this.caseFile.billing_type === this.billingType.PER_HOUR,
        increment_of_time: this.caseFile.billing_type === this.billingType.BY_TIME_INCREMENT,
        flat_fee:this.caseFile.billing_type === this.billingType.FLAT_FEE,
        retainer_amt: this.caseFile.retainer_amt
      })

    }

  }

  doesReceiveRetainer(){
    if(this.securityUserSelected) return !this.securityUserSelected.billing_fees[0].allow_retainers && !this.caseFileForm.value.flat_fee;
    if(this.caseFile) return  !this.caseFile.receive_retainer;

    return true;
  }

  getCustomers() {
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.customers = data;
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityUsers = data;
    })
  }

  onChangeAssignto(uuid:string){
    this.securityUserSelected = this.securityUsers.find(x => x.uuid === uuid);

    this.caseFileForm.patchValue({
      bt_price_per_hour: this.securityUserSelected?.billing_fees[0].price_per_hour,
      bt_increment_factor: this.securityUserSelected?.billing_fees[0].increment_factor
    })

  }

  onCheckBillingTypes(billingType:BillingType,value:MatCheckboxChange){

    if(billingType === this.billingType.PER_HOUR && value.checked) this.caseFileForm.patchValue({increment_of_time: false, flat_fee:false})
    if(billingType === this.billingType.BY_TIME_INCREMENT && value.checked) this.caseFileForm.patchValue({hourly_rate: false, flat_fee:false})
    if(billingType === this.billingType.FLAT_FEE && value.checked) this.caseFileForm.patchValue({hourly_rate: false, increment_of_time:false})

  }

  submitForm() {

    const caseFileFormValue = this.caseFileForm.value;

    if(!this.caseFileForm.valid){
      this.toastr.error('Error','Completar campos obligatorios');
      return;
    }

    if(caseFileFormValue.flat_fee &&  Number(caseFileFormValue.retainer_amt) > Number(caseFileFormValue.flat_fee_amt)) {
      this.toastr.error('Error','El monto de retención no puede ser mayor al Flat Fee');
      return;
    }

    if(!caseFileFormValue.hourly_rate && !caseFileFormValue.increment_of_time && !caseFileFormValue.flat_fee){
      this.toastr.error('Error','Debes elegir algun metodo de facturacion');
      return;
    }

    let billingType!:BillingType;
    let billingTypeAmount = 0;

    if(caseFileFormValue.hourly_rate){
      billingType = this.billingType.PER_HOUR;
      billingTypeAmount = caseFileFormValue.bt_price_per_hour
    }

    if(caseFileFormValue.increment_of_time){
      billingType = this.billingType.BY_TIME_INCREMENT;
      billingTypeAmount = caseFileFormValue.price_per_increment
    }

    if(caseFileFormValue.flat_fee){
      billingType = this.billingType.FLAT_FEE;
      billingTypeAmount = caseFileFormValue.flat_fee_amt
    }

    const caseFilePayload: CaseFilePayload = {
      customer: caseFileFormValue.customer,
      assigned_to: caseFileFormValue.assigned_to,
      billing_type: billingType,
      bt_price_per_hour: caseFileFormValue.bt_price_per_hour,
      bt_increment_factor: caseFileFormValue.bt_increment_factor,
      bt_amt: billingTypeAmount,
      retainer_amt: caseFileFormValue.retainer_amt,
      name: caseFileFormValue.name,
      case_no: caseFileFormValue.case_no,
      receive_retainer: caseFileFormValue.receive_retainer,
      subscription: this.selectedSubscription?.ssid.uuid,
    };

    if(this.caseFile) caseFilePayload.uuid = this.caseFile.uuid;

    this.practiceService.saveCaseFile(caseFilePayload).subscribe(data => {
      if(this.caseFile){
        this.toastr.success('Ok', this.translateService.instant('successMessages.updated_successfully'));
      }
      else{
        this.toastr.success('Ok', this.translateService.instant('successMessages.created_succesfully'));
      }

    this.dialogRef.close(data);
  })


  }


}
