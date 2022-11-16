import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogRecoveryComponent } from '../../components/dialogs/dialog-recovery/dialog-recovery.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signinForm!: FormGroup;
  errorMessage!: string;
  currentFocus: string = 'username';

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private router: Router) { }

  openDialogRecovery(){
    const dialogRef = this.dialog.open(DialogRecoveryComponent);
    dialogRef.afterClosed()
               .subscribe((username: string) => {
                      if (username) {
                          this.forgotPassword(username);
                      }
               });
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
          .signIn(username, password)
          .subscribe((response) => {
                console.log('Signin response: ', response);
                this.router.navigate(['/dashboard']);
          }, (error) => {
                console.log('Error: ', error);
                this.errorMessage = 'Invalid username or password';
          })
  }

  changeFocus(focusField: string) {
      this.currentFocus = focusField;
  }

  gotoSignup() {
      this.router.navigate(['/signup']);
  }

  forgotPassword(username: string) {
      this.authService
          .forgotPassword(username)
          .subscribe(() => {
              console.log('Forgot password sent...');
          }, (error) => {
              console.log('Error: ', error);
          });
  }

}
