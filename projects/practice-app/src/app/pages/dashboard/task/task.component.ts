import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Task, TaskStatus, TaskTypeIconSVG } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../../components/dialogs/dialog-new-task/dialog-new-task.component';
import { PracticeService } from 'core-services';
import * as moment from 'moment';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {

  totalTasks!:number;
  @Input() tasks!:Task[];
  taskStatus = TaskStatus;
  displayedColumns: string[] = ['select', 'type','task', 'status', 'expedient', 'date','created_by', 'action'];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  selection = new SelectionModel<Task>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() onExecuteTask = new EventEmitter<any>();

  constructor(private dialog:MatDialog,
              private practiceService:PracticeService,
              private helperService:HelpersService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] && changes['tasks'].currentValue) {
      this.dataSource.data = this.tasks;
    }
  }

  ngOnInit(): void {
    this.dataSource.data = this.tasks;
    this.totalTasks = this.tasks.length

  }

  openDialogTask(task:Task){
    const dialogRef = this.dialog.open(DialogNewTaskComponent, {
      data: {
        task: task
      },
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.onExecuteTask.emit()
      }
    })
  }

  completeTask(task:Task){

    task.status = this.taskStatus.CLOSED

    this.practiceService.completeTask(task).subscribe(data => {

      this.helperService.showCustomMessage("Ok","Ok","Tarea completada exitosamente")
      this.tasks = this.tasks.filter(x => x.uuid !== task.uuid)
      this.dataSource.data = this.tasks;

    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  returnTaskTypeIconSVG(taskType:string){
    return TaskTypeIconSVG.get(taskType) || '';
  }

  isCompletedTask(task:Task){
    return task.status === this.taskStatus.CLOSED;
  }

  isPendingTask(task:Task){
    return task.status === this.taskStatus.OPEN;
  }

  isOverdueTask(task:Task){
    return task.overdue === true;
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
