import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoleComponent } from '../../../components/dialogs/dialog-new-role/dialog-new-role.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Country, Group, SecurityUser, SubtypeContact, TypeContact } from 'core-models';
import { AuthService, CommonService, SecurityService } from 'core-services';
import { ToastrService } from 'ngx-toastr';

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
  securityGroups!:Group[];
  securityUserId!:string;
  securityUser!:SecurityUser;


  constructor(public  dialog: MatDialog,
              private formBuilder:FormBuilder,
              private authService:AuthService,
              private commonService:CommonService,
              private formService:FormService,
              private router:Router,
              private toastr: ToastrService,
              private translateService:TranslateService,
              private securityService:SecurityService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.fetchCountries();
    this.getSecurityGroups();
    this.getSecurityUserById();
  }

  initForm(){

    this.collaboratorForm = this.formBuilder.group({
      group: ['',Validators.required],
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      origin_country: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      licenses: this.formBuilder.array([
        this.formBuilder.group({
          license_country:['81635e71-a6b6-44dc-9d82-b9ee0aad8660',Validators.required],
          license_no:['',Validators.required],
          license_country_state: ['']
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
          physical_city: ['', Validators.required],
          physical_address: ['', Validators.required],
          physical_postal_code: ['', Validators.required],
          postal_city: ['', Validators.required],
          postal_address: ['', Validators.required],
          postal_postal_code: ['', Validators.required],
        })
      ])
    })

  }

  getSecurityUserById() {
    this.securityUserId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    if (this.securityUserId != '') {
      this.securityService
        .getSecurityUserById(this.selectedSubscription?.ssid.uuid, this.securityUserId)
        .subscribe((data) => {
          console.log(data);
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
      this.securityGroups = data;
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
      billing_fees: []
     }

    console.log(this.collaboratorForm.value);

    this.securityService.saveSecurityUser(securityUserPayload).subscribe(data => {
      this.toastr.success('Success','Creado Exitosamente');
    })

  }

  openDialogNewRole(){
    this.dialog.open(DialogNewRoleComponent);
  }

}
