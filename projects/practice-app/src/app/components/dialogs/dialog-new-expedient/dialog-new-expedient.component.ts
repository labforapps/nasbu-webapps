import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, Customer, SecurityUser, TypeCustomer,CaseFilePayload, BillingType, CaseFileStatus, AccessType, CaseFileType, VariableDocumentTemplateType } from 'core-models';
import { AuthService, CustomersService,PracticeService,SecurityService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CreateClientComponent } from '../../../pages/client/create-client/create-client.component';
import { MatSelectChange } from '@angular/material/select';
import { CreateTemplatesTypesComponent } from '../../../pages/documents-templates/templates-types/create-templates-types/create-templates-types.component';
import { CreateExpedientTypeComponent } from '../../../pages/expedient/create-expedient-type/create-expedient-type.component';

@Component({
  selector: 'app-dialog-new-expedient',
  templateUrl: './dialog-new-expedient.component.html',
  styleUrls: ['./dialog-new-expedient.component.scss']
})
export class DialogNewExpedientComponent implements OnInit {

  selectedSubscription!:any;
  caseFileForm!:FormGroup;
  variablesForm!:FormGroup;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  securityUserSelected!:SecurityUser | undefined;
  typeCustomer = TypeCustomer;
  caseFile!:CaseFile
  billingType = BillingType;
  caseFileStatus = CaseFileStatus;
  customerFromDialog!:Customer
  accessType = AccessType
  caseFileTypes!:CaseFileType[]
  caseFileTypeFromDialog!:CaseFileType;
  caseFileTypeSelected!:CaseFileType | undefined;
  variablesSections:string[] = []
  totalTabs:number = 1
  activeTabIndex:number = 0
  documentGenerationVariables:VariableDocumentTemplateType[] = []

  constructor(private formBuilder:FormBuilder,
              private customerService:CustomersService,
              private securityService:SecurityService,
              private authService:AuthService,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<DialogNewExpedientComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: {caseFile:CaseFile,customer:Customer,securityUser:SecurityUser}
            ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSecurityUsers();
    this.initForm();
    this.setCaseFile();
    this.getCaseFileTypes()
  }

  initForm(){

    this.caseFileForm = this.formBuilder.group({
      name: ['',Validators.required],
      case_no: [null],
      customer: ['',Validators.required],
      assigned_to: ['',Validators.required],
      access_type: [this.accessType.PUBLIC],
      casefile_type: [''],
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

    this.variablesForm = this.formBuilder.group({})

  }

  openCustomerDialog(){
        const dialogRef = this.dialog.open(CreateClientComponent,{
          panelClass: 'fullscreen',
          data: {
            modal:true
          }
      })

      dialogRef.afterClosed().subscribe((result:Customer) => {
        if(result){
          this.customerFromDialog = result
          this.getCustomers()
        }
      });
  }

  openCreateExpedientType(){
    const dialogRef = this.dialog.open(CreateExpedientTypeComponent,{
      panelClass: 'fullscreen',
      data: {
        modal:true
      }
  })

  dialogRef.afterClosed().subscribe((result:CaseFileType) => {
    if(result){
      this.caseFileTypeFromDialog = result
      this.getCaseFileTypes()
    }
  });
}

  setCaseFile(){
    if(this.dataDialog && this.dataDialog.caseFile){
      this.caseFile = this.dataDialog.caseFile;

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
        retainer_amt: this.caseFile.retainer_amt,
        access_type: this.caseFile.access_type,
        casefile_type: this.caseFile.casefile_type ? this.caseFile.casefile_type.uuid : null
      })

      if(this.caseFile.casefile_type) this.caseFileTypeSelected = this.caseFile.casefile_type

      if(this.caseFile.casefile_type){

        const variables:any = JSON.parse( this.caseFile.custom_variables_data || '')

        Object.keys(variables).forEach(section => {
          Object.keys(variables[section]).forEach(name => {
                this.documentGenerationVariables.push({
                  section: section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convertir snake-case a Título
                  name: name,
                  description: name.replace('cf_','').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  value_path: `custom.${section}.${name}`,
              });

              this.variablesForm.addControl(`custom.${section}.${name}`,this.formBuilder.control(`${variables[section][name]}`))

          });
      });

         this.variablesSections = [...new Set( this.documentGenerationVariables ? this.documentGenerationVariables.map((item:any) => item.section) : '')]
         this.totalTabs = 1 + this.variablesSections.length

      }
    }

  }

