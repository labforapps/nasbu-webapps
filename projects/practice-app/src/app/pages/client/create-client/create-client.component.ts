import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import {Customer,SelectedSubscription,Country,TypeContact,SubtypeContact,Occupation,TypeCustomer,} from 'core-models';
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
  customer!: Customer;
  customer_type: string = TypeCustomer.person;
  typeCustomer = TypeCustomer;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;
  countries!: Country[];
  occupations!: Occupation[];
  imagenSubir!: File;
  imgTemp!: any;

  customerId!: string;
  linked_customer!: string;

  createClientForm!: FormGroup;

  public mask_telephone_number = [
    /[0-9]/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  constructor(
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
          sub_type: ['', Validators.required],
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

  returnFormArray(formArray: string) {
    return (this.createClientForm.get(formArray) as FormArray).controls;
  }

  returnFormArrayFields(formArray: string, index: number, field: string) {
    return (this.createClientForm.get(formArray) as FormArray)
      ?.at(index)
      .get(field);
  }

  returnValueFormField(index:number)
  {
    return (this.createClientForm.get('contacts') as FormArray)
      ?.at(index)
      .get('contact_value')?.value;
  }

  setPhoneField(event: any, index:number) {
      (this.createClientForm.get('contacts') as FormArray)?.at(index).patchValue({
        contact_value: event,
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
  }

  addItem(formArray: string, type = '') {
    switch (formArray) {
      case 'addresses':
        (this.createClientForm.get(formArray) as FormArray).push(
          this._formBuilder.group({
            physical_country: [''],
            physical_city: [''],
            physical_address: [''],
            physical_postal_code: [''],
            postal_city: [''],
            postal_address: [''],
            postal_postal_code: [''],
          })
        );
        break;
      case 'contacts':
        if (type === 'E') {
          (this.createClientForm.get(formArray) as FormArray).push(
            this._formBuilder.group({
              type: this.typeContact.email,
              sub_type:
                this.customer_type === TypeCustomer.person
                  ? this.subtypeContact.personal_email
                  : this.subtypeContact.business_email,
              contact_value: [''],
            })
          );
        } else {
          (this.createClientForm.get(formArray) as FormArray).push(
            this._formBuilder.group({
              type: this.typeContact.phone_number,
              sub_type: ['', Validators.required],
              contact_value: ['', Validators.required],
            })
          );
        }
    }
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
        (this.createClientForm.get('contacts') as FormArray)
          ?.at(i)
          ?.patchValue({
            sub_type: this.customer_type === 'P' ? 'E' : 'B',
          });
    }
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

    const createClient: Customer = {
      ...this.createClientForm.value,
      subscription: this.selectedSubscription?.ssid.uuid,
    };

    if (this.createClientForm.valid) {
      if (this.customerId != '') {
        this.updateCustomer(createClient);
      } else {
        this.createCustomer(createClient, create_another);
      }
    } else {
      this.toastr.error(
        'Error',
        'Completar campos obligatorios'
        //this.translateService.instant('errorMessages.InvalidForm')
      );
    }
  }

  createCustomer(body: any, create_another = false) {
    this.customerService.createCustomer(body).subscribe(
      (data: any) => {
        this.toastr.success(
          'Ok',
          this.translateService.instant('successMessages.created_succesfully')
        );

        if (create_another) {
          this.resetForm();
        } else {
          if (this.linked_customer) {
            body = {
              ...body,
              linked_customer: this.linked_customer,
            };

            this.customerService
              .linkToCustomer(
                this.selectedSubscription?.ssid.uuid,
                data.uuid,
                body
              )
              .subscribe((data) => {
                this.router.navigate(['customers/edit', data.uuid]);
              });
          } else {
            this.router.navigate(['customers/edit', data.uuid]);
          }
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

          if (this.linked_customer) {
            console.log('Object for link to customer', body);

            body = {
              ...body,
              linked_customer: this.linked_customer,
            };

            this.customerService
              .linkToCustomer(
                this.selectedSubscription?.ssid.uuid,
                this.customerId,
                body
              )
              .subscribe((data) => {
                this.router.navigate(['customers/edit', data.uuid]);
              });
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

  changeValueCheckboxAddress(event: any, index: number) {
    const checked = event.checked;

    if (checked) {
      (this.createClientForm.get('addresses') as FormArray)
        ?.at(index)
        .patchValue({
          postal_city: (this.createClientForm.get('addresses') as FormArray)
            ?.at(index)
            .get('physical_city')?.value,
          postal_address: (this.createClientForm.get('addresses') as FormArray)
            ?.at(index)
            .get('physical_address')?.value,
          postal_postal_code: (
            this.createClientForm.get('addresses') as FormArray
          )
            ?.at(index)
            .get('physical_postal_code')?.value,
        });
    } else {
      (this.createClientForm.get('addresses') as FormArray)
        ?.at(index)
        .patchValue({
          postal_city: '',
          postal_address: '',
          postal_postal_code: '',
        });
    }
  }

  resetForm() {
    this.createClientForm.reset();
    this.customer_type = 'P';
  }

  changeImage(event: any) {
    const file = event.target.files[0];
    console.log(event);
    console.log(file);

    this.imagenSubir = file;

    if (!file) return (this.imgTemp = null);

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
