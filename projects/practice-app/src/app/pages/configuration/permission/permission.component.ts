import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddRoleComponent } from '../../../components/dialogs/dialog-add-role/dialog-add-role.component';
import { AuthService, SecurityService, SubscriptionService } from 'core-services';
import { SecurityGroup, modules, ModulesAccess, modulesDescription, typeAccess, filterAvailableModules } from 'core-models';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  selectedSubscription!:any;
  groups!:SecurityGroup[];
  modulesDescription = modulesDescription;
  typeAccess = typeAccess;
  modules: string[] = Object.values(modules);
  modulesEnum = modules;

  constructor(private dialog: MatDialog,
              private securityService: SecurityService,
              private subscriptionService: SubscriptionService,
              private authService:AuthService,
              private translateService:TranslateService,
              private toastr: ToastrService,
              private helperService:HelpersService
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getAvailableModules();
    this.getSubscriptionGroups();
  }

  getAvailableModules(){
    this.subscriptionService.getAvailableModules(this.selectedSubscription?.ssid.uuid).subscribe(available => {
      this.modules = filterAvailableModules(Object.values(modules), available);
    });
  }

  getSubscriptionGroups(){
    this.securityService.getSecurityGroups(this.selectedSubscription?.ssid.uuid).subscribe((data:SecurityGroup[]) => {
      this.groups = data;
    })
  }

  returnModuleAccessType(uuidGroup:string,module:string){

    const indexGroup = this.groups.findIndex(objeto => objeto.uuid === uuidGroup);
    const indexModuleAccess = this.groups[indexGroup].modules_access.findIndex(objeto => objeto.module === module)

    return this.groups[indexGroup].modules_access[indexModuleAccess].type;

  }

  returnModuleDescription(module: string) {
    return this.modulesDescription.get(module);
  }

  /**
   * Solo se envían los módulos que incluye el plan (NAS-092). Un grupo creado antes, o de una
   * firma que bajó de plan, puede traer módulos que ya no están: el backend los rechaza.
   */
  updateSubscriptionGroups(group:SecurityGroup){
    const payload: SecurityGroup = {
      ...group,
      modules_access: PermissionComponent.onlyPlanModules(group.modules_access, this.modules)
    };
    this.securityService.updateSecurityGroup(payload,group.uuid || '',this.selectedSubscription?.ssid.uuid).subscribe(data => {})
  }

  static onlyPlanModules(modulesAccess: ModulesAccess[], planModules: string[]): ModulesAccess[] {
    return (modulesAccess || []).filter(access => planModules.includes(access.module));
  }

  deleteSecurityGroup(group: SecurityGroup) {
   this.helperService.showConfirmationDeleteDialog().then( (result) => {
    if(result.isConfirmed) this.executeDeletionSecurityGroup(group)
   })
  }

  handleRadioChange(event: MatRadioChange, group: any, module: any, accessType: any) {
    if (module === this.modulesEnum.ALL) {
      this.selectAllModulePerm(group, accessType);
    } else {
      this.selectModulePerm(group, module, accessType);
    }
    this.updateSubscriptionGroups(group);
  }


  executeDeletionSecurityGroup(group:SecurityGroup){

    this.securityService.deleteSecurityGroup(group.uuid || '',this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.getSubscriptionGroups();
      this.toastr.success('Ok',this.translateService.instant('successMessages.deleted_successfully')
      );
    });
  }

  openDialogNewRole(){
    const dialogRef = this.dialog.open(DialogAddRoleComponent);
    dialogRef.afterClosed().subscribe((result: any) => result && this.getSubscriptionGroups());
  }

  isModuleChecked(group: SecurityGroup, module: string): boolean {
      return group.modules_access
                  .findIndex((ma: ModulesAccess) => ma.module === module) > -1;
  }

  isModulePermChecked(group: SecurityGroup, module: string, perm: string): boolean {
      if (this.isModuleChecked(group, module)) {
          const moduleAccess: ModulesAccess | undefined = group.modules_access.find((ma: ModulesAccess) => ma.module === module);
          if (moduleAccess) {
            return moduleAccess.type === perm;
          }
          return false;
      }
      return false;
  }

  checkOrUncheckModule(group: SecurityGroup, module: string) {
      let isNewGroup: boolean = false;
      if (this.isModuleChecked(group, module)) {
          const moduleAccessIndex: number = group.modules_access.findIndex((ma: ModulesAccess) => ma.module === module);
          group.modules_access.splice(moduleAccessIndex, 1);
      } else {
          isNewGroup = true;
          const newModuleAccess: ModulesAccess = {
            module,
            type: this.typeAccess.ADMINISTRATOR,
            active: true
          };
          group.modules_access.push(newModuleAccess);
      }

      this.updateSubscriptionGroups(group);

  }

  checkOrUnCheckAllSections(event:MatCheckboxChange,group:SecurityGroup){

    group.modules_access = [];

    if(event.checked){
      this.modules.forEach( module => {
        const newModuleAccess: ModulesAccess = {
          module,
          type: this.typeAccess.ADMINISTRATOR,
          active: true
        };
        group.modules_access.push(newModuleAccess)

      })
    }

    this.updateSubscriptionGroups(group);

  }

  selectModulePerm(group: SecurityGroup, module: string, perm: string) {
    if (this.isModuleChecked(group, module)) {
        const moduleAccessIndex: number = group.modules_access.findIndex((ma: ModulesAccess) => ma.module === module);
        if (moduleAccessIndex > -1) {
          const oldModuleAccess: ModulesAccess = group.modules_access[moduleAccessIndex];
          const moduleAccess: ModulesAccess = {
              ... oldModuleAccess,
              type: perm
          };
          group.modules_access[moduleAccessIndex] = moduleAccess;
          this.updateSubscriptionGroups(group);
        }
    }
  }

  selectAllModulePerm(group:SecurityGroup,perm:string){
    group.modules_access = []

    this.modules.forEach( module => {
      const newModuleAccess: ModulesAccess = {
        module,
        type: perm,
        active: true
      };
      group.modules_access.push(newModuleAccess)

    })

    this.updateSubscriptionGroups(group);

  }

}
