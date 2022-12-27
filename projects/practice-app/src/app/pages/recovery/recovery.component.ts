import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit, OnDestroy {
  public formSubscription!: Subscription;
  public recoveryForm!: FormGroup;
  public matchMessage: string = '';
  public passwordMatchMsg: string = '';
  public passwordDontMatchMsg: string = '';
  constructor(private fb: FormBuilder, private translate: TranslateService) { }

  ngOnInit(): void {
    this.buildForm();
    this.formChange();
    this.loadTranslatedWords();
  }

  buildForm(): void {
    this.recoveryForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  get passwordMatch(): boolean{
   return this.matchMessage === this.passwordMatchMsg;
  }

  formChange(): void {
    this.formSubscription = this.recoveryForm.valueChanges.subscribe(({ password, confirmPassword }) => {
      if(!password && !confirmPassword) {
        this.matchMessage = this.passwordDontMatchMsg;
        return;
      }
      this.matchMessage = (password === confirmPassword) ? this.passwordMatchMsg : this.passwordDontMatchMsg;
    });
  }

  onRecovery(): void {
    if (this.recoveryForm.invalid) return;

  }

  loadTranslatedWords(): void {
    this.translate.get(
      ['recovery.passwordsMatch', 'errorMessages.passwordsDoNotMatch'],)
      .pipe(take(1)).subscribe((res: any) => {
        this.passwordMatchMsg = res['recovery.passwordsMatch'];
        this.passwordDontMatchMsg = res['errorMessages.passwordsDoNotMatch'];
      });
  }
  
  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }
}
