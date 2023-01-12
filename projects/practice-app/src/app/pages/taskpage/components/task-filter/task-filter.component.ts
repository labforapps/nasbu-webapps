import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskType, TaskState } from 'core-models';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent {
  @Output() filter: EventEmitter<any> = new EventEmitter();
  filterForm:FormGroup;

  constructor() { 
    this.filterForm = this.setForm();
  }

  setForm() {
    return new FormGroup({
      state: new FormControl(''),
      priority: new FormControl(''),
      collaboratorId: new FormControl(''),
      type: new FormControl(''),
    });
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
    return TaskState;
  }

  get taskType(){
    return TaskType;
  }
}
