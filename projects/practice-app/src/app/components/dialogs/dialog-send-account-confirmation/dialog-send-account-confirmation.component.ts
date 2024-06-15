import { Component, Inject, OnInit } from '@angular/core';
import { HelpersService } from '../../../services/helpers.service';
import { AuthService } from '../../../services/auth/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-send-account-confirmation',
  templateUrl: './dialog-send-account-confirmation.component.html',
  styleUrls: ['./dialog-send-account-confirmation.component.scss']
})
export class DialogSendAccountConfirmationComponent implements OnInit {

  constructor(private helperService:HelpersService,
              private authService:AuthService,
              @Inject(MAT_DIALOG_DATA) private dataDialog: { username:string }
  ) { }

  ngOnInit(): void {
  }

  sendConfirmationEmail() {

    this.authService.resendSignupConfirmationEmail(this.dataDialog.username).subscribe({
      next: () => {
        this.helperService.showCustomMessage("Ok","Email de Confirmación Enviado","Proceso cumplido exitosamente")
      }
    })

  }

}
