import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  number: string;
  status: string;
  expedient: string;
  client: string;
  date: string;
  amount: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { number: '1', status: 'Pagado', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
  { number: '2', status: 'Pagado', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
  { number: '3', status: 'Pendiente de pago ', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
  { number: '4', status: 'Pendiente de pago ', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
  { number: '5', status: 'Pendiente de pago ', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
  { number: '6', status: 'Pendiente de pago ', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral ', date: '12/9/2021', amount: '500 USD' },
];

@Component({
  selector: 'app-report-invoicing-export',
  templateUrl: './report-invoicing-export.component.html',
  styleUrls: ['./report-invoicing-export.component.scss']
})
export class ReportInvoicingExportComponent implements OnInit {
  displayedColumns: string[] = ['type', 'number', 'status', 'expedient', 'client', 'date', 'amount'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  constructor() { }

  ngOnInit(): void {
  }

}
