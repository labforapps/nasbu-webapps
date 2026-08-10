import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../../../components/dialogs/dialog-new-task/dialog-new-task.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogChargedHoursComponent } from '../../../../components/dialogs/dialog-charged-hours/dialog-charged-hours.component';
import { MatPaginator } from '@angular/material/paginator';
import { Task, TaskTypeEnum, TaskTypeiIconClassMap,TaskStatus,PriorityTask, modules, Customer, SecurityUser, CaseFile, BillingType, Action, SortingTaskFilter } from 'core-models';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';
import { PracticeService } from 'core-services';
import { TaskTypeIconSVG } from 'projects/core-models/src/public-api';
import * as moment from 'moment';

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
  @Input() taskStatusInput:TaskStatus = TaskStatus.ALL
  @Output() onExecuteTask = new EventEmitter<any>();
  moduleEnum = modules;
  taskStatus = TaskStatus;
  displayedColumns: string[] = ['select', 'type','rason', 'client', 'expedient','priority', 'billing_type','hours','total','creationDate', 'date', 'action'];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  selection = new SelectionModel<Task>(true, []);
  selectedTask!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  taskTypeEnum = TaskTypeEnum;
  public taskPriority = PriorityTask;
  billingType = BillingType
  actionEnum = Action
  sortingTaskFilter = SortingTaskFilter

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

  onExecuteTaskEvent(){
    this.onExecuteTask.emit({})
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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

  returnTaskTypeIcon(taskType:string){
    return TaskTypeiIconClassMap.get(taskType) || '';
  }

  returnTaskTypeIconSVG(taskType:string){
    return TaskTypeIconSVG.get(taskType) || '';
  }

  openDialogChargedHours(task?:Task){
    const dialogRef = this.dialog.open(DialogChargedHoursComponent, {
      data: task ?? this.selectedTask
    });

    dialogRef.afterClosed().subscribe((result:Task) => {
      this.onExecuteTask.emit({})
    });

  }

  openDialogNewTask(task?:Task, action:Action = this.actionEnum.CREATE){
    const dialogRef = this.dialog.open(DialogNewTaskComponent, {
      data: {
        task: task,
        action: action,
        // Los valores del contexto (expediente, cliente, colaborador) son defaults para
        // crear. Al editar o ver manda la tarea, si no pisan sus datos reales.
        customer: task?.customer || this.caseFile?.customer || this.customer,
        securityUser: task ? undefined : (this.securityUser || this.caseFile?.assigned_to),
        caseFile: task ? undefined : this.caseFile
      },
    });

    dialogRef.afterClosed().subscribe((result:Task) => {

      if(result && result.uuid){
        const caseFileFiltered = this.tasks.filter(x => x.uuid === result.uuid);
        if(caseFileFiltered){
          this.tasks = this.tasks.filter(x => x.uuid !== result.uuid);
          this.tasks.push(result);
          this.dataSource.data = this.helperService.sortByDate(this.tasks,'created_at','desc');
        }
        else{
          this.tasks.push(result);
          this.dataSource.data = this.helperService.sortByDate(this.tasks,'created_at','desc');
        }
        this.onExecuteTaskEvent();
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
          this.onExecuteTaskEvent();
        })
      }
    })
  }

  selectTask(task:any){
    this.selectedTask = task;
  }

  onFilter(filter:{status?: TaskStatus | null,priority?: PriorityTask | null, assigned_to: null,type: null, sorting_filter: SortingTaskFilter}){
    let keys = Object.keys(filter);

    if(!keys.length){
      this.dataSource.data = this.tasks;
      return;
    }

    let filteredTasks: Task[] = this.tasks;

    if(filter.priority) filteredTasks = filteredTasks.filter(x => x.priority === filter.priority);
    if(filter.status === this.taskStatus.OPEN) filteredTasks = filteredTasks.filter(x => x.status === this.taskStatus.OPEN && x.overdue === false);
    if(filter.status === this.taskStatus.CLOSED) filteredTasks = filteredTasks.filter(x => x.status === this.taskStatus.CLOSED);
    if(filter.status === this.taskStatus.OVERDUE) filteredTasks = filteredTasks.filter(x => x.overdue === true);

    if(filter.assigned_to) filteredTasks = filteredTasks.filter(x => x.assigned_to.uuid === filter.assigned_to);
    if(filter.type) filteredTasks = filteredTasks.filter(x => x.type.uuid === filter.type)

    if(filter.sorting_filter){

      switch (filter.sorting_filter) {
        case this.sortingTaskFilter.NEXT_TO_DUE:
          filteredTasks =  this.tasks.filter(task => task.status === this.taskStatus.OPEN && task.overdue === false && task.end_date && new Date(task.end_date) >= new Date())
          .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime());
          break;
        case this.sortingTaskFilter.CREATED_DATE:
          filteredTasks = this.tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case this.sortingTaskFilter.DUE_DATE:
          const expiredTasks = this.tasks.filter(task => task.status === this.taskStatus.OPEN  && task.end_date && new Date(task.end_date) < new Date());
          const dueSoonTasks = this.tasks.filter(task => task.status === this.taskStatus.OPEN  && task.end_date && new Date(task.end_date) >= new Date());
          const closedTasks = this.tasks.filter(task => task.status !== this.taskStatus.OPEN );

          filteredTasks = [
            ...expiredTasks.sort((a, b) => new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime()),
            ...dueSoonTasks.sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime()),
            ...closedTasks
          ];
          break;
      }

    }

    this.dataSource.data = filteredTasks;
  }

  completeTask(task:Task){

    let taskStatus = task.status

    if(task.status === this.taskStatus.OPEN)  taskStatus = this.taskStatus.CLOSED;
     else if(task.status === this.taskStatus.CLOSED) taskStatus = this.taskStatus.OPEN;


     this.practiceService.completeTask({...task, status: taskStatus}).subscribe({
      next: (data) => {
        task.status = taskStatus
        this.onExecuteTaskEvent()
      },
      error: (data) => {
        this.helperService.showCustomMessage('Error','No se puede descompletar tareas ya facturadas','Alerta')
      }
     });

  }

  getTotalTime(value:number){
    const total_minutes = Math.floor(value * 60)
    return this.helperService.getHoursAndMinutes(total_minutes)
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
