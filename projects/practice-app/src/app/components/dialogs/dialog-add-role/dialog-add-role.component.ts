import { Component, OnInit } from '@angular/core';
import { AuthService,SecurityService } from 'core-services';
import { FormService } from '../../../services/form.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityGroup, ModulesAccess, modules, modulesDescription, typeAccess } from 'core-models';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-dialog-add-role',
  templateUrl: './dialog-add-role.component.html',
  styleUrls: ['./dialog-add-role.component.scss']
})
export class DialogAddRoleComponent implements OnInit {

  groupForm!:FormGroup;
  modules = modules;
  modulesDescription = modulesDescription;
  typeAccess = typeAccess;
  groupPayload!:SecurityGroup;
  selectedSubscription:any;
  allSections:Boolean = false;
  allSectionsType:string = '';
  modulesList!:modules[];
  formArrayName:string = 'modules_access'

  constructor(private authService:AuthService,
              private formService:FormService,
              private securityService:SecurityService,
              private _formBuilder:FormBuilder,
              private translateService:TranslateService,
              private toastr:ToastrService,
              private dialogRef: MatDialogRef<DialogAddRoleComponent>
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.modulesList = Object.values(this.modules)
    this.setFormData();
  }

  initForm(){
    this.groupForm = this._formBuilder.group({
      name:['',Validators.required],
      modules_access: this._formBuilder.array([
        this._formBuilder.group({
          module:[''],
          type:[''],
          active: false
        })
      ])
    })
  }

  setFormData(){

    this.formService.removeItemFormArray(this.groupForm,this.formArrayName,0);

    for(let i=0; i < this.modulesList.length - 1; i++){

      (this.groupForm.get(this.formArrayName) as FormArray).push(
        this._formBuilder.group({
          module: this.modulesList[i],
          type: [''],
          active: false
        })
      );

    }

  }

  setTypeModuleAccess(event:MatRadioChange,index:number){
    (this.groupForm.get(this.formArrayName) as FormArray)?.at(index).patchValue({
      type: event.value,
      active: true
    });
  }

  checkUnCheckModuleAccess(active:Boolean,index:number){
    (this.groupForm.get(this.formArrayName) as FormArray)?.at(index).patchValue({
      type: active ? this.typeAccess.ADMINISTRATOR : ''
    });
  }

  checkUnCheckAllSections(checkbox:MatCheckboxChange){

    this.allSectionsType = '';
    let active = false

    if(checkbox.checked){
      this.allSectionsType = this.typeAccess.ADMINISTRATOR
      active = true
    }

    for(let i = 0; i < this.modulesList.length - 1; i++){
      (this.groupForm.get(this.formArrayName) as FormArray)?.at(i).patchValue({type: this.allSectionsType,active});
    }

  }

  setTypeAccessAllModule(event:MatRadioChange){
    for(let i = 0; i < this.modulesList.length - 1; i++){
      (this.groupForm.get(this.formArrayName) as FormArray)?.at(i).patchValue({type: event.value});
    }
  }

  isModuleChecked(group: SecurityGroup, module: string): boolean {
    return group.modules_access
                .findIndex((ma: ModulesAccess) => ma.module === module) > -1;
  }

  returnFormArray(formArray: string) {
    return this.formService.returnFormArrayControls(this.groupForm,formArray);
  }

  returnModuleDescription(module: string) {
    return this.modulesDescription.get(module);
  }

  submitForm(){

    const modulesActived = this.groupForm.value.modules_access.filter((x:ModulesAccess) => x.active === true);

    this.groupPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      name: this.groupForm.value.name,
      modules_access: modulesActived
    }

    if(this.groupForm.valid){
      this.securityService.createSecurityGroup(this.groupPayload,this.selectedSubscription?.ssid.uuid).subscribe(data => {
         this.toastr.success('Ok',this.translateService.instant('successMessages.created_succesfully'));
        this.closeModal();
      })
    }
    else{
      this.toastr.error('Error','Completar campos obligatorios');
    }
  }

  closeModal() {
    this.dialogRef.close(true);
  }

}
