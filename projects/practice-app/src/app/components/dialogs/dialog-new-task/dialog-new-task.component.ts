import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, Customer, SecurityUser, CaseFile, BillingType,TaskType, PriorityTask, TaskPayload, TaskTypeEnum } from 'core-models';
import { AuthService, CommonService, CustomersService, PracticeService, SecurityService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-dialog-new-task',
  templateUrl: './dialog-new-task.component.html',
  styleUrls: ['./dialog-new-task.component.scss']
})
export class DialogNewTaskComponent implements OnInit {

  selectedSubscription!:any;
  taskForm!:FormGroup;
  showDate:boolean = false;
  task!:Task;
  customers!:Customer[];
  securityUsers!:SecurityUser[];
  caseFiles!:CaseFile[];
  billingType = BillingType;
  taskTypes!:TaskType[];
  priorityTask = PriorityTask

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: {task:Task, action: string,taskType:TaskType,customer:Customer,securityUser:SecurityUser,caseFile:CaseFile},
              public  dialogRef: MatDialogRef<DialogNewTaskComponent>,
              private formBuilder:FormBuilder,
              private customerService:CustomersService,
              private securityService:SecurityService,
              private practiceService:PracticeService,
              private authService:AuthService,
              private helperService:HelpersService,
              private commonService:CommonService) {
  }

  ngOnInit(): void {

    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.initForm();
    this.getCustomers();
    this.getSecurityUsers();
    this.getCaseFiles();
    this.getTaskTypes();
    this.setForm();
  }

  initForm(){

      this.taskForm = this.formBuilder.group({
          type: ['',Validators.required],
          priority: [this.priorityTask.Low,Validators.required],
          customer: ['',Validators.required],
          case_file: ['',Validators.required],
          description: ['',Validators.required],
          assigned_to: ['',Validators.required],
          has_due_date: [false],
          price_per_increment: [0],
          flat_fee_amt: [0],
          start_date:[null],
          end_date: [null],
          billing_type: [''],
          bt_price_per_hour: [0],
          bt_increment_factor:[''],
          bt_amt: [0],
          hourly_rate: [false],
          increment_of_time: [false],
          flat_fee:[false],
          not_billable: [false]
    });

  }

  setForm(){
    if(this.dataDialog && this.dataDialog.task){

      this.task = this.dataDialog.task;

      this.taskForm.patchValue({
        ...this.task,
        type: this.task.type.uuid,
        case_file: this.task.case_file.uuid,
        customer: this.task.customer.uuid,
        assigned_to: this.task.assigned_to.uuid,
        hourly_rate: this.task.billing_type === this.billingType.PER_HOUR,
        increment_of_time: this.task.billing_type === this.billingType.BY_TIME_INCREMENT,
        flat_fee: this.task.billing_type === this.billingType.FLAT_FEE,
        flat_fee_amt: this.task.billing_type === this.billingType.FLAT_FEE ? this.task.bt_amt : 0,
        price_per_increment: this.task.billing_type === this.billingType.BY_TIME_INCREMENT ? this.task.bt_amt : 0
      })

      this.showDate = this.task.has_due_date;
    }
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe((data:Customer[]) => {
      this.customers = data;
      if(this.dataDialog && this.dataDialog.customer) this.taskForm.patchValue({customer: this.dataDialog.customer.uuid})
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe((data:SecurityUser[]) => {
      this.securityUsers = data;
      if(this.dataDialog && this.dataDialog.securityUser) this.taskForm.patchValue({assigned_to: this.dataDialog.securityUser.uuid})
    });
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe((data:CaseFile[]) => {
      this.caseFiles = data;
      if(this.dataDialog && this.dataDialog.caseFile) this.taskForm.patchValue({case_file: this.dataDialog.caseFile.uuid})
    })
  }

  getTaskTypes(){
    this.commonService.getTaskTypes().subscribe((data:TaskType[]) => {
      this.taskTypes = data;
      if(this.dataDialog && this.dataDialog.taskType) this.taskForm.patchValue({type: this.dataDialog.taskType.uuid})
    })
  }

  dateRadioChange(event: any){
    this.showDate = event.value;
  }

  onChangeCaseFile(uuid:string){
    const caseFileSelected: CaseFile | undefined  = this.caseFiles.find(x => x.uuid === uuid);

    this.taskForm.patchValue({
      hourly_rate: caseFileSelected?.billing_type === this.billingType.PER_HOUR,
      increment_of_time: caseFileSelected?.billing_type === this.billingType.BY_TIME_INCREMENT,
      flat_fee: caseFileSelected?.billing_type === this.billingType.FLAT_FEE,
      price_per_increment: caseFileSelected?.billing_type === this.billingType.BY_TIME_INCREMENT ? caseFileSelected.bt_amt : 0,
      billing_type: caseFileSelected?.billing_type,
      bt_price_per_hour: caseFileSelected?.bt_price_per_hour,
      bt_increment_factor: caseFileSelected?.bt_increment_factor,
      bt_amt: caseFileSelected?.bt_amt,
    })

  }

  onCheckBillingTypes(billingType:BillingType | null,value:MatCheckboxChange){
    if(billingType === this.billingType.PER_HOUR && value.checked) this.taskForm.patchValue({increment_of_time: false, flat_fee:false,not_billable: false})
    if(billingType === this.billingType.BY_TIME_INCREMENT && value.checked) this.taskForm.patchValue({hourly_rate: false, flat_fee:false,not_billable: false})
    if(billingType === this.billingType.FLAT_FEE && value.checked) this.taskForm.patchValue({hourly_rate: false, increment_of_time:false,not_billable: false})
    if(billingType === null && value.checked) this.taskForm.patchValue({hourly_rate: false, increment_of_time:false, flat_fee:false})
  }


  submitForm(){

    const taskFormValue = this.taskForm.value;

    if(!this.taskForm.valid){
      this.helperService.showMessageRequiredFields();
      return;
    }

    if(!taskFormValue.hourly_rate && !taskFormValue.increment_of_time && !taskFormValue.flat_fee && !taskFormValue.not_billable){
      this.helperService.showCustomMessage('Error','Error','Debes elegir algun metodo de facturacion');
      return;
    }

    if(taskFormValue.has_due_date && (taskFormValue.start_date === null || taskFormValue.end_date === null)){
      this.helperService.showCustomMessage('Error','Error','Debes definir fin e inicio de la tarea');
      return;
    }

    let billingType!:BillingType;
    let billingTypeAmount = 0;

    if(taskFormValue.hourly_rate){
      billingType = this.billingType.PER_HOUR;
      billingTypeAmount = taskFormValue.bt_price_per_hour
    }

    if(taskFormValue.increment_of_time){
      billingType = this.billingType.BY_TIME_INCREMENT;
      billingTypeAmount = taskFormValue.price_per_increment
    }

    if(taskFormValue.flat_fee){
      billingType = this.billingType.FLAT_FEE;
      billingTypeAmount = taskFormValue.flat_fee_amt
    }

    const taskPayload: TaskPayload = {
      subscription: this.selectedSubscription?.ssid.uuid,
      ...taskFormValue,
      billing_type: billingType,
      bt_amt: billingTypeAmount,
      name: taskFormValue.description,
    };

    if(this.task) taskPayload.uuid = this.task.uuid;

    this.practiceService.saveTask(taskPayload).subscribe((data:Task) => {
      if(taskPayload.uuid){
        this.helperService.showMessageUpdated();
      }
      else{
        this.helperService.showMessageCreated();
      }

      this.dialogRef.close(data);

    },(error) => {
      this.helperService.showCustomMessage('Error','Error','Ha ocurrido un error');
    })


  }

}
