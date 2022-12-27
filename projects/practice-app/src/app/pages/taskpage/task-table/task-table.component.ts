import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../../components/dialogs/dialog-new-task/dialog-new-task.component';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogChargedHoursComponent } from '../../../components/dialogs/dialog-charged-hours/dialog-charged-hours.component';
import Swal from 'sweetalert2';
import { Tasks } from 'core-models';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent  implements OnInit, OnChanges {
  @Input() tasks: Tasks[] = [];

  images:any = {
    1: 'phone',
    2: 'calendar-pending',
    3: 'chat',
    4: 'phone-danger',
  }
  
  displayedColumns: string[] = ['select', 'type','rason', 'client', 'expedient', 'hours', 'date', 'action'];
  dataSource = new MatTableDataSource<Tasks>(this.tasks);
  selection = new SelectionModel<Tasks>(true, []);
  selectedTask!: Tasks;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<Tasks>(this.tasks);
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

  openDialogChargedHours(task?:Tasks){
    this.dialog.open(DialogChargedHoursComponent, {
      data: task ?? this.selectedTask
    });
  }

  openDialogNewTask(task?:Tasks, action:string = "new"){
    this.dialog.open(DialogNewTaskComponent, {
      data: {
        task: task,
        action: action
      },
    });
  }

  openAlertDelete(){
    Swal.fire({
      title: '¿Deseas eliminar este elemento?',
      text: 'Esta acción no se podrá revertir',
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText:'Cerrar ventana',
      customClass:{
        popup: 'c-alert c-alert--delete'
      }
    })
  }

  changeCompleteState(_task:Tasks){
    let task = this.tasks.find(t => t.uuid === _task.uuid)
    
    task 
    ? task.completed = !task.completed 
    : null;
  }

  selectTask(task:Tasks){
    this.selectedTask = task;
  }
}
