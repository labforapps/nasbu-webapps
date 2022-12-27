import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogRecoveryComponent } from '../../components/dialogs/dialog-recovery/dialog-recovery.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public formSubscription!: Subscription;
  public signinForm!: FormGroup;
  public errorMessage!: string;
  public currentFocus: string = 'username';

  constructor(public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.formChange();
  }

  buildForm(): void {
    this.signinForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  formChange(): void {
    this.formSubscription = this.signinForm.valueChanges.subscribe(() => this.errorMessage = '');
  }

  openDialogRecovery(): void {
    const dialogRef = this.dialog.open(DialogRecoveryComponent);
  }

  signIn(): void {
    const { username, password } = this.signinForm.value;
    this.authService
      .signIn(username, password)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      }, (error) => {
        console.log('Error: ', error);
        this.errorMessage = error.message;
      });
  }

  changeFocus(focusField: string): void {
    this.currentFocus = focusField;
  }

  gotoSignup(): void {
    this.router.navigate(['/signup']);
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

}
