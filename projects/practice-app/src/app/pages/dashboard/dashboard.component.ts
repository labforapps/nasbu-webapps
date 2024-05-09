import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewCostumerComponent } from '../../components/dialogs/dialog-new-costumer/dialog-new-costumer.component';
import { AccountingService, PracticeService, SecurityService } from 'core-services';
import { Invoice, Payment, TaskStatus,Task, CaseFileNote, Summary } from 'core-models';
import { DialogNewTaskComponent } from '../../components/dialogs/dialog-new-task/dialog-new-task.component';
import { DialogAddHoursComponent } from '../../components/dialogs/dialog-add-hours/dialog-add-hours.component';
import { DialogNewDocumentComponent } from '../../components/dialogs/dialog-new-document/dialog-new-document.component';
import { DialogNewNoteComponent } from '../../components/dialogs/dialog-new-note/dialog-new-note.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public userName!: string;
  public today: Date;

  selectedSubscription!:any;
  invoices!:Invoice[];
  payments!:Payment[];
  tasks!:Task[];
  taskStatus = TaskStatus;
  caseFileNotes!:CaseFileNote[];
  accountSummary:Summary[] = []

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private authService:AuthService,
              private practiceService:PracticeService,
              private accountingService:AccountingService,
              private securityService:SecurityService,
              private router:Router) {
    this.today = new Date();
  }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.userName = this.route.snapshot.data['user']['attributes']['name'];

    this.getAccountSummary()
    this.getInvoicesLatestPending();
    this.getTasksLatestsOverdue();
    this.getCaseFileNotes();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  getAccountSummary(){
    this.securityService.getAccountSummary(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data) => {
        this.accountSummary = data
      }
    })
  }

  getInvoicesLatestPending(){
    this.accountingService.getInvoicesLatestPending(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.invoices = data;
    })
  }

  getTasksLatestsOverdue(){
    this.practiceService.getTasksLatestsOverdue(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.tasks = data;
    })
  }

  getCaseFileNotes(){
    this.practiceService.getCaseFileNotesLatest(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFileNotes = data;
    })
  }

  openDialogNewCostumer() {
    this.dialog.open(DialogNewCostumerComponent);
  }

  openDialogNewTask(){
    this.dialog.open(DialogNewTaskComponent)
  }

  navigateToCreateCollaborator(){
    this.router.navigate(['/user/create'])
  }

  openDialogAddHours(){
    this.dialog.open(DialogAddHoursComponent);
  }

  openDialogGenerateDocument(){
    this.dialog.open(DialogNewDocumentComponent)
  }

  navigateToNewInvoice(){
    this.router.navigate(['/invoicing/new-invoice'])
  }

  openDialogNewNote(){
    this.dialog.open(DialogNewNoteComponent, {
      data: {
        subscription: this.selectedSubscription?.ssid.uuid
      }
    })
  }

}
