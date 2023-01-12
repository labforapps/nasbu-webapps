import { Component, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../components/dialogs/dialog-list/dialog-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import { Customer, SelectedSubscription,Country,Address,Contact,TypeContact,SubtypeContact,Occupation } from 'core-models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;
  customer_type: string = 'P';
  countries!: Country[];
  customer!: Customer;
  customer_contacts_phone: Contact[] = [];
  customer_contacts_email: Contact[] = [];
  customer_address: Address[] = [];
  subtypeContact = SubtypeContact;
  occupations!: Occupation[];
  checked_share_same_info: boolean = false;

  customerId!: string;

  createClientForm = this._formBuilder.group({
    subscription: ['', Validators.required],
    intake_request: [''],
    type: [this.customer_type, Validators.required],
    document_type: ['I'],
    document_no: ['ad cupidatat nu'],
    company_name: ['Company'],
    first_name: [''],
    last_name: [''],
    occupation: [''],
    marital_status: [''],
    born_date: [''],
  });

  constructor(
    public dialog: MatDialog,
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.fetchCountries();
    this.fetchOccupations();
    this.getCustomerById();
    this.initCustomerContacts();
    this.initCustomerAddress();
  }

  getCustomerById() {
    this.customerId = this.ActivatedRoute.snapshot.paramMap.get('id') || '';

    if (this.customerId != '') {
      this.customerService
        .getCustomerById(this.selectedSubscription?.ssid.uuid, this.customerId)
        .subscribe((data) => {
          console.log(data);
          this.customer = data;
          this.setDataInForm();
        });
    }
  }

  setDataInForm() {
    this.customer_type = this.customer.type;

    this.createClientForm.setValue({
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

    const customer_contacts_phone = this.customer.contacts.filter(
      (x) => x.type === 'P'
    );

    if (customer_contacts_phone.length > 0)
      this.customer_contacts_phone = customer_contacts_phone;

    const customer_contacts_email = this.customer.contacts.filter(
      (x) => x.type === 'E'
    );

    if (customer_contacts_email.length > 0)
      this.customer_contacts_email = customer_contacts_email;

    if (this.customer.addresses.length > 0)
      this.customer_address = this.customer.addresses;
  }

  initCustomerContacts() {
    if (this.customer_contacts_phone.length === 0) {
      this.customer_contacts_phone.push({
        customer: '',
        type: TypeContact.phone_number,
        sub_type: '',
        contact_value: '',
      });
    }

    if (this.customer_contacts_email.length === 0) {
      this.customer_contacts_email.push({
        customer: '',
        type: TypeContact.email,
        sub_type: '',
        contact_value: '',
      });
    }
  }

  initCustomerAddress() {
    if (this.customer_address.length === 0) {
      this.customer_address.push({
        customer: '',
        physical_country: '',
        physical_city: '',
        physical_address: '',
        physical_postal_code: '',
        postal_city: '',
        postal_address: '',
        postal_postal_code: '',
        share_same_info: false,
      });
    }
  }

  addCustomerContactPhone() {
    this.customer_contacts_phone.push({
      customer: '',
      type: TypeContact.phone_number,
      sub_type: '',
      contact_value: '',
    });
  }

  addCustomerContactEmail() {
    this.customer_contacts_email.push({
      customer: '',
      type: TypeContact.email,
      sub_type: '',
      contact_value: '',
    });
  }

  addCustomerAddress() {
    this.customer_address.push({
      customer: '',
      physical_country: '',
      physical_city: '',
      physical_address: '',
      physical_postal_code: '',
      postal_city: '',
      postal_address: '',
      postal_postal_code: '',
      share_same_info: false,
    });
  }

  openDialogList() {
    this.dialog.open(DialogListComponent);
  }

  setCustomerType(value: string) {
    this.customer_type = value;

    this.createClientForm.patchValue({
      type: value,
    });
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  fetchOccupations() {
    this.commonService.getOccupations().subscribe((data) => {
      this.occupations = data;
    });
  }

  submitForm(create_another=false) {
    const customerContacts: Contact[] = this.customer_contacts_phone.concat(
      this.customer_contacts_email
    );

    const createClient: Customer = {
      ...this.createClientForm.value,
      subscription: this.selectedSubscription?.ssid.uuid,
      contacts: customerContacts,
      addresses: this.customer_address,
    };
    console.log(createClient);

    if (this.customerId != '') {
      this.updateCustomer(createClient);
    } else {
      this.createCustomer(createClient,create_another);
    }
  }

  createCustomer(body: any,create_another=false) {
    this.customerService.createCustomer(body).subscribe((data) => {
      console.log(data);
      this.toastr.success('Successfully', 'Customer Created');
      if(create_another)
      {
        console.log('create another');
        //this.router.navigate(['customers/create']);
        this.resetForm();
      }
    });
  }

  updateCustomer(body: any) {
    this.customerService
      .updateCustomer(
        this.selectedSubscription.ssid.uuid,
        this.customerId,
        body
      )
      .subscribe((data) => {
        console.log(data);
        this.toastr.success('Successfully', 'Customer Updated');
      });
  }

  changeValueCheckboxAddress(address: Address) {
    address.share_same_info = !address.share_same_info;

    if (address.share_same_info) {
      address.postal_city = address.physical_city;
      address.postal_address = address.physical_address;
      address.postal_postal_code = address.physical_postal_code;
    } else {
      address.postal_city = '';
      address.postal_address = '';
      address.postal_postal_code = '';
    }
  }

  resetForm()
  {
    this.createClientForm.reset();
    this.customer_contacts_email = [];
    this.customer_contacts_phone = [];
    this.customer_address = [];

    this.initCustomerContacts();
    this.initCustomerAddress();

    this.customer_type = 'P';
  }
}
