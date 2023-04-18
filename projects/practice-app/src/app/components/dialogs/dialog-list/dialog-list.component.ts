import { Component, OnInit } from '@angular/core';
import { CustomersService,AuthService } from 'core-services';
import { Customer } from 'core-models';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.scss'],
})
export class DialogListComponent implements OnInit {
  selectedSubscription!: any;
  customers!: Customer[];
  customersTemp!:Customer[];
  searchTerm: string = '';

  constructor(
    private customerService: CustomersService,
    private authService: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogListComponent>
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getCustomersAvailableForLink();
  }

  getCustomersAvailableForLink() {
    this.customerService
      .getCustomersAvailableForLink(this.selectedSubscription?.ssid.uuid)
      .subscribe((data:Customer[]) => {

        const filteredArray = data.filter(item => {
          return item.type === "B"
        });

        this.customers = filteredArray;
        this.customersTemp = filteredArray;

      });
  }

  searchCustomer(){
    const searchTerm = this.searchTerm.trim().toLowerCase();

    const filteredArray = this.customers.filter(item =>
      item.company_name.trim().toLowerCase().includes(searchTerm)
    );

    this.customers = searchTerm ? filteredArray : this.customersTemp
  }

  closeModal(customerId = '') {
    this.dialogRef.close(customerId);
  }
}
