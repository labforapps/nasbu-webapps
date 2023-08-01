import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../../../components/dialogs/dialog-new-task/dialog-new-task.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogChargedHoursComponent } from '../../../../components/dialogs/dialog-charged-hours/dialog-charged-hours.component';
import { MatPaginator } from '@angular/material/paginator';
import { Task, TaskTypeEnum, TaskTypeiIconClassMap,TaskStatus,PriorityTask, modules, Customer, SecurityUser, CaseFile } from 'core-models';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';
import { PracticeService } from 'core-services';
import { DialogCloseTaskComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-close-task/dialog-close-task.component';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent  implements OnChanges {

  @Input() tasks: Task[] = [];
  @Input() module!:modules;
  @Input() customer!:Customer;
  @Input() securityUser!:SecurityUser;
  @Input() caseFile!:CaseFile;

  moduleEnum = modules;
  taskStatus = TaskStatus;
  displayedColumns: string[] = ['select', 'type','rason', 'client', 'expedient', 'hours','creationDate', 'date', 'action'];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  selection = new SelectionModel<Task>(true, []);
  selectedTask!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  taskTypeEnum = TaskTypeEnum;

  constructor(public dialog: MatDialog,
              private helperService:HelpersService,
              private practiceService:PracticeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] && changes['tasks'].currentValue) {
      this.dataSource.data = this.tasks;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  returnTaskTypeIcon(taskType:string){
    return TaskTypeiIconClassMap.get(taskType) || '';
  }

  openDialogChargedHours(task?:Task){
    this.dialog.open(DialogChargedHoursComponent, {
      data: task ?? this.selectedTask
    });
  }

  openDialogNewTask(task?:Task, action:string = "new"){
    const dialogRef = this.dialog.open(DialogNewTaskComponent, {
      data: {
        task: task,
        action: action,
        customer: this.customer,
        securityUser: this.securityUser,
        caseFile: this.caseFile
      },
    });

    dialogRef.afterClosed().subscribe((result:Task) => {

      if(result && result.uuid){
        const caseFileFiltered = this.tasks.filter(x => x.uuid === result.uuid);
        if(caseFileFiltered){
          this.tasks = this.tasks.filter(x => x.uuid !== result.uuid);
          this.tasks.push(result);
          this.dataSource.data = this.tasks;
        }
        else{
          this.tasks.push(result);
          this.dataSource.data = this.tasks;
        }
      }
    });
  }

  openDialogCloseTask(task:Task){
   this.dialog.open(DialogCloseTaskComponent,{
    data: {
      task
    }
   });
  }


  openAlertDelete(task:Task){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.practiceService.deleteTask(task.subscription,task.uuid || '').subscribe(data => {
          this.helperService.showMessageDeleted();
          this.tasks = this.tasks.filter(x => x.uuid !== task.uuid);
          this.dataSource.data = this.tasks;
        })
      }
    })
  }

  selectTask(task:any){
    this.selectedTask = task;
  }

  onFilter(filter:{status?: TaskStatus | null,priority?: PriorityTask | null, assigned_to: null,type: null}){
    let keys = Object.keys(filter);

    if(!keys.length){
      this.dataSource.data = this.tasks;
      return;
    }

    if(filter.priority) this.dataSource.data = this.tasks.filter(x => x.priority === filter.priority);
    if(filter.status === this.taskStatus.OPEN) this.dataSource.data = this.tasks.filter(x => x.status === this.taskStatus.OPEN);
    if(filter.status === this.taskStatus.CLOSED) this.dataSource.data = this.tasks.filter(x => x.status === this.taskStatus.CLOSED);
    if(filter.status === this.taskStatus.OVERDUE) this.dataSource.data = this.tasks.filter(x => x.end_date && new Date(x.end_date) <= new Date());

    if(filter.assigned_to) this.dataSource.data = this.tasks.filter(x => x.assigned_to.uuid === filter.assigned_to);
    if(filter.type) this.dataSource.data = this.tasks.filter(x => x.type === filter.type)

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
}
