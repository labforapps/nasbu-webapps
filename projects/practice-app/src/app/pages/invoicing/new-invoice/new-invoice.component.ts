import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BillingCharge, BillingType, CaseFile, Country, Customer, InvoicePayload, Subscription, Task } from 'core-models';
import { AuthService, CustomersService, PracticeService, SubscriptionService,CommonService, AccountingService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { FormService } from '../../../services/form.service';
import * as moment from 'moment';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent implements OnInit {

  customers!:Customer[];
  caseFiles!:CaseFile[];
  selectedSubscription!:any;
  customerSelected!:Customer | undefined;
  caseFileSelected!:CaseFile | undefined;
  subscriptionInfo!:Subscription;
  countries:Country[] = [];
  invoiceForm!:FormGroup;
  billingType = BillingType;
  billingCharges!:BillingCharge[];

  constructor(private customerService:CustomersService,
              private practiceService:PracticeService,
              private authService: AuthService,
              private subscriptionService:SubscriptionService,
              private CommonService:CommonService,
              private formBuilder:FormBuilder,
              private HelpersService:HelpersService,
              private formService:FormService,
              private accountingService:AccountingService
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSubscriptionInformation();
    this.getCountries();
    this.initForm();
  }

  initForm(){

    this.invoiceForm = this.formBuilder.group({
      customer: ['', Validators.required],
      case_file: [''],
      inv_date: ['',Validators.required],
      inv_exp_date: ['',Validators.required],
      gross_amt: [0],
      tax_amt: [0],
      discount_amt: [0],
      legal_charges_amt: [0],
      net_amt: [0],
      details: this.formBuilder.array([
        this.formBuilder.group({
          description: ['',Validators.required],
          billing_type: ['',Validators.required],
          total_hours: [''],
          bt_price_per_hour: [''],
          total_amt: [0],
          related_charge: [''],
          bt_amt: 0,
          is_legal_charge: [false]
        })
      ])
    })

    this.formService.removeItemFormArray(this.invoiceForm,'details',0);

  }

  setForm(){

  }

  get totalInvoiceAmount(){
   const total = Math.round(this.subTotalInvoiceAmount * (1 + (this.taxInvoice / 100)))
   this.invoiceForm.patchValue({net_amt: total  })
   return total;
  }

  get subTotalInvoiceAmount(){
    const sumTotals = (arr: { total_amt: number }[]) => arr.reduce((acc: number, item) => acc + Number(item.total_amt), 0);
    const subTotal = sumTotals(this.invoiceForm.value.details);
    this.invoiceForm.patchValue({gross_amt: subTotal  })
    return subTotal;
  }

  get totalTaxInvoiceAmount(){
    const tax_amt = this.subTotalInvoiceAmount * (this.taxInvoice / 100);
    this.invoiceForm.patchValue({tax_amt: tax_amt  })
    return tax_amt;
  }

  get taxInvoice(){
    return 13;
  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.invoiceForm,formArray);
  }

  addInvoiceDetail(formArray:string,is_legal_charge:boolean){
    const item = {
          description: ['',Validators.required],
          billing_type: ['',Validators.required],
          total_hours: [''],
          bt_price_per_hour: [0],
          total_amt: [0],
          related_charge: [''],
          bt_amt: 0,
          is_legal_charge: [is_legal_charge]
    }
    this.formService.addItemFormArray(this.invoiceForm,formArray,item);
  }

  removeItemFormArray(formArray:string,index:number){
    this.formService.removeItemFormArray(this.invoiceForm,formArray,index);
  }

  filterFormArray(formArray:string,field:string,value:any){
    return this.formService.filterFormArray(this.invoiceForm,formArray,field,value);
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe((data:Customer[]) => {
      this.customers = data;
    })
  }

  getCaseFiles(){
    this.customerService.getCaseFilesByCustomer(this.selectedSubscription?.ssid.uuid,this.customerSelected?.uuid || '').subscribe((data:CaseFile[]) => {
      this.caseFiles = data;
    })
  }

  getCountries(){
    this.CommonService.getCountries().subscribe((data:Country[]) => {
      this.countries = data;
    })
  }

  getSubscriptionInformation(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe((data:Subscription) => {
      this.subscriptionInfo = data;
    })
  }

  returnCountryName(countryUUID:string){
    const country = this.countries.find(x => x.uuid === countryUUID);
    return country?.name;
  }

  onChangeCustomer(selectChange:MatSelectChange){
    this.customerSelected = this.customers.find( x => x.uuid === selectChange.value);
    this.getCaseFiles();
  }

  onChangeCaseFile(selectChange:MatSelectChange){

    this.caseFileSelected = this.caseFiles.find( x => x.uuid === selectChange.value);

    this.accountingService.getPendingBillingCharges(this.selectedSubscription?.ssid.uuid).subscribe((data:BillingCharge[]) => {
      this.billingCharges = data.filter(x => this.caseFileSelected && x.case_file.uuid === this.caseFileSelected.uuid);
      this.billingCharges.forEach(x => this.formService.addItemFormArray(this.invoiceForm,'details',{
          description: x.description,
          billing_type: x.billing_type,
          total_hours: x.total_hours,
          bt_price_per_hour: x.bt_price_per_hour,
          total_amt: x.total_amt,
          related_charge: x.uuid,
          bt_amt: x.total_amt,
          is_legal_charge: x.is_legal_charge
      }));
    })
  }

  onChangeInvoiceDetail(formArray:string,index:number){

    const invoice = this.invoiceForm.value.details[index];

    let total = 0;

    if(invoice.billing_type === this.billingType.PER_HOUR) total = invoice.bt_price_per_hour * invoice.total_hours;
    if(invoice.billing_type === this.billingType.FLAT_FEE) total = invoice.bt_amt;

    (this.invoiceForm.get(formArray) as FormArray)?.at(index).patchValue({total});
  }

  submitForm(){
    console.log(this.invoiceForm.value);

    const invoiceForm = this.invoiceForm.value;

    const invoice:InvoicePayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      ...invoiceForm,
      inv_date : moment(invoiceForm.inv_date).format("YYYY-MM-DD"),
      inv_exp_date: moment(invoiceForm.inv_exp_date).format("YYYY-MM-DD")
    };

    console.log(invoice);

    this.accountingService.createInvoice(invoice).subscribe(data => {
      this.HelpersService.showMessageCreated();
    })

  }

  canDeactivate(): Promise<boolean> {
    return this.HelpersService.showConfirmationExitInvoice().then(result => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }


}
