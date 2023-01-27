import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../../components/dialogs/dialog-list/dialog-list.component';
import { CustomersService } from 'core-services';
import { Customer } from 'core-models';

@Component({
  selector: 'app-associate-customers',
  templateUrl: './associate-customers.component.html',
  styleUrls: ['./associate-customers.component.scss'],
})
export class AssociateCustomersComponent implements OnInit {
  customer!: Customer;
  @Output() customerIdSelected = new EventEmitter<string>();
  @Input() customerId!: string;

  constructor(
    public dialog: MatDialog,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    if(this.customerId)
    {
      this.getCustomerById();
    }
  }

  getCustomerById()
  {
    this.customerService
      .getCustomerById('a4e9fb1e-72f6-4860-8629-3e1b0594ac2a', this.customerId)
      .subscribe((data:any) => {
        console.log(data);
        this.customerService.getCustomerById(
          'a4e9fb1e-72f6-4860-8629-3e1b0594ac2a',
          data.linked_customer
        ).subscribe( data => {
          this.customer = data;
        });
      });
  }

  openDialogList() {
    const dialogRef = this.dialog.open(DialogListComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      this.customerService
        .getCustomerById('a4e9fb1e-72f6-4860-8629-3e1b0594ac2a', result)
        .subscribe((data) => {
          this.customer = data;
          this.customerIdSelected.emit(result);
        });
    });
  }
}
