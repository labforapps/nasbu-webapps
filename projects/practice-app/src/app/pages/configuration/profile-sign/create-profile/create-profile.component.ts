import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, CommonService, SubscriptionService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { SelectedSubscription, TypeContact,Subscription, SubtypeContact, Country, WeekDaysDescription, SubscriptionPayload } from 'core-models';
import { FormService } from 'projects/practice-app/src/app/services/form.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  subscriptionForm!:FormGroup;
  subscription!:Subscription;
  subscriptionPayload!:SubscriptionPayload;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;
  selectedSubscription!:any;
  countries!:Country[];

  constructor(private _formBuilder:FormBuilder,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private formService:FormService,
              private commonService:CommonService,
              private router: Router,
              private toastr: ToastrService,
              private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.getSubscriptionInformation();
    this.fetchCountries();
  }

  initForm(){
    this.subscriptionForm = this._formBuilder.group({

      name: ['',Validators.required],
      contacts: this._formBuilder.array([
        this._formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: [this.subtypeContact.cellphone_number, Validators.required],
          contact_value: ['', Validators.required],
        }),
        this._formBuilder.group({
          type: this.typeContact.email,
          sub_type:[this.subtypeContact.personal_email],
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
      schedules: this._formBuilder.array([
        this._formBuilder.group({
          week_day:    [''],
          is_closed:   [false],
          start_time:  [''],
          end_time:    ['']
        })
      ])
    })
  }

  getSubscriptionInformation(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe((data:Subscription) => {
      this.subscription = data;
      this.setDataInForm();
    })
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data:Country[]) => {
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

  setDataInForm(){

    this.subscriptionForm.patchValue({
      ...this.subscription
    })

    this.setDataInFormArrays();
  }

  setDataInFormArrays(){

   if(this.subscription.contacts.length > 0){
    this.removeItemFormArray('contacts',0);
    this.removeItemFormArray('contacts',1);
    this.formService.setDataFormArray(this.subscriptionForm,'contacts',this.subscription.contacts);
   }

   if(this.subscription.addresses.length > 0){
    this.removeItemFormArray('addresses',1);
    this.formService.setDataFormArray(this.subscriptionForm,'addresses',this.subscription.addresses);
   }

    if(this.subscription.schedules.length === 0){
      this.removeItemFormArray('schedules',0);
      const weekDaysArray = [1,2,3,4,5,6,7];

      for(let i = 0; i < weekDaysArray.length; i++){
        this.subscription.schedules.push({
          week_day:    weekDaysArray[i],
          is_closed:   true,
          start_time:  '',
          end_time:    '',
        })
      }
    }

    const weekdays = [2, 3, 4, 5, 6, 7, 1];

    this.subscription.schedules.sort((a, b) => {
      const aIndex = weekdays.indexOf(a.week_day);
      const bIndex = weekdays.indexOf(b.week_day);
      return aIndex - bIndex;
    });

    this.formService.setDataFormArray(this.subscriptionForm,'schedules',this.subscription.schedules);
  }

  submitForm(){
    this.subscriptionPayload = {...this.subscriptionForm.value}

    if(this.subscriptionForm.valid){
      this.subscriptionService.updateSubscription(this.subscriptionPayload,this.selectedSubscription?.ssid.uuid).subscribe(data => {
        console.log(data);
      })
    }
    else{
      this.toastr.error('Error','Completar campos obligatorios');
    }

  }

  setPhoneField(contact:any,event:any) {

    const index = this.returnIndexFormArrayContact(contact);

    (this.subscriptionForm.get('contacts') as FormArray)?.at(index).patchValue({
      contact_value: event,
    });
  }

  setScheduleFieldToggle(event:any,index:any)
  {
    (this.subscriptionForm.get('schedules') as FormArray)?.at(index).patchValue({
      is_closed: !event.checked,
    });
  }

  returnWeekDayDesc(weekDay: number) {
    return WeekDaysDescription.get(weekDay);
  }

  addItem(formArray:string,item:any){
    this.formService.addItemFormArray(this.subscriptionForm,formArray,item);
  }

  filterFormArray(formArray:string,field:string,value:string){
    return this.formService.filterFormArray(this.subscriptionForm,formArray,field,value);
  }

  returnIndexFormArrayContact(contact:any){
    return this.formService.returnIndexFormArrayContact(this.subscriptionForm,contact);
  }

  deleteContact(contact:any){
    this.formService.deleteContactFormArray(this.subscriptionForm,contact);
  }

  removeItemFormArray(formArray:string,index:number){
    this.formService.removeItemFormArray(this.subscriptionForm,formArray,index);
  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.subscriptionForm,formArray);
  }

  changeValueCheckboxAddress(event:any,index:number){
    this.formService.changeValueCheckboxAddress(this.subscriptionForm,event,index);
  }

}
