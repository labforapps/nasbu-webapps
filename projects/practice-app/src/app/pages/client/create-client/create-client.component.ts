import { Component, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../components/dialogs/dialog-list/dialog-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import {
  Customer,
  SelectedSubscription,
  Country,
  Address,
  Contact,
  TypeContact,
  SubtypeContact,
  Occupation,
  TypeCustomer,
} from 'core-models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;
  customer_type: string = TypeCustomer.person;
  countries!: Country[];
  customer!: Customer;
  customer_contacts_phone: Contact[] = [];
  customer_contacts_email: Contact[] = [];
  customer_address: Address[] = [];
  subtypeContact = SubtypeContact;
  occupations!: Occupation[];
  checked_share_same_info: boolean = false;
  imagenSubir!: File;
  imgTemp!: any;

  customerId!: string;

  createClientForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.fetchCountries();
    this.fetchOccupations();
    this.getCustomerById();
    this.initCustomerContacts();
    this.initCustomerAddress();

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
    });
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
        type: TypeContact.phone_number,
        sub_type: SubtypeContact.cellphone_number,
        contact_value: '',
      });
    }

    if (this.customer_contacts_email.length === 0) {
      this.customer_contacts_email.push({
        type: TypeContact.email,
        sub_type: SubtypeContact.personal_email,
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
      type: TypeContact.phone_number,
      sub_type: SubtypeContact.cellphone_number,
      contact_value: '',
    });
  }

  addCustomerContactEmail() {
    this.customer_contacts_email.push({
      type: TypeContact.email,
      sub_type: SubtypeContact.personal_email,
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

  validateClientFormFields() {
    let fields_validate_required: any[] = [];
    let fields_validate_non_required: any[] = [];

    switch (this.customer_type) {
      case TypeCustomer.person:
        fields_validate_required = [
          'first_name',
          'last_name',
          'occupation',
          'marital_status',
          'born_date',
        ];

        fields_validate_non_required = ['company_name'];

        break;
      case TypeCustomer.business:
        fields_validate_required = ['company_name'];
        fields_validate_non_required = [
          'first_name',
          'last_name',
          'occupation',
          'marital_status',
          'born_date',
        ];
        break;
    }

    for (let i = 0; i < fields_validate_required.length; i++) {
      if (
        this.createClientForm.controls[fields_validate_required[i]].value ===
          null ||
        this.createClientForm.controls[fields_validate_required[i]].value === ''
      ) {
        this.createClientForm.controls[fields_validate_required[i]].setErrors({
          incorrect: true,
        });
      }
    }

    for (let i = 0; i < fields_validate_non_required.length; i++) {
      if (
        this.createClientForm.controls[fields_validate_non_required[i]]
          .value === null ||
        this.createClientForm.controls[fields_validate_non_required[i]]
          .value === ''
      ) {
        this.createClientForm.controls[
          fields_validate_non_required[i]
        ].setErrors(null);
      }

      this.createClientForm.controls[fields_validate_non_required[i]].setValue(
        null
      );
    }
  }

  submitForm(create_another = false) {
    this.validateClientFormFields();

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
    console.log(this.createClientForm);

    if (this.createClientForm.valid) {
      if (this.customerId != '') {
        this.updateCustomer(createClient);
      } else {
        this.createCustomer(createClient, create_another);
      }
    } else {
      this.toastr.error(
        'Error',
        this.translateService.instant('errorMessages.InvalidForm')
      );
    }
  }

  createCustomer(body: any, create_another = false) {
    this.customerService.createCustomer(body).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success(
          'Ok',
          this.translateService.instant('successMessages.created_succesfully')
        );
        if (create_another) {
          this.resetForm();
        }
      },
      (error) => {
        this.toastr.error(
          'Error',
          this.translateService.instant('errorMessages.unexpectedError')
        );
      }
    );
  }

  updateCustomer(body: any) {
    this.customerService
      .updateCustomer(
        this.selectedSubscription.ssid.uuid,
        this.customerId,
        body
      )
      .subscribe(
        (data) => {
          console.log(data);
          this.toastr.success(
            'Ok',
            this.translateService.instant(
              'successMessages.updated_successfully'
            )
          );
        },
        (error) => {
          this.toastr.error(
            'Error',
            this.translateService.instant('errorMessages.unexpectedError')
          );
        }
      );
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

  resetForm() {
    this.createClientForm.reset();
    this.customer_contacts_email = [];
    this.customer_contacts_phone = [];
    this.customer_address = [];

    this.initCustomerContacts();
    this.initCustomerAddress();

    this.customer_type = 'P';
  }

  changeImage(event: any) {
    const file = event.target.files[0];
    console.log(event);
    console.log(file);

    this.imagenSubir = file;

    if (!file) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

    return this.imgTemp;
  }

  removeImage() {
    this.imgTemp = null;
  }
}
