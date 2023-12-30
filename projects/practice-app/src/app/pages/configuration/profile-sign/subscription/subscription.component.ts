import { Component, Input, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { AuthService, CoreService, SubscriptionService } from 'core-services';
import { Plan, Subscription } from 'core-models';
import * as moment from 'moment'

export interface PeriodicElement {
  position: number;
  task: string;
  status: string;
  expedient: string;
  date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 2, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 3, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 4, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 5, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 6, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
  {position: 7, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: '23/9/22 '},
];

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  displayedColumns: string[] = ['select', 'type','task', 'status', 'expedient', 'date', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @Input() subscription!:Subscription;
  showSubscriptionBillingHistory:boolean = false
  selectedPlan!:Plan | undefined

  constructor(private coreService:CoreService) { }

  ngOnInit(): void {
    this.getPlans()
  }

  getPlans(){
    this.coreService.getPlans().subscribe(data => {
      this.selectedPlan = data.find(x => x.uuid === this.subscription.plan)
    })
  }

  returnExpiredDate(){
    return moment(new Date(this.subscription.effective_date)).add(30, 'd').toDate()
  }

  viewSubscriptionBillingHistory(){
    this.showSubscriptionBillingHistory = true
  }

  viewSubscriptionPlan(){
    this.showSubscriptionBillingHistory = false
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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
