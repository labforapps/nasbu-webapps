import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionBillingFee } from 'core-models';
import { SubscriptionService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-add-tax',
  templateUrl: './dialog-add-tax.component.html',
  styleUrls: ['./dialog-add-tax.component.scss']
})
export class DialogAddTaxComponent implements OnInit {

  tax_pct:string = "0"
  subscriptionBillingFee!:SubscriptionBillingFee

  constructor(private subscriptionService:SubscriptionService,
              @Inject(MAT_DIALOG_DATA) public dataDialog: { subscriptionBillingFee:SubscriptionBillingFee[] },
              private dialogRef:MatDialogRef<DialogAddTaxComponent>,
              private helperService:HelpersService ) { }

  ngOnInit(): void {

    this.subscriptionBillingFee = this.dataDialog.subscriptionBillingFee[0]
  }

  saveSubscriptionBillingFee(){

    const subscriptionBillingFeePayload:SubscriptionBillingFee = {
      ...this.subscriptionBillingFee,
      tax_pct: this.tax_pct
    }

    this.subscriptionService.saveSubscriptionBillingFee(subscriptionBillingFeePayload).subscribe(data => {
      this.helperService.showMessageUpdated()
      this.dialogRef.close([data])
    })

  }

}
