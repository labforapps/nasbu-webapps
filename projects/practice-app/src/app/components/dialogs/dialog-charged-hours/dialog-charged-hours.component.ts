import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddHoursComponent } from '../dialog-add-hours/dialog-add-hours.component';

@Component({
  selector: 'app-dialog-charged-hours',
  templateUrl: './dialog-charged-hours.component.html',
  styleUrls: ['./dialog-charged-hours.component.scss']
})
export class DialogChargedHoursComponent implements OnInit {

  

  ngOnInit(): void {
  }

  openDialogAddHours(){
    this.dialog.open(DialogAddHoursComponent);
  }

  constructor(public dialog: MatDialog) { }
}
