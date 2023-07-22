import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-document-viewer',
  templateUrl: './dialog-document-viewer.component.html',
  styleUrls: ['./dialog-document-viewer.component.scss']
})
export class DialogDocumentViewerComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogDocumentViewerComponent>,
   @Inject(MAT_DIALOG_DATA) public data: {url: string},) { }

  ngOnInit(): void {
  }

}
