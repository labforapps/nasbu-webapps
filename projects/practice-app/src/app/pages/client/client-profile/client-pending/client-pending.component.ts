import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer,Task, modules } from 'core-models';
import { CustomersService } from 'core-services';

@Component({
  selector: 'app-client-pending',
  templateUrl: './client-pending.component.html',
  styleUrls: ['./client-pending.component.scss']
})
export class ClientPendingComponent implements OnInit {

  @Input() customer!:Customer;
  tasks!:Task[];
  module = modules;

  constructor(public dialog: MatDialog,
             private customerService:CustomersService) { }

  ngOnInit(): void {
    this.getTasksByCustomer();
  }

  getTasksByCustomer(){
    this.customerService.getTasksByCustomer(this.customer.subscription || '',this.customer.uuid || '').subscribe((data:Task[]) => {
      this.tasks = data;
    })
  }



}
