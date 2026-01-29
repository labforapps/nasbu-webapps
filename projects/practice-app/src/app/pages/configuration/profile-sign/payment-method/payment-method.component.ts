import { Component, Input, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddCreditcardComponent } from '../../../../components/dialogs/dialog-add-creditcard/dialog-add-creditcard.component';
import { Observable } from 'rxjs';
import { OnboardingTokenizationSessionResult, Subscription, SubscriptionPaymentMethod, SubscriptionPaymentMethodPayload } from 'core-models';
import { SubscriptionService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';
import { ToastrService } from 'ngx-toastr';

declare var P: any;

export interface PeriodicElement {
  position: number;
  date: string;
  status: string;
  priority: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 2, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 3, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 4, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 5, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 6, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 7, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},

];

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  displayedColumns: string[] = ['select', 'method','date', 'status', 'priority', 'action'];
  dataSource = new MatTableDataSource<SubscriptionPaymentMethod>([]);
  selection = new SelectionModel<SubscriptionPaymentMethod>(true, []);

  @Input()
  subscription!: Subscription;

  paymentMethods$!: Observable<SubscriptionPaymentMethod[]>;
  paymentMethods!: SubscriptionPaymentMethod[];

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
    return '';
  }

  openDialogAddCreditcard(){
    this.dialog.open( DialogAddCreditcardComponent);
  }

  constructor(public dialog: MatDialog,
              private helperService: HelpersService,
              private subscriptionService: SubscriptionService,
              private translateService: TranslateService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
      this.fetchPaymentMethods();
  }

  fetchPaymentMethods() {
      if (this.subscription) {
        this.subscriptionService
        .getSubscriptionPaymentMethods(this.subscription.uuid)
        .subscribe((paymentMethods: SubscriptionPaymentMethod[]) => {
              this.paymentMethods = paymentMethods;
              this.dataSource.data = paymentMethods;
        });
      }

  }

  addNewPaymentMethod() {
      this.subscriptionService
          .createPaymentMethodTokenizationSession(this.subscription.uuid)
          .subscribe((result: OnboardingTokenizationSessionResult) => {
              if (result.status && result.status['status'].toLowerCase() == 'ok') {
                  this.initTokenizationForm(result.processUrl);
              } else {
                 //TODO: translate error message
              }
          }, (error) => {
              //TODO: translate error message
          })
  }

  initTokenizationForm(processUrl: string) {
      P.init(processUrl);
      P.on('response', (response: OnboardingTokenizationSessionResult) => {
          console.log('PM Response: ', response);
          if (response.status && response.status['status'].toLowerCase() == 'approved') {
            this.createNePaymentMethod(response);
          } else {
              //TODO: translate error message
          }
      });
  }

  setPaymentMethodAsDefault(paymentMethod: SubscriptionPaymentMethod) {
      this.subscriptionService
          .setSubscriptionPaymentMethodAsDefault(this.subscription.uuid, paymentMethod.uuid)
          .subscribe((response) => {
              //TODO: translate success message and update payment methods list
          }, (error) => {
              //TODO: translate error message
          });
  }

  createNePaymentMethod(result: OnboardingTokenizationSessionResult) {
      const payload: SubscriptionPaymentMethodPayload = {
         subscription: this.subscription.uuid,
         request_id: result.requestId
      };
      this.subscriptionService
          .createSubscriptionPaymentMethod(payload)
          .subscribe((res: any) => {
              //TODO: translate success message and update payment methods list
          }, (error) => {
              //TODO: translate error message
          });
  }

  deletePaymentMethod(id: string) {
    this.helperService.showConfirmationDeleteDialog().then((result) => {
       if (result.isConfirmed) {
         this.subscriptionService
           .deleteSubscriptionPaymentMethod(this.subscription?.uuid, id)
           .subscribe(
             (data: any) => {
 
               const arrayFiltered = this.paymentMethods.filter(x => x.uuid !== id);
               this.paymentMethods = arrayFiltered;
               this.dataSource.data = this.paymentMethods;
 
               this.helperService.showMessageDeleted()
             },
             (error: any) => {
               this.toastrService.error('Error',this.translateService.instant('errorMessages.unexpectedError'));
             }
           );
       }
     });
   }

}
