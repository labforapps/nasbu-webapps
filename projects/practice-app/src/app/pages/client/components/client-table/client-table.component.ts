import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { Customer } from 'core-models';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService, CustomersService } from 'core-services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';


@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss'],
})
export class ClientTableComponent implements OnInit {
  @Input() customers!: Customer[];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  sortAsc:boolean = true;

  dataSourceCustomers!: any;
  displayedColumns: string[] = [];
  selectedSubscription!: any;

  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.displayedColumns = [
      'select',
      'type',
      'name',
      'number',
      'email',
      'date',
      'update',
      'action',
    ];

    this.dataSourceCustomers = new MatTableDataSource<Customer>(this.customers);

    this.dataSourceCustomers.paginator = this.paginator;
  }

  applyFilter(filterValue: any, typeCustomer = '') {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceCustomers.filter = filterValue;
  }

  sortByName() {
    if (this.sortAsc) {
      this.customers.sort((a, b) => {

         if (a.first_name && b.first_name) {
           return a.first_name.localeCompare(b.first_name);
         } else {
           return (a.company_name ?? '').localeCompare(b.company_name ?? '');
         }

      });
    } else {
      this.customers.sort((a, b) => {
        if (a.first_name && b.first_name) {
          return b.first_name.localeCompare(a.first_name);
        } else {
          return (b.company_name ?? '').localeCompare(a.company_name ?? '');
        }
      });
    }
    this.sortAsc = !this.sortAsc; // toggle the sort order flag

    this.dataSourceCustomers = new MatTableDataSource<Customer>(this.customers);
  }

  getCustomerIconUrl(customer: Customer): string {
    let iconUrl: string = '';
    const customerType: string = customer.type.toLowerCase();
    if (customerType === 'p') {
      iconUrl = '../../../../assets/images/table-icons/user.svg';
    } else if (customerType === 'b') {
      iconUrl = '../../../../assets/images/table-icons/company.svg';
    }

    return iconUrl;
  }

  getCustomerName(customer: Customer): string {
    let customerName: string = '';
    const customerType: string = customer.type.toLowerCase();
    if (customerType === 'p') {
      customerName = `${customer.first_name} ${customer.last_name}`;
    } else if (customerType === 'b') {
      customerName = customer.company_name;
    }

    return customerName;
  }

  getFirstContact(customer: Customer): string {
    const customer_contacts_phone = customer.contacts.filter(
      (x) => x.type === 'P'
    );

    return customer_contacts_phone.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  getFirstEmail(customer: Customer): string {
    const customer_contacts_email = customer.contacts.filter(
      (x) => x.type === 'E'
    );

    return customer_contacts_email.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  returnDateFormatted(dateCustomer: string) {
    const date = moment(dateCustomer);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

  deleteClient(id: string) {
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.customersService
          .deleteCustomer(this.selectedSubscription?.ssid.uuid, id)
          .subscribe(
            (data) => {
              console.log(data);
              this.toastr.success(
                'Ok',
                this.translateService.instant(
                  'successMessages.deleted_successfully'
                )
              );
              //this.fetchCustomers();
            },
            (error) => {
              this.toastr.error(
                'Error',
                this.translateService.instant('errorMessages.unexpectedError')
              );
            }
          );
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCustomers.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceCustomers.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  navigateToClientProfile(id: string) {
    this.router.navigate(['client-profile', id]);
  }

  navigateToEditClient(id: string) {
    console.log(id);
    this.router.navigate(['customers/edit', id]);
  }
}
