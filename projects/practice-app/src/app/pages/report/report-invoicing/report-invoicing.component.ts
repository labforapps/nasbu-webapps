import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-invoicing',
  templateUrl: './report-invoicing.component.html',
  styleUrls: ['./report-invoicing.component.scss']
})
export class ReportInvoicingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  export(){
    const newTab = window.open();
    if(newTab) newTab.document.body.innerHTML = '<h1>Hola Mundo</h1>';
  }

}
