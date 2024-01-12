import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { Customer, TypeContact, TypeCustomer } from 'core-models';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, CustomersService } from 'core-services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

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
  customerType = TypeCustomer
  typeContact = TypeContact

  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private helperService:HelpersService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
  }

  ngAfterViewInit(): void {

    this.displayedColumns = ['select','type','name','number','email','date','update','action',];

    this.sortByName();
    this.dataSourceCustomers = new MatTableDataSource<Customer>(this.customers);

    this.dataSourceCustomers.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {

    filterValue = filterValue.target.value.trim().toLowerCase();

    this.dataSourceCustomers.filterPredicate = (data:any, filter:any) => {

      const matchFound = Object.values(data).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        }
        return false;
      });

      const contactMatchFound = data.contacts.some((contact: any) => {
        return Object.values(contact).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filter);
          }
          return false;
        });
      });

      return matchFound || contactMatchFound;
    };

    this.dataSourceCustomers.filter = filterValue;
  }

  sortByName() {

    if(this.sortAsc) this.customers = this.helperService.returnCustomerListSorted(this.customers,'ascendant')
    if(!this.sortAsc) this.customers = this.helperService.returnCustomerListSorted(this.customers,'descendant')

    this.sortAsc = !this.sortAsc; // toggle the sort order flag

    this.dataSourceCustomers = new MatTableDataSource<Customer>(this.customers);
  }

  getCustomerIconUrl(customer: Customer): string {
    let iconUrl: string = '';

    if (customer.type === this.customerType.person) {
      iconUrl = '../../../../assets/images/table-icons/user.svg';
    } else if (customer.type === this.customerType.business) {
      iconUrl = '../../../../assets/images/table-icons/company.svg';
    }

    return iconUrl;
  }

  getFirstContact(customer: Customer): string {
    const customer_contacts_phone = customer.contacts.filter(
      (x) => x.type === this.typeContact.phone_number
    );

    return customer_contacts_phone.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  getFirstEmail(customer: Customer): string {
    const customer_contacts_email = customer.contacts.filter(
      (x) => x.type === this.typeContact.email
    );

    return customer_contacts_email.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  deleteClient(id: string) {
   this.helperService.showConfirmationDeleteDialog().then((result) => {
      if (result.isConfirmed) {
        this.customersService
          .deleteCustomer(this.selectedSubscription?.ssid.uuid, id)
          .subscribe(
            (data) => {

              const arrayFiltered = this.customers.filter(x => x.uuid !== id);
              this.customers = arrayFiltered;
              this.dataSourceCustomers.data = this.customers;

              this.helperService.showMessageDeleted()
            },
            (error) => {
              this.toastr.error('Error',this.translateService.instant('errorMessages.unexpectedError'));
            }
          );
      }
    });
  }

  navigateToClientProfile(id: string) {
    this.router.navigate(['client-profile', id]);
  }

  navigateToEditClient(id: string) {
    this.router.navigate(['customers/edit', id]);
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
}