  onSetDocumentTemplateType(selection:MatSelectChange){

   this.setVariablesSectionCaseFileForm(selection.value)

  }

  setVariablesSectionCaseFileForm(uuid:string) {

    this.caseFileTypeSelected = this.caseFileTypes.find(x => x.uuid === uuid)

    this.caseFileTypeSelected?.variables?.forEach(x => this.variablesForm.addControl(`${x.value_path}`,this.formBuilder.control('')))
    this.variablesSections = [...new Set( this.caseFileTypeSelected?.variables ? this.caseFileTypeSelected.variables.map(item => item.section) : '')]
    this.totalTabs = 1 + this.variablesSections.length

  }

  doesReceiveRetainer(){
    if(this.securityUserSelected && this.securityUserSelected.billing_fees.length > 0) return !this.securityUserSelected.billing_fees[0].allow_retainers && !this.caseFileForm.value.flat_fee;
    if(this.caseFile) return  !this.caseFile.receive_retainer;

    return true;
  }

  getCustomers() {
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.customers = data;
      if(this.dataDialog && this.dataDialog.customer) this.caseFileForm.patchValue({customer: this.dataDialog.customer.uuid})
      if(this.customerFromDialog) this.caseFileForm.patchValue({customer: this.customerFromDialog.uuid})
    })
  }

  getCaseFileTypes(){
    this.practiceService.getCaseFileTypes(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFileTypes = data
      if(this.caseFileTypeFromDialog) {
        this.caseFileForm.patchValue({casefile_type: this.caseFileTypeFromDialog.uuid})
        this.setVariablesSectionCaseFileForm(this.caseFileTypeFromDialog.uuid || '')
      }
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityUsers = data;
      if(this.dataDialog && this.dataDialog.securityUser) this.caseFileForm.patchValue({assigned_to: this.dataDialog.securityUser.uuid})
    })
  }

  onChangeAssignto(uuid:string){
    this.securityUserSelected = this.securityUsers.find(x => x.uuid === uuid);

   if(this.securityUserSelected?.billing_fees && this.securityUserSelected?.billing_fees.length > 0){
      this.caseFileForm.patchValue({
        bt_price_per_hour: this.securityUserSelected?.billing_fees[0].price_per_hour,
        bt_increment_factor: this.securityUserSelected?.billing_fees[0].increment_factor
      })
   }

  }

  onCheckBillingTypes(billingType:BillingType,value:MatCheckboxChange){

    if(billingType === this.billingType.PER_HOUR && value.checked) this.caseFileForm.patchValue({increment_of_time: false, flat_fee:false})
    if(billingType === this.billingType.BY_TIME_INCREMENT && value.checked) this.caseFileForm.patchValue({hourly_rate: false, flat_fee:false})
    if(billingType === this.billingType.FLAT_FEE && value.checked) this.caseFileForm.patchValue({hourly_rate: false, increment_of_time:false})

  }


  goToNextTab(){
    this.activeTabIndex += 1
  }

  goToPreviousTab(){
    this.activeTabIndex -= 1
  }

  slugify(str:string) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
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

    const customVariableData:any = {};

    this.variablesSections.forEach((x:string) => {

      const variables = this.caseFileTypeSelected?.variables?.filter((y:VariableDocumentTemplateType) => y.section === x);

      const section: string = this.slugify(x);
      customVariableData[section] = variables?.map(variable => {

        const obj:{[s: string] : string} = {}

        obj[`${variable.code}`] =  this.variablesForm.value[variable.value_path];

        return obj
      }).reduce((a,b)  => { return { ...a,...b } },{} )
    })

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
      access_type: caseFileFormValue.access_type,
      subscription: this.selectedSubscription?.ssid.uuid,
      casefile_type: caseFileFormValue.casefile_type,
      custom_variables_data: JSON.stringify(customVariableData)
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
