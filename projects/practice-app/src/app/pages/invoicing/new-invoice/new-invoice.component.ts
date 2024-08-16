import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Action, BillingCharge, BillingType, CaseFile, Country, Customer, CustomerWalletSummary, Invoice,
         InvoicePayload, Subscription, SubscriptionBillingFee } from 'core-models';
import { AuthService, CustomersService, SubscriptionService,CommonService, AccountingService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { FormService } from '../../../services/form.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogSendInvoiceComponent } from '../../../components/dialogs/dialog-send-invoice/dialog-send-invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogAddTaxComponent } from '../../../components/dialogs/dialog-add-tax/dialog-add-tax.component';

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
  invoiceId!:string;
  invoice!:Invoice;
  exitInvoice:boolean = false;
  subscriptionBillingFee!:SubscriptionBillingFee[];
  applyTax:boolean = false
  action!:Action | string
  actionEnum = Action
  customerWalletSummary!:CustomerWalletSummary;

  constructor(private customerService:CustomersService,
              private authService: AuthService,
              private subscriptionService:SubscriptionService,
              private CommonService:CommonService,
              private formBuilder:FormBuilder,
              private HelpersService:HelpersService,
              private formService:FormService,
              private accountingService:AccountingService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private dialog:MatDialog
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomers();
    this.getSubscriptionInformation();
    this.getCountries();
    this.initForm();
    this.getSubscriptionBillingFee()

    this.action = this.activatedRoute.snapshot.paramMap.get('action') || '';
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
          total_hours: [0],
          bt_price_per_hour: [0],
          total_amt: [0],
          related_charge: [null],
          bt_amt: 0,
          is_legal_charge: [false],
          total_retainer_amt: [0]
        })
      ])
    })

    if (!this.invoice) {
      this.invoiceForm.patchValue({
        inv_date: moment().format('YYYY-MM-DD'),
        inv_exp_date: moment().add(30, 'days').format('YYYY-MM-DD')
      });
    }


    this.formService.removeItemFormArray(this.invoiceForm,'details',0);

  }

  setDataInForm(){
    if(this.invoice){
      this.invoiceForm.patchValue({
        customer: this.invoice.customer.uuid,
        case_file: this.invoice.case_file ?  this.invoice.case_file.uuid : null,
        inv_date: this.invoice.inv_date,
        inv_exp_date: this.invoice.inv_exp_date,
        gross_amt: this.invoice.gross_amt,
        tax_amt: this.invoice.tax_amt,
        discount_amt: this.invoice.discount_amt,
        legal_charges_amt: this.invoice.legal_charges_amt,
        net_amt: this.invoice.net_amt
      })

      this.invoice.details?.forEach(x => this.formService.addItemFormArray(this.invoiceForm,'details',{
        description: x.description,
        billing_type: x.billing_type,
        total_hours: x.total_hours,
        bt_price_per_hour: x.bt_price_per_hour,
        total_amt: x.total_amt,
        related_charge: x.related_charge,
        bt_amt: x.total_amt,
        is_legal_charge: x.is_legal_charge,
        total_retainer_amt: x.retainer_amt
      }));
    }
  }

  getCustomerWalletSummary(){
    this.customerService.getWalletSummaryByCustomerId(this.selectedSubscription?.ssid.uuid,this.customerSelected?.uuid || '').subscribe({
      next: (data) => {
        this.customerWalletSummary = data
      }
    })
  }

  disableCaseFileField(event:MatCheckboxChange){
   event.checked ? this.invoiceForm.get('case_file')?.disable() : this.invoiceForm.get('case_file')?.enable()
  }

  getInvoiceById() {
    this.invoiceId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    if (this.invoiceId != '') {

      this.accountingService
      .getInvoiceById(this.selectedSubscription?.ssid.uuid, this.invoiceId || '')
      .subscribe((data) => {
        this.invoice = data;
        this.customerSelected = this.customers.find( x => x.uuid === this.invoice.customer.uuid);

        this.customerService.getCaseFilesByCustomer(this.selectedSubscription?.ssid.uuid,this.customerSelected?.uuid || '').subscribe((data:CaseFile[]) => {
          this.caseFiles = data;
          this.setDataInForm();
        })

      });
    }
  }

  getSubscriptionBillingFee(){
    this.subscriptionService.getSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscriptionBillingFee = data;
    })
  }

  get totalInvoiceAmount(){
    const total = this.subTotalInvoiceAmount * (1 + (this.taxInvoice / 100));
    const totalWithTwoDecimals = parseFloat(total.toFixed(2));
    this.invoiceForm.patchValue({net_amt: totalWithTwoDecimals})
    return totalWithTwoDecimals;
  }


  get subTotalInvoiceAmount(){
    const sumTotals = (arr: { total_amt: number }[]) => arr.reduce((acc: number, item) => acc + Number(item.total_amt), 0);
    const subTotal = sumTotals(this.invoiceForm.value.details);
    this.invoiceForm.patchValue({gross_amt: subTotal  })
    return subTotal;
  }

  get totalTaxInvoiceAmount() {
    const tax_amt = this.subTotalInvoiceAmount * (this.taxInvoice / 100);
    const roundedTaxAmt = parseFloat(tax_amt.toFixed(2));

    this.invoiceForm.patchValue({ tax_amt: roundedTaxAmt })
    return roundedTaxAmt;
  }

  get taxInvoice(){
    return this.applyTax ?  Number(this.subscriptionBillingFee[0].tax_pct) : 0;
  }

  openDialogAddTax(){

    if(this.subscriptionBillingFee.length === 0 || this.subscriptionBillingFee[0].tax_pct === "0.00"){

      const dialogRef = this.dialog.open(DialogAddTaxComponent, {
        data: {
          subscriptionBillingFee: this.subscriptionBillingFee
        }
      })

      dialogRef.afterClosed().subscribe(data => {
        if(data){
          this.subscriptionBillingFee = data
        }
        else{
          this.applyTax = false
        }
      })

    }

  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.invoiceForm,formArray);
  }

  addInvoiceDetail(formArray:string,is_legal_charge:boolean){
    const item = {
          description: ['',Validators.required],
          billing_type: [this.billingType.PER_HOUR,Validators.required],
          total_hours: [0],
          bt_price_per_hour: [0],
          total_amt: [0],
          related_charge: [null],
          bt_amt: 0,
          is_legal_charge: [is_legal_charge],
          total_retainer_amt: [0],
          manual_entry: true
    }
    this.formService.addItemFormArray(this.invoiceForm,formArray,item);
  }

  returnIndexFormArrayInvoiceDetail(detail:any){
    const index =  this.formService.returnIndexFormArrayInvoiceDetail(this.invoiceForm,detail);
    return index !== -1 ? index : 0
  }

  removeItemFormArray(formArray:string,detail:any){
    const index = this.formService.returnIndexFormArrayInvoiceDetail(this.invoiceForm,detail);
    this.formService.removeItemFormArray(this.invoiceForm,formArray,index);
  }

  filterFormArray(formArray:string,field:string,value:any){
    return this.formService.filterFormArray(this.invoiceForm,formArray,field,value);
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe((data:Customer[]) => {
      this.customers = data;
      this.getInvoiceById();
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
    this.getCustomerWalletSummary()
    this.getCaseFiles();
  }

  onChangeCaseFile(selectChange:MatSelectChange){

    this.caseFileSelected = this.caseFiles.find( x => x.uuid === selectChange.value);

    this.accountingService.getPendingBillingCharges(this.selectedSubscription?.ssid.uuid).subscribe((data:BillingCharge[]) => {
      this.billingCharges = data.filter(x => this.caseFileSelected && x.case_file.uuid === this.caseFileSelected.uuid);
      this.billingCharges.forEach(x => this.formService.addItemFormArray(this.invoiceForm,'details',{
          description: x.task.name,
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

  onChangeInvoiceDetail(formArray:string,detail:any){

    const index = this.formService.returnIndexFormArrayInvoiceDetail(this.invoiceForm,detail)

    const invoice = this.invoiceForm.value.details[index];

    let total = 0;

    if(invoice.billing_type === this.billingType.PER_HOUR) {
      total = (invoice.bt_price_per_hour * invoice.total_hours) - invoice.total_retainer_amt;
      (this.invoiceForm.get(formArray) as FormArray)?.at(index).patchValue({
        bt_amt: 0,
        total_amt: Number(total).toFixed(2)
      });
    }
    if(invoice.billing_type === this.billingType.FLAT_FEE) {
      total = invoice.bt_amt  - invoice.total_retainer_amt;
      (this.invoiceForm.get(formArray) as FormArray)?.at(index).patchValue({
        total_hours: 0,
        bt_price_per_hour: 0,
        total_amt: Number(total).toFixed(2)
      });
    }


  }

  submitForm(){

    if(!this.invoiceForm.valid){
      this.HelpersService.showMessageRequiredFields();
      return;
    }

    const invoiceForm = this.invoiceForm.value;

    const invoice:InvoicePayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      ...invoiceForm,
      inv_date : moment(invoiceForm.inv_date).format("YYYY-MM-DD"),
      inv_exp_date: moment(invoiceForm.inv_exp_date).format("YYYY-MM-DD"),
      apply_tax: this.applyTax
    };

    if(this.invoiceId) invoice.uuid = this.invoiceId;

    this.accountingService.saveInvoice(invoice).subscribe(data => {

      if(invoice.uuid){
        this.HelpersService.showMessageUpdated();
      }
      else{
        this.HelpersService.showMessageCreated();
        this.exitInvoice = true;
        this.router.navigate([`/invoicing/edit-invoice/${data.uuid}`])
      }

    })

  }

  openDialogSendInvoice() {
    this.dialog.open(DialogSendInvoiceComponent,{
      data: {
        invoice:this.invoice
      }
    });
  }

  canDeactivate(): Promise<boolean> {
    if(!this.exitInvoice) {
      return this.HelpersService.showConfirmationExitInvoice().then(result => {
        return result.isConfirmed;
      });
    } else {
      return Promise.resolve(true);
    }
  }

  downloadInvoice() {
    this.accountingService.downloadInvoice(this.invoice).subscribe({
      next: (data) => { this.HelpersService.downloadDocument(data) }
    })
  }



}
