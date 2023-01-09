import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService, CustomersService } from 'core-services';
import { Customer, SelectedSubscription } from 'core-models';
import { Observable } from 'rxjs';
import { throws } from 'assert';
import { DialogSendRegisterComponent } from '../../components/dialogs/dialog-send-register/dialog-send-register.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewCostumerComponent } from '../../components/dialogs/dialog-new-costumer/dialog-new-costumer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  memCustomers!: Customer[];
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;

  displayedColumns: string[] = [];
  dataSourceCustomers!: any;
  dataSourceCustomersTypePerson: any;
  dataSourceCustomersTypeBusiness: any;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    console.log(this.selectedSubscription);
    this.fetchCustomers();
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

    this.dataSourceCustomers = new MatTableDataSource<Customer>(
      this.memCustomers
    );
    this.dataSourceCustomersTypePerson = new MatTableDataSource<Customer>(
      this.customers_type_person
    );
    this.dataSourceCustomersTypeBusiness = new MatTableDataSource<Customer>(
      this.customers_type_bussiness
    );
  }

  fetchCustomers() {
    //console.log('selectedSubscription: ', this.selectedSubscription);
    if (this.selectedSubscription) {
      this.customersService
        .getCustomers(this.selectedSubscription?.ssid.uuid)
        .subscribe((customers: Customer[]) => {
          console.log(customers);
          this.memCustomers = customers;
          this.ngAfterViewInit();
        });
    }
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
    return customer.contacts.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  getFirstEmail(customer: Customer): string {
    return customer.contacts.map((c: any) => {
      return c.contact_value;
    })[0];
  }

  applyFilter(filterValue: any, typeCustomer = '') {
    switch (typeCustomer) {
      case 'P':
        filterValue = filterValue.target.value.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceCustomersTypePerson.filter = filterValue;
        break;

      case 'B':
        filterValue = filterValue.target.value.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceCustomersTypeBusiness.filter = filterValue;
        break;

      default:
        filterValue = filterValue.target.value.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceCustomers.filter = filterValue;
        break;
    }
  }

  get customers(): Customer[] {
    //console.log('Customers: ', this.memCustomers);
    if (this.memCustomers) {
      return this.memCustomers;
    }
    return [];
  }

  get customers_type_person(): Customer[] {
    //console.log('Customers Person: ', this.memCustomers);
    if (this.memCustomers) {
      return this.memCustomers.filter((x) => x.type === 'P');
    }

    return [];
  }

  get customers_type_bussiness(): Customer[] {
    //console.log('Customers Bussiness: ', this.memCustomers);
    if (this.memCustomers) {
      return this.memCustomers.filter((x) => x.type === 'B');
    }

    return [];
  }

  navigateToClientProfile(id:string)
  {
    this.router.navigate(['client-profile',id]);
  }

  openDialogSendRegister() {
    this.dialog.open(DialogSendRegisterComponent);
  }
  openDialogNewCostumer() {
    this.dialog.open(DialogNewCostumerComponent);
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
