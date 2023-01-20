import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl,FormArray} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
import { AuthService, CommonService, CustomersService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-client-intake',
  templateUrl: './client-intake.component.html',
  styleUrls: ['./client-intake.component.scss'],
})
export class ClientIntakeComponent implements OnInit {
  selectedSubscription!: any;
  customerType: string = TypeCustomer.person;
  typeCustomer = TypeCustomer;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;

  countries!: Country[];
  customer!: Customer;
  customerRepresentative!: Customer;
  occupations!: Occupation[];
  checked_share_same_info: boolean = false;

  createClientForm!: FormGroup;
  createRepresentative!: FormGroup;

  currentStep: number = 0;

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
    this.customerType = this.typeCustomer.person;

    this.fetchCountries();
    this.fetchOccupations();

    this.initReactiveForms();
  }

  initReactiveForms() {
    this.createClientForm = this._formBuilder.group({
      subscription: ['a4e9fb1e-72f6-4860-8629-3e1b0594ac2a'],
      intake_request: [''],
      type: [this.customerType, Validators.required],
      document_type: ['I'],
      document_no: ['ad cupidatat nu'],
      company_name: [null],
      first_name: [null],
      last_name: [null],
      email: [null],
      occupation: [null],
      marital_status: [null],
      born_date: [null],
      contacts: this._formBuilder.array([
        this._formBuilder.group({
          type: this.typeContact.email,
          sub_type:
            this.customerType === TypeCustomer.person
              ? this.subtypeContact.personal_email
              : this.subtypeContact.business_email,
          contact_value: null,
        }),
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: null,
          contact_value: null,
        }),
      ]),
      addresses: this._formBuilder.array([
        this._formBuilder.group({
          physical_country: null,
          physical_city: null,
          physical_address: null,
          physical_postal_code: null,
          postal_city: null,
          postal_address: null,
          postal_postal_code: null,
        }),
      ]),
    });

    this.createRepresentative = this._formBuilder.group({
      subscription: ['a4e9fb1e-72f6-4860-8629-3e1b0594ac2a'],
      intake_request: [''],
      type: [this.customerType, Validators.required],
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
          type: this.typeContact.email,
          sub_type:
            this.customerType === TypeCustomer.person
              ? this.subtypeContact.personal_email
              : this.subtypeContact.business_email,
          contact_value: '',
        }),
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: '',
          contact_value: '',
        }),
      ]),
      addresses: this._formBuilder.array([
        this._formBuilder.group({
          physical_country: '',
          physical_city: '',
          physical_address: '',
          physical_postal_code: '',
          postal_city: '',
          postal_address: '',
          postal_postal_code: '',
        }),
      ]),
    });
  }

  onStepChange(stepper: any) {
    this.currentStep = stepper._selectedIndex;

    const createClientResult = this.createClientForm.value;

    console.log(createClientResult);

    const clientRepresentative = this.createRepresentative.value;

    console.log(clientRepresentative);

    this.customer = this.createClientForm.value;
    this.customerRepresentative = this.createRepresentative.value;

    console.log(this.createClientForm);

    const form_validated = this.validateFormFields();

    if (form_validated) {
      stepper.next();
    }
  }

  validateFormFields(): Boolean {
    let fields_validate_required: any[] = [];
    let fields_array_validate_required: any[] = [];
    let validForm = true;

    console.log(this.currentStep);

    let FormValidate!: FormGroup;

    switch (this.currentStep) {
      case 0:
        FormValidate = this.createClientForm;

        if (this.customerType === this.typeCustomer.person) {
          fields_validate_required = ['first_name', 'last_name'];
        } else {
          fields_validate_required = ['company_name'];
        }

        const contactValueEmailField = (
          FormValidate.get('contacts') as FormArray
        )
          .at(0)
          .get('contact_value');

        if (
          contactValueEmailField?.value === '' ||
          contactValueEmailField?.value === null
        ) {
          contactValueEmailField.setErrors({
            incorrect: true,
          });
        }

        break;

      case 1:
        if (this.customerType === this.typeCustomer.person) {
          fields_validate_required = [
            'born_date',
            'occupation',
            'marital_status',
          ];
        }

        FormValidate = this.createClientForm;

        break;

      case 2:
        fields_validate_required = [
          'first_name',
          'last_name',
          'born_date',
          'occupation',
          'marital_status',
        ];

        FormValidate = this.createRepresentative;

        break;

      default:
        break;
    }

    for (let i = 0; i < fields_validate_required.length; i++) {
      if (
        FormValidate.controls[fields_validate_required[i]].value === null ||
        FormValidate.controls[fields_validate_required[i]].value === ''
      ) {
        FormValidate.controls[fields_validate_required[i]].setErrors({
          incorrect: true,
        });

        validForm = false;
      }
    }

    return validForm;
  }

  submitForm(stepper: any) {
    if (this.customerType === TypeCustomer.person) {
      this.customerService
        .createCustomerIntake(this.createClientForm.value)
        .subscribe((data) => {
          console.log(data);
          stepper.next();
        });
    } else {
      this.customerService
        .createCustomerIntake(this.createClientForm.value)
        .subscribe((data) => {
          console.log(data);
          this.customerService
            .createCustomerIntake(this.createRepresentative.value)
            .subscribe((data) => {
              console.log(data);
              stepper.next();
            }),
            (error: any) => {
              this.toastr.error(
                'Error 2',
                this.translateService.instant('errorMessages.unexpectedError')
              );
            };;
        }),
        (error: any) => {
          this.toastr.error(
            'Error 1',
            this.translateService.instant('errorMessages.unexpectedError')
          );
        };
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

  setCustomerType(value: string) {
    this.customerType = value;

    this.createClientForm.patchValue({
      type: value,
    });
  }

  return_country_name(countryId: string) {
    if (countryId) {
      const country_filtered = this.countries.filter(
        (x) => x.uuid === countryId
      );

      return country_filtered[0].name || '';
    }
    return '';
  }

  return_occupation_name(uuid: string) {
    if (uuid) {
      const occupation_filtered = this.occupations.filter(
        (x) => x.uuid === uuid
      );

      return occupation_filtered[0].name;
    } else {
      return '';
    }
  }

  changeValueCheckboxAddressClientForm() {
    let formArray = this.createClientForm.get('addresses') as FormArray;

    formArray.patchValue([
      {
        postal_city: formArray.controls[0].get('physical_city')?.value,
        postal_address: formArray.controls[0].get('physical_address')?.value,
        postal_postal_code: formArray.controls[0].get('physical_postal_code')
          ?.value,
      },
    ]);
  }

  changeValueCheckboxAddressRepresentativeForm() {
    let formArray = this.createRepresentative.get('addresses') as FormArray;

    formArray.patchValue([
      {
        postal_city: formArray.controls[0].get('physical_city')?.value,
        postal_address: formArray.controls[0].get('physical_address')?.value,
        postal_postal_code: formArray.controls[0].get('physical_postal_code')
          ?.value,
      },
    ]);
  }
}
