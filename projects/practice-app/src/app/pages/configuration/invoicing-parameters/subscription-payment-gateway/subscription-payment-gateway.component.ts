import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPaymentGateway } from 'core-models';
import { DialogAddPaymentGatewayComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-add-payment-gateway/dialog-add-payment-gateway.component';
import { AuthService, SubscriptionService } from 'core-services';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-subscription-payment-gateway',
  templateUrl: './subscription-payment-gateway.component.html',
  styleUrls: ['./subscription-payment-gateway.component.scss']
})
export class SubscriptionPaymentGatewayComponent implements OnInit {

  selectedSubscription!:any;
  displayedColumns: string[] = ['select', 'type','provider', 'date', 'action'];
  dataSource = new MatTableDataSource<SubscriptionPaymentGateway>([]);
  selection = new SelectionModel<SubscriptionPaymentGateway>(true, []);
  subscriptionPaymentGateways!:SubscriptionPaymentGateway[]

  constructor(public dialog: MatDialog,
              private subscriptionService:SubscriptionService,
              private authService:AuthService,
              private helperService:HelpersService
  ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getSubscriptionPaymentGateway()
  }

  getSubscriptionPaymentGateway(){
    this.subscriptionService.getSubscriptionPaymentGateway(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data) => {
        this.subscriptionPaymentGateways = data;
        this.dataSource.data = data
      }
    })
  }

  openDialogSubscriptionPaymentGateway(subscriptionPaymentGateway?:SubscriptionPaymentGateway){
    const dialogRef = this.dialog.open( DialogAddPaymentGatewayComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        this.getSubscriptionPaymentGateway()
      }
    })
  }

  deleteSubscriptionPaymentGateway(subscriptionPaymentGateway?:SubscriptionPaymentGateway){
    this.helperService.showConfirmationDeleteDialog().then(data => {
      if(data.isConfirmed){
        this.subscriptionService.deleteSubscriptionPaymentGateway(this.selectedSubscription?.ssid.uuid,subscriptionPaymentGateway?.uuid || '').subscribe({
          next: (data) => {
            this.helperService.showMessageDeleted()
            this.getSubscriptionPaymentGateway()
          }
        })
      }
    })
  }

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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return '';
  }

}
