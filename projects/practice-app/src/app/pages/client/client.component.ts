import { Component, OnInit} from '@angular/core';
import { AuthService, CustomersService } from 'core-services';
import { Customer, SelectedSubscription } from 'core-models';
import { Observable } from 'rxjs';
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
  memCustomers: Customer[] = [];
  customersLoaded = false;
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;

  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.fetchCustomers();
  }

  ngAfterViewInit(): void {
  }

  fetchCustomers() {
    if (this.selectedSubscription) {
      this.customersService
        .getCustomers(this.selectedSubscription?.ssid.uuid)
        .subscribe({
          next: (customers: Customer[]) => {
            this.memCustomers = customers;
            this.customersLoaded = true;
            this.ngAfterViewInit();
          },
          error: () => this.customersLoaded = true
        });
    }
  }

  get customers(): Customer[] {
    if (this.memCustomers) {
      return this.memCustomers;
    }
    return [];
  }

  get customers_type_person(): Customer[] {
    if (this.memCustomers) {
      return this.memCustomers.filter((x) => x.type === 'P');
    }

    return [];
  }

  get customers_type_bussiness(): Customer[] {
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
