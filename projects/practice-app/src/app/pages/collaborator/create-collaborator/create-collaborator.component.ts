import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoleComponent } from '../../../components/dialogs/dialog-new-role/dialog-new-role.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Country, SubtypeContact, TypeContact } from 'core-models';
import { AuthService, CommonService } from 'core-services';
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
  logoFile!:File;
  countries!:Country[];


  constructor(public dialog: MatDialog,
              private formBuilder:FormBuilder,
              private authService:AuthService,
              private commonService:CommonService,
              private formService:FormService,
              private router:Router,
              private toastr: ToastrService,
              private translateService:TranslateService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.fetchCountries();
  }

  initForm(){

    this.collaboratorForm = this.formBuilder.group({
      role: ['',Validators.required],
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      country: ['',Validators.required],
      licenses: this.formBuilder.array([
        this.formBuilder.group({
          license:['',Validators.required],
          government:['',Validators.required]
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

  setLogoFileSubscription(event:any){
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

    console.log(this.collaboratorForm);

    if(this.collaboratorForm.valid){
      console.log(this.collaboratorForm.value);
    }

  }

  openDialogNewRole(){
    this.dialog.open(DialogNewRoleComponent);
  }

}
