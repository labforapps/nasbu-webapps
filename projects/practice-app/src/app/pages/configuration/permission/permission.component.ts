import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddRoleComponent } from '../../../components/dialogs/dialog-add-role/dialog-add-role.component';
import { AuthService, SecurityService } from 'core-services';
import { Group, modulesDescription, typeAccess } from 'core-models';
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

  constructor(public dialog: MatDialog,
              public securityService:SecurityService,
              public authService:AuthService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.getSubscriptionGroups();

  }

  getSubscriptionGroups(){
    this.securityService.getSecurityGroups(this.selectedSubscription?.ssid.uuid).subscribe((data:Group[]) => {
      console.log(data);
      this.groups = data;
    })
  }

  returnModuleDescription(module: string) {
    return this.modulesDescription.get(module);
  }

  openDialogNewRole(){
    this.dialog.open(DialogAddRoleComponent);
  }

}
