import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddRoleComponent } from '../../../components/dialogs/dialog-add-role/dialog-add-role.component';
import { AuthService, SecurityService } from 'core-services';
import { Group, modules, modulesDescription, typeAccess } from 'core-models';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  selectedSubscription!:any;
  groups!:Group[];
  modulesDescription = modulesDescription;
  typeAccess = typeAccess;
  modules = Object.values(modules);

  constructor(private dialog: MatDialog,
              private securityService:SecurityService,
              private authService:AuthService,
              private translateService:TranslateService,
              private toastr: ToastrService,
              ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getSubscriptionGroups();
    console.log(this.modules);
  }

  getSubscriptionGroups(){
    this.securityService.getSecurityGroups(this.selectedSubscription?.ssid.uuid).subscribe((data:Group[]) => {
      this.groups = data.sort((a, b) => (b.group && a.group) ? b.group - a.group : 0);
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

  updateSubscriptionGroups(group:Group){
    this.securityService.updateSecurityGroup(group,group.uuid || '',this.selectedSubscription?.ssid.uuid).subscribe(data => {})
  }

  deleteSecurityGroup(group: Group) {
    Swal.fire({
      title: this.translateService.instant(
        'clients.table.buttons.confirm_question_delete'
      ),
      text: this.translateService.instant(
        'clients.table.buttons.actions_cannot_be_reversed'
      ),
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: this.translateService.instant(
        'clients.table.buttons.delete'
      ),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant(
        'clients.client_intake.close_window'
      ),
      customClass: {
        popup: 'c-alert c-alert--delete',
      },
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.executeDeletionSecurityGroup(group)
      }
    });
  }

  executeDeletionSecurityGroup(group:Group){

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

}
