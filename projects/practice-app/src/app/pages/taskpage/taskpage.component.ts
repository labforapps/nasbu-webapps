import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tasks } from 'core-models';
import { TaskState } from 'projects/core-models/src/public-api';
import { DialogNewReasonComponent } from '../../components/dialogs/dialog-new-reason/dialog-new-reason.component';
import { DialogNewTaskComponent } from '../../components/dialogs/dialog-new-task/dialog-new-task.component';

@Component({
  selector: 'app-taskpage',
  templateUrl: './taskpage.component.html',
  styleUrls: ['./taskpage.component.scss']
})
export class TaskpageComponent implements OnInit {
  currentTab: number = 0;
  tabs = [
    { title: 'todas', badge: 0, active: true, value: 0 },
    { title: 'completados', badge: 0, active: true, value: TaskState.Completed },
    { title: 'pendientes', badge: 0, active: true, value: TaskState.Pending },
    { title: 'vencidas', badge: 0, active: true, value: TaskState.Overdue },
  ];

  tasks:Tasks[] = [
    {
      uuid: "1", 
      expedientId: "1",
      collaboratorId: "1",
      clientId: "1",
      description: "Llamar a cliente",
      hours: 2,
      type: 1,
      state: 1,
      periodicity: 0,
      completed: false,
      personName: "Juan Perez",
      startDate: new Date(),
      endDate: new Date(),
      pricePerHour: 100,
      quotedHours: 10,
      clientName: "Caso 001",
      collaboratorName: "Juan Perez",
      expedientName: "Juan Perez",
    }
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.populateTabs();
  }

  openDialogNewTask(){
    this.dialog.open(DialogNewTaskComponent);
  }

  openDialogNewReason(){
    this.dialog.open(DialogNewReasonComponent);
  }

  onTabChange(event: number) {
    this.currentTab = event;
  }

  populateTabs() {
    this.tabs.forEach((tab) => {
      if (tab.value == 0) {
        tab.badge = this.tasks.length;
        return;
      }

      tab.badge = this.tasks.filter((task) => {
        return task.state == tab.value;
      }).length;
    });
  }

  get _tasks(): Tasks[] {
    let tab = this.tabs[this.currentTab];

    return this.currentTab == 0 
    ? this.tasks
    : this.tasks.filter((task) => {
      return task.state == tab?.value;
    })
  }
}
