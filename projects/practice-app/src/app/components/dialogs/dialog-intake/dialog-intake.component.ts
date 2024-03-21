import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentUserInfo } from 'core-models';

@Component({
  selector: 'app-dialog-intake',
  templateUrl: './dialog-intake.component.html',
  styleUrls: ['./dialog-intake.component.scss']
})
export class DialogIntakeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: {currentUserInfo:CurrentUserInfo}) { }

  ngOnInit(): void {
  }

}
