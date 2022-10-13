import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'projects/core-services/src/public-api';
import { DialogRecoveryComponent } from '../../components/dialogs/dialog-recovery/dialog-recovery.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signinForm!: FormGroup;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private router: Router) { }

  openDialogRecovery(){
    this.dialog.open(DialogRecoveryComponent);
  }

  ngOnInit(): void {
      this.signinForm = new FormGroup({
          username: new FormControl(null, Validators.required),
          password: new FormControl(null, Validators.required)
      });
  }

  signIn() {
      const username: string = this.signinForm.value.username;
      const password: string = this.signinForm.value.password;
      this.authService
          .signin(username, password)
          .subscribe((response) => {
                console.log('Signin response: ', response);
                this.router.navigate(['/dashboard']);
          }, (error) => {
                console.log('Error: ', error);
          })
  }

  gotoSignup() {
      this.router.navigate(['/signup']);
  }

}
