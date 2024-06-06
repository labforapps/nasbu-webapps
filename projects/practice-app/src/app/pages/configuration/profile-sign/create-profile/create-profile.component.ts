import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, CommonService, SubscriptionService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { SelectedSubscription, TypeContact,Subscription, SubtypeContact, Country, SubscriptionPayload, Schedule, WeekDaysDescription } from 'core-models';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  subscriptionForm!:FormGroup;
  subscription!:Subscription;
  subscriptionPayload!:SubscriptionPayload;
  subscriptionSchedule!:Schedule[];
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;
  selectedSubscription!:any;
  countries!:Country[];
  logoFile!:File;

  constructor(private _formBuilder:FormBuilder,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private formService:FormService,
              private commonService:CommonService,
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
          physical_state: ['', Validators.required],
          physical_city: ['', Validators.required],
          physical_address: ['', Validators.required],
          physical_postal_code: ['', Validators.required],
          postal_country: ['', Validators.required],
          postal_state: ['', Validators.required],
          postal_city: ['', Validators.required],
          postal_address: ['', Validators.required],
          postal_postal_code: ['', Validators.required],
        }),
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
    this.removeItemFormArray('contacts',0);
    this.formService.setDataFormArray(this.subscriptionForm,'contacts',this.subscription.contacts.filter(x => x.contact_value != ''));
   }

   if(this.subscription.addresses.length > 0){
    this.removeItemFormArray('addresses',0);
    this.formService.setDataFormArray(this.subscriptionForm,'addresses',this.subscription.addresses);
   }
  }

  validateSchedule(){
    for (let i = 0; i < this.subscriptionSchedule.length; i++) {
      const schedule = this.subscriptionSchedule[i];
      const weekDayDescription = WeekDaysDescription.get(schedule.week_day);
      if (!schedule.is_closed) {
        const startTime = new Date(`2000-01-01T${schedule.start_time}`);
        const endTime = new Date(`2000-01-01T${schedule.end_time}`);
        if (startTime >= endTime) {
          this.toastr.error('Error',
          `${this.translateService.instant('start_time_is_greater_or_equal_to_end_time')} ${this.translateService.instant(weekDayDescription || '')}`
          );
          return false;
        }
      }
    }

    return true;
  }

  submitForm(){

    if(!this.validateSchedule()) return;

    this.subscriptionPayload = {...this.subscriptionForm.value, schedules: this.subscriptionSchedule}
     this.subscriptionPayload.logoFile = this.logoFile ? this.logoFile : null;

    if(this.subscriptionForm.valid){
      this.subscriptionService.updateSubscription(this.subscriptionPayload,this.selectedSubscription?.ssid.uuid).subscribe(data => {
        this.toastr.success('Ok',this.translateService.instant('successMessages.updated_successfully'));
      })
    }
    else{
      this.toastr.error('Error','Completar campos obligatorios');
    }

  }

  setSubscriptionSchedule(subscriptionSchedule:Schedule[]){
    this.subscriptionSchedule = subscriptionSchedule.length > 0 ? subscriptionSchedule : [] ;
  }

  setPhoneField(contact:any,event:any) {
    const index = this.returnIndexFormArrayContact(contact);
    (this.subscriptionForm.get('contacts') as FormArray)?.at(index).patchValue({
      contact_value: event,
    });
  }

  setLogoFileSubscription(event:any){
    this.logoFile = event;
    if(event === null) this.subscriptionService.uploadImage(this.subscription.uuid,event).subscribe();
  }

  addContactItem(formArray:string,item:any){
    item = {
      type:item.type,
      sub_type:item.sub_type,
      contact_value: item.contact_value
    }
    this.formService.addItemFormArray(this.subscriptionForm,formArray,item);
  }

  addAddressItem(formArray:string,item:any){
    delete item.uuid;
    delete item.address_id;
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

  returnFormArrayFields(formArray:string,field:any,index = 0,contact = null){
    if(contact) index = this.returnIndexFormArrayContact(contact);
    return this.formService.returnFormArrayFields(this.subscriptionForm,formArray,index,field);
  }

  changeValueCheckboxAddress(event:any,index:number){
    this.formService.changeValueCheckboxAddress(this.subscriptionForm,event,index);
  }

}
