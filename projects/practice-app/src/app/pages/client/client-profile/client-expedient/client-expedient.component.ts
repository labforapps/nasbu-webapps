import { Component, Input, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogNewExpedientComponent } from '../../../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { CaseFile, Customer, modules } from 'core-models';
import { CustomersService, PracticeService } from 'core-services';

@Component({
  selector: 'app-client-expedient',
  templateUrl: './client-expedient.component.html',
  styleUrls: ['./client-expedient.component.scss']
})
export class ClientExpedientComponent implements OnInit {

  @Input() customer!:Customer;
  caseFiles!:CaseFile[];
  module = modules

  constructor(public dialog: MatDialog,
              private customerService:CustomersService) { }

  ngOnInit(): void {
    this.getCaseFilesByCustomer();
  }

  getCaseFilesByCustomer(){
    this.customerService.getCaseFilesByCustomer(this.customer.subscription || '',this.customer.uuid || '').subscribe((data:CaseFile[]) => {
      this.caseFiles = data;
    })
  }

}

