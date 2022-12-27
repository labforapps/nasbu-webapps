import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-dialog-recovery',
  templateUrl: './dialog-recovery.component.html',
  styleUrls: ['./dialog-recovery.component.scss']
})
export class DialogRecoveryComponent implements OnInit {

  public recoverPasswordForm!: FormGroup;
  public errorMessage: string = '';
  public pageStep: number = 1; // 1-email 2-loading 3-emailSent 4-error

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.recoverPasswordForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
    });
  }

  onSendForgotPassword(): void {
    this.pageStep = 2;
    this.authService
      .forgotPassword(this.recoverPasswordForm.value.username)
      .subscribe(() => {
        this.pageStep = 3;
      }, (error) => {
        this.pageStep = 4;
        this.errorMessage = error.name;
      });
  }

  tryAnotherEmail(): void {
    this.pageStep = 1;
    this.recoverPasswordForm.reset();
  }

}
