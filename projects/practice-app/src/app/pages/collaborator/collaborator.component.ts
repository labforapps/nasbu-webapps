import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService,SecurityService } from 'core-services';
import { Group, SecurityUser, TypeContact } from 'core-models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  displayedColumns: string[] = [];
  selection = new SelectionModel<SecurityUser>(true, []);
  @ViewChild(MatPaginator) paginator: any;
  selectedSubscription!: any;
  securityUsers!:SecurityUser[];
  dataSourceSecurityUsers!: any;
  typeContact = TypeContact;
  securityGroups!:Group[];
  searchQuery!: string;

  constructor(private router:Router,
              private translateService:TranslateService,
              private securityService:SecurityService,
              private authService: AuthService,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getSecurityUsers();
    this.getSecurityGroups();
  }

  ngAfterViewInit(): void {

    this.displayedColumns = ['select', 'type','name', 'number', 'email', 'rol','license', 'action'];

    this.dataSourceSecurityUsers = new MatTableDataSource<SecurityUser>(this.securityUsers);
    this.dataSourceSecurityUsers.paginator = this.paginator;
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe((data:SecurityUser[]) => {

      this.securityUsers = data.map(item => {
        return {
            ...item,
            first_name: item.user.first_name,
        };
    });

      this.dataSourceSecurityUsers = new MatTableDataSource<SecurityUser>(this.securityUsers);
      this.dataSourceSecurityUsers.paginator = this.paginator;
    })
  }

  getFirstContact(securityUser: SecurityUser,type:TypeContact): string {
    const contactSecurityUser = securityUser.contacts.filter(x => x.type === type);
    return contactSecurityUser[0]?.contact_value ? contactSecurityUser[0].contact_value : '' ;
  }

  getSecurityGroupNameByNumber(group:number){
    const securityGroup = this.securityGroups.filter( x => x.group === group);
    return securityGroup[0]?.name || '';
  }

  getSecurityGroups(){
    this.securityService.getSecurityGroups(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityGroups = data;
    })
  }

  applyFilter(event: any) {
    this.dataSourceSecurityUsers.filter = event.target.value.trim().toLowerCase();
  }

  navigateToEditUser(id:string){
    this.router.navigate(['user/edit', id]);
  }

  deleteCollaborator(uuid:string) {
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
        this.securityService.deleteSecurityUser(this.selectedSubscription?.ssid.uuid,uuid).subscribe( data => {
            this.toastr.success("Ok","Deleted Successfully");
            this.getSecurityUsers();
        })
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceSecurityUsers.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceSecurityUsers.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  navigateToSecurityUserProfile(id: string) {
    this.router.navigate(['user-profile', id]);
  }

}
