import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
 import { DialogNewTaskComponent } from '../../components/dialogs/dialog-new-task/dialog-new-task.component';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {

  openDialogNewTask(){
    this.dialog.open(DialogNewTaskComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
