import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewExpedientComponent } from '../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.scss']
})
export class ExpedientComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialogNewExpedient(){
    this.dialog.open(DialogNewExpedientComponent);
  }

}
