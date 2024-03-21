import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../../components/dialogs/dialog-list/dialog-list.component';
import { CustomersService } from 'core-services';
import { Customer } from 'core-models';
import { AuthService } from 'core-services';
@Component({
  selector: 'app-associate-customers',
  templateUrl: './associate-customers.component.html',
  styleUrls: ['./associate-customers.component.scss'],
})
export class AssociateCustomersComponent implements OnInit {
  customer!: Customer | null;
  @Output() customerIdSelected = new EventEmitter<any>();
  @Input() customerId!: string;
  selectedSubscription: any;

  constructor(
    public dialog: MatDialog,
    private customerService: CustomersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    if (this.customerId) {
      this.getCustomerById();
    }
  }

  getCustomerById() {
    if(this.customerId){
      this.customerService
        .getCustomerById(this.selectedSubscription?.ssid.uuid, this.customerId)
        .subscribe((data: any) => {
          if(data.linked_customer){
            this.customerService
              .getCustomerById(
                this.selectedSubscription?.ssid.uuid,
                data.linked_customer
              )
              .subscribe((data) => {
                this.customer = data;
              });
          }
        });
    }
  }

  openDialogList() {
    const dialogRef = this.dialog.open(DialogListComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.customerService
        .getCustomerById(this.selectedSubscription?.ssid.uuid, result)
        .subscribe((data) => {
          this.customer = data;
          this.customerIdSelected.emit(result);
        });
      }
    });
  }

unlinkCustomer()
{
  this.customer = null;
  this.customerIdSelected.emit(null);
}

}
