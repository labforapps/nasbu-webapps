import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewExpedientTaskComponent } from '../../../../components/dialogs/dialog-new-expedient-task/dialog-new-expedient-task.component';
import { PracticeService } from 'core-services';
import { CaseFile, Task, modules } from 'core-models';

@Component({
  selector: 'app-expedient-tasks',
  templateUrl: './expedient-tasks.component.html',
  styleUrls: ['./expedient-tasks.component.scss']
})
export class ExpedientTasksComponent implements OnInit {

  @Input() caseFile!:CaseFile;
  @Output() onExecuteTask = new EventEmitter<any>();
  tasks!:Task[];
  module = modules;


  constructor(public dialog: MatDialog,
             private practiceService:PracticeService) { }

  ngOnInit(): void {
    this.getTasksByCaseFile();
  }

  getTasksByCaseFile(){
    this.practiceService.getTasksByCaseFile(this.caseFile.subscription || '',this.caseFile.uuid || '').subscribe((data:Task[]) => {
      this.tasks = data;
    })
  }

  executeTask(){
    this.getTasksByCaseFile()
    this.onExecuteTask.emit()
  }

  openDialogNewTask(){
    this.dialog.open(DialogNewExpedientTaskComponent);
  }


}
