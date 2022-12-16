import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService, CustomersService } from 'core-services';
import { Customer, SelectedSubscription } from 'core-models';
import { Observable } from 'rxjs';
import { throws } from 'assert';
import { DialogSendRegisterComponent } from '../../components/dialogs/dialog-send-register/dialog-send-register.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewCostumerComponent } from '../../components/dialogs/dialog-new-costumer/dialog-new-costumer.component';

export interface PeriodicElement {
  position: number;
  name: string;
  number: string;
  email: string;
  date: string;
  update: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 2,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 3,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 4,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 5,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 6,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
  {
    position: 7,
    name: 'Manuel Cabral',
    number: '(789) 378 27483',
    email: 'emireles@labforapps.com',
    date: '9 Nov. 2022',
    update: '9 Nov. 2022',
  },
];

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  memCustomers!: Customer[];
  selectedSubscription!: SelectedSubscription | null;

  displayedColumns: string[] = [
    'select',
    'type',
    'name',
    'number',
    'email',
    'date',
    'update',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.fetchCustomers();
  }

  fetchCustomers() {
    console.log('selectedSubscription: ', this.selectedSubscription);
    if (this.selectedSubscription) {
      this.customersService
        .getCustomers(this.selectedSubscription?.ssid)
        .subscribe((customers: Customer[]) => {
          //console.log(customers);
          this.memCustomers = customers;
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

  openDialogSendRegister() {
    this.dialog.open(DialogSendRegisterComponent);
  }
  openDialogNewCostumer() {
    this.dialog.open(DialogNewCostumerComponent);
  }
}
