import { Component, OnInit } from '@angular/core';
import { AuthService,SecurityService } from 'core-services';
import { FormService } from '../../../services/form.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group, ModulesAccess, modules, modulesDescription, typeAccess } from 'core-models';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

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
  groupPayload!:Group;
  selectedSubscription:any;

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

    this.formService.removeItemFormArray(this.groupForm,'modules_access',0);

    const modules = Object.values(this.modules);

    for(let i=0; i < modules.length - 1; i++){

      (this.groupForm.get('modules_access') as FormArray).push(
        this._formBuilder.group({
          module: modules[i],
          type: [''],
          active: false
        })
      );

    }

  }

  setTypeModuleAccess(event:any,index:number){
    (this.groupForm.get('modules_access') as FormArray)?.at(index).patchValue({
      type: event.value,
    });

    (this.groupForm.get('modules_access') as FormArray)?.at(index).patchValue({
      active: true,
    });

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

    console.log(this.groupPayload);

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
