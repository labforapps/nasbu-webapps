import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-image-viewer',
  templateUrl: './dialog-image-viewer.component.html',
  styleUrls: ['./dialog-image-viewer.component.scss']
})
export class DialogImageViewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {url: string}) { }

  ngOnInit(): void {
  }

}
