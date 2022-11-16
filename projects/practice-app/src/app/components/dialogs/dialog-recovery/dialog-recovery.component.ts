import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-dialog-recovery',
  templateUrl: './dialog-recovery.component.html',
  styleUrls: ['./dialog-recovery.component.scss']
})
export class DialogRecoveryComponent implements OnInit {

  recoverPasswordForm!: FormGroup;


  constructor(private dialogRef: MatDialogRef<DialogRecoveryComponent>,
              private authService: AuthService) { }

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
      this.recoverPasswordForm = new FormGroup({
          username: new FormControl(null, [Validators.required, Validators.email])
      })
  }

  onSendForgotPassword() {
    this.authService
        .forgotPassword(this.recoverPasswordForm.value.username)
        .subscribe((response) => {
            console.log('Response: ', response);
            //this.dialogRef.close(null);
        }, (error) => {
            console.log('Error: ', error);
        })
  }

}
