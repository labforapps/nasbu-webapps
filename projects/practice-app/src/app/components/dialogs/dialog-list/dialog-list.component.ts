import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'core-services';
import { Customer } from 'core-models';

@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.scss'],
})
export class DialogListComponent implements OnInit {

  customers!:Customer[];

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {}

  getCustomersAvailableForLink(){}


}
