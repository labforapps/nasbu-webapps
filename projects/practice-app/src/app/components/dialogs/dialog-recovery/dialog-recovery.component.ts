import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-recovery',
  templateUrl: './dialog-recovery.component.html',
  styleUrls: ['./dialog-recovery.component.scss']
})
export class DialogRecoveryComponent implements OnInit {

  constructor() { }

  // Demostration porpuse

  showRecoveryPassword: boolean = true ;
  showSendEmail: boolean = false ;
  showDoneMessage: boolean = false ;


  toggleRecovery(){
    this.showRecoveryPassword = ! this.showRecoveryPassword;
    this.showSendEmail = ! this.showSendEmail;
  }
  toggleEmail(){
    this.showSendEmail = ! this.showSendEmail;
    this.showDoneMessage = ! this.showDoneMessage;
  }

  ngOnInit(): void {
  }

}
