import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Country, SubscriptionMemberType, SecurityGroup, SecurityUser, SubscriptionBillingFee, SubtypeContact, TypeContact, Subscription } from 'core-models';
import { AuthService, CommonService, SecurityService, SubscriptionService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { DialogAddRoleComponent } from '../../../components/dialogs/dialog-add-role/dialog-add-role.component';

@Component({
  selector: 'app-create-collaborator',
  templateUrl: './create-collaborator.component.html',
  styleUrls: ['./create-collaborator.component.scss']
})
export class CreateCollaboratorComponent implements OnInit {

  selectedSubscription!:any;
  collaboratorForm!:FormGroup;
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;
  logoFile!:any;
  image_url!:string;
  countries!:Country[];
  securityGroups!:SecurityGroup[];
  securityUserId!:string;
  securityUser!:SecurityUser;
  billingFee!:SubscriptionBillingFee;
  dialogRef: MatDialogRef<CreateCollaboratorComponent>;
  subscriptionMemberType = SubscriptionMemberType
  subscriptionInformation!:Subscription

  constructor(public  dialog: MatDialog,
              private formBuilder:FormBuilder,
              private authService:AuthService,
              private commonService:CommonService,
              private formService:FormService,
              private toastr: ToastrService,
              private router:Router,
              private translateService:TranslateService,
              private securityService:SecurityService,
              private activatedRoute:ActivatedRoute,
              private subscriptionService:SubscriptionService,
              @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              @Optional() dialogRef: MatDialogRef<CreateCollaboratorComponent>) {
                this.dialogRef = dialogRef;
              }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.fetchCountries();
    this.getSecurityGroups();
    this.getSecurityUserById();

    if(this.securityUserId === '') this.getSubscriptionInformation();
  }

  /**
   * Al crear un colaborador, copia el "Correo para tu usuario" al primer correo de contacto
   * si todavía está vacío (NAS-018). No pisa un correo que el usuario ya escribió.
   */
  copyUserEmailToContact(): void {
    if (this.securityUserId) {
      return;
    }

    const email = (this.collaboratorForm.get('email')?.value || '').trim();
    if (!email) {
      return;
    }

    const emailContact = (this.collaboratorForm.get('contacts') as FormArray).controls
      .find(control => control.get('type')?.value === this.typeContact.email);

    if (emailContact && !emailContact.get('contact_value')?.value) {
      emailContact.patchValue({ contact_value: email });
    }
  }

  initForm(){

    this.collaboratorForm = this.formBuilder.group({
      group: ['',Validators.required],
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      origin_country: ['',Validators.required],
      email: ['',Validators.required],
      licenses: this.formBuilder.array([
        this.formBuilder.group({
          license_country:[''],
          license_no:[null],
          license_country_state: [null]
        })
      ]),
      contacts: this.formBuilder.array([
        this.formBuilder.group({
          type: this.typeContact.phone_number,
          sub_type: [this.subtypeContact.cellphone_number, Validators.required],
          contact_value: ['', Validators.required],
        }),
        this.formBuilder.group({
          type: this.typeContact.email,
          sub_type:[this.subtypeContact.personal_email],
          contact_value: ['', [Validators.required, Validators.email]],
        }),
      ]),
      addresses: this.formBuilder.array([
        this.formBuilder.group({
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
        })
      ])
    })

  }

  getSubscriptionInformation(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe((data:Subscription) => {
      this.subscriptionInformation = data;
      this.removeItemFormArray('contacts',0);
      this.removeItemFormArray('contacts',0);
      this.removeItemFormArray('addresses',0);
      this.formService.setDataFormArray(this.collaboratorForm,'contacts',this.subscriptionInformation.contacts.filter(x => x.contact_value != ''));
      this.formService.setDataFormArray(this.collaboratorForm,'addresses',this.subscriptionInformation.addresses);
    })
  }

  getSecurityUserById() {
    this.securityUserId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    if (this.securityUserId !== '') {
      this.securityService
        .getSecurityUserById(this.selectedSubscription?.ssid.uuid, this.securityUserId)
        .subscribe((data) => {
          this.securityUser = data;
          this.image_url = this.securityUser.image_url || '';
          this.setDataInForm();
        });
    }
  }

  setDataInForm(){
    this.collaboratorForm.patchValue({
      ...this.securityUser,
      ...this.securityUser.user
    })

    this.setDataInFormArrays();
  }

  setDataInFormArrays(){
   if(this.securityUser.contacts.length > 0){
    this.removeItemFormArray('contacts',0);
    this.removeItemFormArray('contacts',0);
    this.formService.setDataFormArray(this.collaboratorForm,'contacts',this.securityUser.contacts.filter(x => x.contact_value != ''));
   }

   if(this.securityUser.addresses.length > 0){
    this.removeItemFormArray('addresses',0);
    this.formService.setDataFormArray(this.collaboratorForm,'addresses',this.securityUser.addresses);
   }
  }

  getSecurityGroups(){
    this.securityService.getSecurityGroups(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityGroups = data
    })
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data:Country[]) => {
      this.countries = data;
    });
  }

  setPhoneField(contact:any,event:any) {
    const index = this.returnIndexFormArrayContact(contact);
    (this.collaboratorForm.get('contacts') as FormArray)?.at(index).patchValue({
      contact_value: event,
    });
  }

  setLogoFile(event:any){
    this.logoFile = event;
  }

  setSubscriptionBillingFee(billingFee:SubscriptionBillingFee){
    this.billingFee = billingFee;
  }

  hideSecurityGroupField(){
    return this.securityUser && this.securityUser.subscription_member_type === this.subscriptionMemberType.OWNER ? false : true;
  }

  addContactItem(formArray:string,item:any){
    item = {
      type:item.type,
      sub_type:item.sub_type,
      contact_value: item.contact_value
    }
    this.formService.addItemFormArray(this.collaboratorForm,formArray,item);
  }

  addAddressItem(formArray:string,item:any){
    delete item.uuid;
    delete item.address_id;
    this.formService.addItemFormArray(this.collaboratorForm,formArray,item);
  }

  addLicenseItem(formArray:string,item:any){
    this.formService.addItemFormArray(this.collaboratorForm,formArray,item);
  }

  filterFormArray(formArray:string,field:string,value:string){
    return this.formService.filterFormArray(this.collaboratorForm,formArray,field,value);
  }

  returnIndexFormArrayContact(contact:any){
    return this.formService.returnIndexFormArrayContact(this.collaboratorForm,contact);
  }

  deleteContact(contact:any){
    this.formService.deleteContactFormArray(this.collaboratorForm,contact);
  }

  removeItemFormArray(formArray:string,index:number){
    this.formService.removeItemFormArray(this.collaboratorForm,formArray,index);
  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.collaboratorForm,formArray);
  }

  returnFormArrayFields(formArray:string,field:any,index = 0,contact = null){
    if(contact) index = this.returnIndexFormArrayContact(contact);
    return this.formService.returnFormArrayFields(this.collaboratorForm,formArray,index,field);
  }

  changeValueCheckboxAddress(event:any,index:number){
    this.formService.changeValueCheckboxAddress(this.collaboratorForm,event,index);
  }

  goBack(){
    if(this.dataDialog){
      this.dialogRef.close();
    }
    else{
      this.router.navigate(['/users'])
    }
  }

  submitForm(){

     const securityUserPayload:SecurityUser = {
      uuid:this.securityUserId,
      subscription: this.selectedSubscription?.ssid.uuid,
      user: {
        email: this.collaboratorForm.value.email,
        first_name: this.collaboratorForm.value.first_name,
        last_name: this.collaboratorForm.value.last_name
      },
      origin_country: this.collaboratorForm.value.origin_country,
      group: this.collaboratorForm.value.group,
      contacts: this.collaboratorForm.value.contacts,
      addresses: this.collaboratorForm.value.addresses,
      licenses: this.collaboratorForm.value.licenses,
      image_url: this.logoFile,
      billing_fees: [this.billingFee],
      birthdate: new Date()
     }

     if(this.collaboratorForm.invalid){
      this.toastr.error('Error','Completar campos obligatorios');
      return;
    }

    this.securityService.saveSecurityUser(securityUserPayload).subscribe(data => {

      if(this.dataDialog) {
        this.dialogRef.close(data);
        return;
      }

      if(this.securityUser){
        if(securityUserPayload.image_url === null) this.securityService.uploadImage(securityUserPayload.subscription || '',securityUserPayload.uuid || '',null).subscribe()

        this.toastr.success('Ok', this.translateService.instant('successMessages.updated_successfully'));
      }
      else{
        this.toastr.success('Ok', this.translateService.instant('successMessages.created_succesfully'));
        this.router.navigate(['user/edit', data.uuid]);
      }
    },(error) => {
     if(!this.securityUserId) this.toastr.error('Error', error.error.detail);
    })

  }

  openDialogAddRole(){
    const dialogRef = this.dialog.open(DialogAddRoleComponent)
    dialogRef.afterClosed().subscribe(data => {this.getSecurityGroups()})
  }

}
