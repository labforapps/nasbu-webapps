import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {
  dashboardInfo = { 
    dossier:{
      closed: 50,
      opened: 35
    },
    billed: {
      billedAmount: 50000,
      collected: 45000.00
    },
    task:{
      done: 50,
      pending: 35,
      overdue: 2
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

}
