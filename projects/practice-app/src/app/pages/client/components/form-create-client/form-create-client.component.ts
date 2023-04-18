import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import {Customer,SelectedSubscription,Country,TypeContact,SubtypeContact,Occupation,TypeCustomer,} from 'core-models';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-create-client',
  templateUrl: './form-create-client.component.html',
  styleUrls: ['./form-create-client.component.scss'],
})
export class FormCreateClientComponent implements OnInit {
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
  isChecked = false;

  customerId!: string;
  linked_customer!: string;

  createClientForm!: FormGroup;

  constructor(
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

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

  setPhoneField(event: any, index: number) {
    (this.createClientForm.get('contacts') as FormArray)?.at(index).patchValue({
      contact_value: event,
    });
  }

  setDataInForm() {
    this.customer_type = this.customer.type;

    this.createClientForm.patchValue({
      subscription: this.selectedSubscription?.ssid.uuid,
      ...this.customer
    });

    //this.removeItem('addresses', 0);

    for (let i = 0; i < this.customer.addresses.length; i++) {
      (this.createClientForm.get('addresses') as FormArray).push(
        this._formBuilder.group({
          ...this.customer.addresses[i],
        })
      );
    }

    // this.removeItem('contacts', 0);
    //this.removeItem('contacts', 0);

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

  setCustomerType(value: string) {
    this.customer_type = value;

    this.createClientForm.patchValue({
      type: value,
    });

    // const formArrayFields = this.returnFormArray('contacts');

    // for (let i = 0; i < formArrayFields.length; i++) {
    //   if (this.returnFormArrayFields('contacts', i, 'type')?.value === 'E')
    //     (this.createClientForm.get('contacts') as FormArray)
    //       ?.at(i)
    //       ?.patchValue({
    //         sub_type: this.customer_type === 'P' ? 'E' : 'B',
    //       });
    // }
  }

  submitForm(create_another = false) {
    //this.validateClientFormFields();

    const createClient: Customer = {
      ...this.createClientForm.value,
      subscription: this.selectedSubscription?.ssid.uuid,
      uuid: this.customerId,
      image: this.imagenSubir,
    };

    console.log('Imagen Subir: ', createClient.image);

    if (this.createClientForm.valid) {
      this.customerService.saveCustomer(createClient).subscribe((data) => {
        this.toastr.success(
          'Ok',
          this.translateService.instant('successMessages.created_succesfully')
        );

        let body: any;

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
                data.uuid || '',
                body
              )
              .subscribe((data) => {
                this.router.navigate(['customers/edit', data.uuid]);
              });
          } else {
            this.router.navigate(['customers/edit', data.uuid]);
          }
        }
      });
    } else {
      this.toastr.error(
        'Error',
        'Completar campos obligatorios'
        //this.translateService.instant('errorMessages.InvalidForm')
      );
    }
  }

  resetForm() {
    this.createClientForm.reset();
    this.addItem('contacts', 'E');
    this.addItem('contacts', 'P');
    this.isChecked = false;
    this.customer_type = 'P';
  }

  changeImage(event: any) {
    const file = event.target.files[0];

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
