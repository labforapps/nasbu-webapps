import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import {Customer,SelectedSubscription,Country,TypeContact,SubtypeContact,Occupation,TypeCustomer,} from 'core-models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from '../../../services/form.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HelpersService } from '../../../services/helpers.service';
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;
  customer!: Customer;
  customer_type: string = TypeCustomer.person;
  typeCustomer = TypeCustomer;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;
  countries!: Country[];
  countriesCopy!:Country[]
  occupations!: Occupation[];
  imagenSubir!: File;
  imgTemp!: any;

  customerId!: string;
  linked_customer!: string;

  createClientForm!: FormGroup;
  dialogRef: MatDialogRef<CreateClientComponent>;
  image_url!:string;

  constructor(
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translateService: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    @Optional() dialogRef: MatDialogRef<CreateClientComponent>,
    private formService:FormService,
    private helperService:HelpersService
  ) {
    this.dialogRef = dialogRef;
  }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.fetchCountries();
    this.fetchOccupations();
    this.getCustomerById();

    this.initCreateClientForm();
  }

  initCreateClientForm() {

    this.createClientForm = this._formBuilder.group({
      subscription: [''],
      intake_request: [''],
      type: [this.customer_type, Validators.required],
      document_type: ['I'],
      document_no: ['ad cupidatat nu'],
      company_name: [null],
      first_name: [null],
      last_name: [null],
      occupation: [null],
      marital_status: [null],
      born_date: [null],
      contacts: this._formBuilder.array([
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: ['P', Validators.required],
          contact_value: ['', Validators.required],
        }),
        this._formBuilder.group({
          type: this.typeContact.email,
          sub_type:
            this.customer_type === TypeCustomer.person
              ? this.subtypeContact.personal_email
              : this.subtypeContact.business_email,
          contact_value: ['', [Validators.required, Validators.email]],
        }),
      ]),
      addresses: this._formBuilder.array([
        this._formBuilder.group({
          physical_country: ['', Validators.required],
          physical_city: ['', Validators.required],
          physical_address: ['', Validators.required],
          physical_postal_code: ['', Validators.required],
          postal_city: ['', Validators.required],
          postal_address: ['', Validators.required],
          postal_postal_code: ['', Validators.required],
        }),
      ]),
    });
  }

  setFormValidations(){
    const isPerson = this.customer_type === TypeCustomer.person;
    const isBussiness = this.customer_type === TypeCustomer.business

    this.formService.setFormControlValidations(this.createClientForm,'first_name',isPerson,null)
    this.formService.setFormControlValidations(this.createClientForm,'last_name',isPerson,null)
    this.formService.setFormControlValidations(this.createClientForm,'occupation',isPerson,null)
    this.formService.setFormControlValidations(this.createClientForm,'marital_status',isPerson,null)

    this.formService.setFormControlValidations(this.createClientForm,'company_name',isBussiness,null)
  }

  returnFormArray(formArray: string) {
    return (this.createClientForm.get(formArray) as FormArray).controls;
  }

  returnFormArrayFields(formArray: string, index: number, field: string) {
    return (this.createClientForm.get(formArray) as FormArray)?.at(index).get(field);
  }

  returnContactFormArrayFields(formArray:string,field:any,index = 0,contact = null){
    if(contact) index = this.returnIndexFormArrayContact(contact);
    return this.formService.returnFormArrayFields(this.createClientForm,formArray,index,field);
  }

  addContactItem(formArray:string,item:any){
    item = {
      type:item.type,
      sub_type:item.sub_type,
      contact_value: item.contact_value
    }
    this.formService.addItemFormArray(this.createClientForm,formArray,item);
  }

  addAddressItem(formArray:string,item:any){
    delete item.uuid;
    delete item.address_id;
    this.formService.addItemFormArray(this.createClientForm,formArray,item);
  }

  returnValueFormField(index: number) {
    return (this.createClientForm.get('contacts') as FormArray)?.at(index).get('contact_value')?.value;
  }

  removeItemFormArray(formArray:string,index:number){
    this.formService.removeItemFormArray(this.createClientForm,formArray,index);
  }

  setPhoneField(contact:any,event:any) {
    const index = this.returnIndexFormArrayContact(contact);
    (this.createClientForm.get('contacts') as FormArray)?.at(index).patchValue({
      contact_value: event,
    });
  }

  returnIndexFormArrayContact(contact:any){
    return this.formService.returnIndexFormArrayContact(this.createClientForm,contact);
  }

  getCustomerById() {
    this.customerId = this.ActivatedRoute.snapshot.paramMap.get('id') || '';

    if (this.customerId != '') {
      this.customerService.getCustomerById(this.selectedSubscription?.ssid.uuid, this.customerId)
        .subscribe((data) => {
          this.customer = data;
          this.image_url = this.customer.image
          this.setDataInForm();
        });
    }
  }

  setDataInForm() {
    this.customer_type = this.customer.type;

    this.createClientForm.patchValue({
      subscription: this.selectedSubscription?.ssid.uuid,
      first_name: this.customer?.first_name,
      last_name: this.customer.last_name,
      type: this.customer.type,
      intake_request: '',
      document_type: 'I',
      document_no: 'dgf',
      company_name: this.customer.company_name,
      born_date: this.customer.born_date,
      occupation: this.customer.occupation,
      marital_status: this.customer.marital_status,
    });

    this.removeItem('addresses', 0);

    for (let i = 0; i < this.customer.addresses.length; i++) {
      (this.createClientForm.get('addresses') as FormArray).push(
        this._formBuilder.group({
          ...this.customer.addresses[i],
        })
      );
    }

    this.removeItem('contacts', 0);
    this.removeItem('contacts', 0);

    for (let i = 0; i < this.customer.contacts.length; i++) {
      (this.createClientForm.get('contacts') as FormArray).push(
        this._formBuilder.group({
          ...this.customer.contacts[i],
        })
      );
    }
  }

  setLinkedCustomer(event: any) {
    this.linked_customer = event;

    if(this.customer && this.linked_customer)
    {
      this.linkToCustomer(this.customer);
    }
    if(this.customer && this.linked_customer === null)
    {
      this.customerService.updateCustomer(this.selectedSubscription?.ssid.uuid,this.customerId,{...this.customer,linked_customer:null})
      .subscribe(data => {
      })
    }

  }

  filterFormArray(formArray:string,field:string,value:string){
    return this.formService.filterFormArray(this.createClientForm,formArray,field,value);
  }

  deleteContact(contact:any){
    this.formService.deleteContactFormArray(this.createClientForm,contact);
  }

  removeItem(formArray: string, index: number) {
    (this.createClientForm.get(formArray) as FormArray).removeAt(index);
  }

  setCustomerType(value: string) {
    this.customer_type = value;

    this.createClientForm.patchValue({
      type: value,
    });

    const formArrayFields = this.returnFormArray('contacts');

    for (let i = 0; i < formArrayFields.length; i++) {
      if (this.returnFormArrayFields('contacts', i, 'type')?.value === 'E')
      {
        (this.createClientForm.get('contacts') as FormArray)
          ?.at(i)
          ?.patchValue({
            sub_type: this.customer_type === 'P' ? 'E' : 'B',
          });
      }
      if (this.returnFormArrayFields('contacts', i, 'type')?.value === 'P')
      {
        (this.createClientForm.get('contacts') as FormArray)
          ?.at(i)
          ?.patchValue({
            sub_type: this.customer_type === 'P' ? 'P' : 'O',
          });
      }

    }
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
      this.countriesCopy = data
    });
  }

  fetchOccupations() {
    this.commonService.getOccupations().subscribe((data) => {
      this.occupations = data;
    });
  }

  onKey(event: KeyboardEvent) {
     const value = event.key
     this.countries = this.searchCountry(value);
  }

  searchCountry(value: string) {
    let filter = value.toLowerCase();
    const countriesFiltered = this.countries.filter(option => option.name.toLowerCase().startsWith(filter));

    if(countriesFiltered.length === 0) return this.countriesCopy

    return countriesFiltered

  }

  submitForm(create_another = false) {
    this.setFormValidations();

    if(this.createClientForm.invalid){
      this.toastr.error('Error','Completar campos obligatorios');
      return;
    }

    const createClient: Customer = {
      ...this.createClientForm.value,
      born_date: this.createClientForm.value.born_date === '' ? null : this.createClientForm.value.born_date,
      subscription: this.selectedSubscription?.ssid.uuid,
      uuid: this.customerId,
      image: this.imagenSubir
    };

    this.customerService.saveCustomer(createClient).subscribe((data) => {
      this.toastr.success('Ok',this.translateService.instant('successMessages.created_succesfully'));

      if(this.dataDialog) {
        this.dialogRef.close(data);
        return;
      }

      if (create_another) {
        this.resetForm();
      } else {
        if (this.linked_customer) {
          this.linkToCustomer(data);
        } else {
          if(createClient.uuid === null || createClient.uuid === '') this.router.navigate(['customers']);
        }
      }
    });


  }

  linkToCustomer(data:any){

    let body: any;

    body = {
      ...data,
      linked_customer: this.linked_customer,
    };

    this.customerService
      .linkToCustomer(
        this.selectedSubscription?.ssid.uuid,
        data.uuid || '',
        body
      )
      .subscribe((data) => {
        this.router.navigate(['customers/edit', data.uuid]);
      });
  }

  changeValueCheckboxAddress(event: MatCheckboxChange, index: number) {
    this.formService.changeValueCheckboxAddress(this.createClientForm,event,index);
  }

  resetForm() {
    this.createClientForm.reset();
    this.addContactItem('contacts', 'E');
    this.addContactItem('contacts', 'P');
    this.customer_type = 'P';
    this.imgTemp = null;

  }

  goBack(){
    if(this.dataDialog){
      this.dialogRef.close();
    }
    else{
      this.router.navigate(['/customers']);
    }
  }

  setLogoFile(event:any){
    this.imagenSubir = event;
  }


}
