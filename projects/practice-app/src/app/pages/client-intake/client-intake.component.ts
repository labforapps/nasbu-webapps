import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl,FormArray} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Customer,SelectedSubscription,Country,TypeContact,SubtypeContact,Occupation,TypeCustomer, CustomerIntakeValidateRequest,} from 'core-models';
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
  token: string = '';
  customerType: string = TypeCustomer.person;
  typeCustomer = TypeCustomer;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;

  countries!: Country[];
  customer!: Customer;
  customerRepresentative!: Customer;
  occupations!: Occupation[];
  customerIntake!:CustomerIntakeValidateRequest;

  createClientForm!: FormGroup;
  createRepresentative!: FormGroup;

  currentStep: number = 0;
  matStepperSubmitted: boolean = false;

  constructor(
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private commonService: CommonService,
    private ActivatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTokenByURL();

    this.fetchCountries();
    this.fetchOccupations();

    this.initReactiveForms();
  }

  getTokenByURL() {
    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      this.token = params.token;
      this.validateRequest();
    });
  }

  validateRequest(){

    this.customerService.validateRequest(this.token).subscribe((data:CustomerIntakeValidateRequest) => {
      this.selectedSubscription = data.subscription;
      this.customerIntake = data;
    })

  }


  initReactiveForms() {
    this.createClientForm = this._formBuilder.group({
      subscription: [this.selectedSubscription],
      intake_request: [null],
      type: [this.customerType, Validators.required],
      document_type: [null],
      document_no: [null],
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
          contact_value: ['', [Validators.required, Validators.email]],
        }),
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: ['P', Validators.required],
          contact_value: ['', Validators.required],
        }),
      ]),
      addresses: this._formBuilder.array([
        this._formBuilder.group({
          physical_country: ['', Validators.required],
          physical_state: ['', Validators.required],
          physical_city: ['', Validators.required],
          physical_address: ['', Validators.required],
          physical_postal_code: ['', Validators.required],
          postal_country: ['',Validators.required],
          postal_state: ['',Validators.required],
          postal_city: ['', Validators.required],
          postal_address: ['', Validators.required],
          postal_postal_code: ['', Validators.required],
        }),
      ]),
    });

    this.createRepresentative = this._formBuilder.group({
      subscription: [''],
      intake_request: [null],
      type: [this.customerType, Validators.required],
      document_type: [null],
      document_no: [null],
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
          contact_value: ['', [Validators.required, Validators.email]],
        }),
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: ['', Validators.required],
          contact_value: ['', Validators.required],
        }),
      ]),
      addresses: this._formBuilder.array([
        this._formBuilder.group({
          physical_country: ['', Validators.required],
          physical_state: ['', Validators.required],
          physical_city: ['', Validators.required],
          physical_address: ['', Validators.required],
          physical_postal_code: ['', Validators.required],
          postal_country: ['',Validators.required],
          postal_state: ['',Validators.required],
          postal_city: ['', Validators.required],
          postal_address: ['', Validators.required],
          postal_postal_code: ['', Validators.required],
        }),
      ]),
    });
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
      this.countries.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }

      });
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

  changeValueCheckboxAddressClientForm(event: any) {
    const checked = event.checked;

    let formArray = this.createClientForm.get('addresses') as FormArray;

    formArray.patchValue([
      {
        postal_city: checked ? formArray.controls[0].get('physical_city')?.value : '',
        postal_address: checked ? formArray.controls[0].get('physical_address')?.value : '',
        postal_postal_code: checked ? formArray.controls[0].get('physical_postal_code')?.value : '',
        postal_country: checked ? formArray.controls[0].get('physical_country')?.value : '',
        postal_state: checked ? formArray.controls[0].get('physical_state')?.value : ''
      },
    ]);
  }

  changeValueCheckboxAddressRepresentativeForm(event: any) {
    const checked = event.checked;

    let formArray = this.createRepresentative.get('addresses') as FormArray;

    formArray.patchValue([
      {
        postal_city: checked ? formArray.controls[0].get('physical_city')?.value : '',
        postal_address: checked ? formArray.controls[0].get('physical_address')?.value : '',
        postal_postal_code: checked ? formArray.controls[0].get('physical_postal_code')?.value : '',
        postal_country: checked ? formArray.controls[0].get('physical_country')?.value : '',
        postal_state: checked ? formArray.controls[0].get('physical_state')?.value : ''
      },
    ]);
  }

  setPhoneField(event: any,form:string) {
    if(form === 'cliente'){
      (this.createClientForm.get('contacts') as FormArray)?.at(1).patchValue({
        contact_value: event,
      });
    }
    else{
      (this.createRepresentative.get('contacts') as FormArray)?.at(1).patchValue({
        contact_value: event,
      });
    }
  }

  onStepChange(stepper: any) {

    this.matStepperSubmitted = true;
    this.currentStep = stepper._selectedIndex;

    const createClientResult = this.createClientForm.value;

    const clientRepresentative = this.createRepresentative.value;

    this.customer = this.createClientForm.value;
    this.customerRepresentative = this.createRepresentative.value;

    const form_validated = this.validateFormFields();

    if (form_validated) {
      this.matStepperSubmitted = false;
      stepper.next();
    }
  }

  validateFormFields(): Boolean {
    let fields_validate_required: any[] = [];

    let fields_array_validate_required: any[] = [
      'physical_country',
      'physical_city',
      'physical_address',
      'physical_postal_code',
      'postal_country',
      'postal_state',
      'postal_city',
      'postal_address',
      'postal_postal_code',
    ];

    let validForm = true;

    let FormValidate!: FormGroup;

    switch (this.currentStep) {
      case 0:
        FormValidate = this.createClientForm;

        if (this.customerType === this.typeCustomer.person) {
          fields_validate_required = ['first_name', 'last_name'];
        } else {
          fields_validate_required = ['company_name'];
        }

        if (
          this.returnFormArrayFields('client', 'contacts', 0, 'contact_value')
            ?.status === 'INVALID'
        )
          validForm = false;
        if (
          this.returnFormArrayFields('client', 'contacts', 1, 'sub_type')
            ?.status === 'INVALID'
        )
          validForm = false;
        if (
          this.returnFormArrayFields('client', 'contacts', 1, 'contact_value')
            ?.status === 'INVALID'
        )
          validForm = false;

        break;

      case 1:
        if (this.customerType === this.typeCustomer.person) {
          fields_validate_required = [
            'born_date',
            'occupation',
            'marital_status',
          ];
        }

        for (let i = 0; i < fields_array_validate_required.length; i++) {
          if (
            this.returnFormArrayFields(
              'client',
              'addresses',
              0,
              fields_array_validate_required[i]
            )?.status === 'INVALID'
          )
            validForm = false;
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

        if (
          this.returnFormArrayFields(
            'representative',
            'contacts',
            0,
            'contact_value'
          )?.status === 'INVALID'
        )
          validForm = false;
        if (
          this.returnFormArrayFields(
            'representative',
            'contacts',
            1,
            'sub_type'
          )?.status === 'INVALID'
        )
          validForm = false;
        if (
          this.returnFormArrayFields(
            'representative',
            'contacts',
            1,
            'contact_value'
          )?.status === 'INVALID'
        )
          validForm = false;

        FormValidate = this.createRepresentative;

        break;

      case 3:
        for (let i = 0; i < fields_array_validate_required.length; i++) {
          if (
            this.returnFormArrayFields(
              'representative',
              'addresses',
              0,
              fields_array_validate_required[i]
            )?.status === 'INVALID'
          )
            validForm = false;
        }
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

  returnFormArrayFields(
    form: string,
    formArray: string,
    index: number,
    field: string
  ) {
    let reactiveForm: any;

    if (form === 'client') {
      reactiveForm = this.createClientForm;
    } else {
      reactiveForm = this.createRepresentative;
    }

    return (reactiveForm.get(formArray) as FormArray)?.at(index).get(field);
  }

  submitForm(stepper: any) {
    if (this.customerType === TypeCustomer.person) {
      this.createCustomerTypePerson(stepper);
    } else {
      this.createCustomerTypeBusiness(stepper);
    }
  }

  createCustomerTypePerson(stepper: any) {
    this.customerService
      .createCustomerIntake({...this.createClientForm.value,token:this.token, subscription: this.selectedSubscription})
      .subscribe(
        (data) => {
          this.toastr.success(
            'Ok',
            this.translateService.instant('successMessages.created_succesfully')
          );

          stepper.next();
        },
        (error) => {
          this.toastr.error(
            'error',
            this.translateService.instant('errorMessages.unexpectedError')
          );
        }
      );
  }

  createCustomerTypeBusiness(stepper: any) {

    const companyRequestPayload = {
      token: this.token,
      representative: {...this.createRepresentative.value,subscription: this.selectedSubscription},
      company: {...this.createClientForm.value,subscription: this.selectedSubscription},
      subscription: this.selectedSubscription
    }

    this.customerService.completeCompanyRequest(companyRequestPayload,this.selectedSubscription).subscribe(
      (data) => {
        this.toastr.success(
          'Ok',
          this.translateService.instant(
            'successMessages.created_succesfully'
          )
        );
        stepper.next();
      },
      (error: any) => {
        this.toastr.error(
          'Error',
          this.translateService.instant('errorMessages.unexpectedError')
        );
      }
    );
  }
}
