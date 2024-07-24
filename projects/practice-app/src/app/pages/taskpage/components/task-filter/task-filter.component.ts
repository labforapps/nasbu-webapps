import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskType, TaskStatus, PriorityTask,Task, AssignedTo, SortingTaskFilter } from 'core-models';
import { CommonService } from 'core-services';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent {

  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() tasks!:Task[];
  @Input() taskStatusInput:TaskStatus = TaskStatus.ALL
  filterForm:FormGroup;
  priorityTask = PriorityTask;
  securityUsers!:AssignedTo[];
  taskTypes!:TaskType[];
  sortingTaskFilter = SortingTaskFilter
  taskStatus = TaskStatus

  constructor(private commonService:CommonService) {
    this.filterForm = this.setForm();
  }

  ngOnInit(): void {
    this.getSecurityUsers();
    this.getTaskTypes();
  }

  setForm() {
    return new FormGroup({
      sorting_filter: new FormControl(''),
      status: new FormControl(''),
      priority: new FormControl(''),
      assigned_to: new FormControl(''),
      type: new FormControl(''),
    });
  }

  getSecurityUsers(){
    // this.securityService.getSecurityUsers(this.tasks[0].subscription).subscribe((data:SecurityUser[]) => {
    //   this.securityUsers = data;

      let uniqueSecurityUsers: { [uuid: string]: AssignedTo } = {};
      this.tasks.forEach(task => {
        let customer = task.assigned_to;
        if (customer && customer.uuid && !uniqueSecurityUsers[customer.uuid]) {
          uniqueSecurityUsers[customer.uuid] = customer;
      }
    });

      this.securityUsers = Object.values(uniqueSecurityUsers).sort((a, b) => {

        const nameA = a.user.first_name.toLowerCase();
        const nameB = b.user.first_name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });;


    // });
  }

  getTaskTypes(){
    this.commonService.getTaskTypes().subscribe((data:TaskType[]) => {
      this.taskTypes = data.sort((a, b) => {

        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });;
    })
  }

  cleanFilter(){
    this.filterForm.reset();
    this.filter.emit({})
  }

  applyFilter() {
    let obj = this.filterForm.value;
    for (const key in obj) {
      const element = obj[key];

      if(element === null || element === undefined || element === ''){
        delete obj[key];
      }
    }

    this.filter.emit(obj);
  }

  get taskState() {
    return TaskStatus;
  }
}
