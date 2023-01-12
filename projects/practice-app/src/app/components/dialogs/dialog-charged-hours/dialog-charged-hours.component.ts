import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskHour } from 'core-models';
import { DialogAddHoursComponent } from '../dialog-add-hours/dialog-add-hours.component';

@Component({
  selector: 'app-dialog-charged-hours',
  templateUrl: './dialog-charged-hours.component.html',
  styleUrls: ['./dialog-charged-hours.component.scss']
})
export class DialogChargedHoursComponent implements OnInit {
  hours:TaskHour[] = [
    { uuid: '1', expedientId: '1', userId: '1', pricePerHour: 10, quotedHours: 1, isBillable: true, description: 'llamar a la esposa', createdAt: new Date(), state: 1 },
    { uuid: '2', expedientId: '2', userId: '1', pricePerHour: 15, quotedHours: 1, isBillable: true, description: 'llamar a la esposa', createdAt: new Date(), state: 1 },
  ];

  ngOnInit(): void {
  }

  openDialogAddHours(task?:TaskHour){
    this.dialog.open(DialogAddHoursComponent, {
      data: task
    });
  }

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any) {
    console.log(data);
  }

  get totalHours(){
    return this.hours.reduce((acc, curr) => acc + curr.quotedHours, 0);
  }

  get totalAmount(){
    return this.hours.reduce((acc, curr) => acc + curr.quotedHours * curr.pricePerHour, 0);
  }
}
