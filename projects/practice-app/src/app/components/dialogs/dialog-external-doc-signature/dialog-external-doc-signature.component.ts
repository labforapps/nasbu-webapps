import { Component, OnInit } from '@angular/core';
import { AuthService, PracticeService } from 'core-services';
import { SignatureRequest } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-external-doc-signature',
  templateUrl: './dialog-external-doc-signature.component.html',
  styleUrls: ['./dialog-external-doc-signature.component.scss']
})
export class DialogExternalDocSignatureComponent implements OnInit {

  selectedSubscription!: any;
  sendingMethod: string = 'email';
  formSubmitted: boolean = false;
  emailField: string = '';
  phoneNumberField: string = '';

  signatureRequest!: SignatureRequest;

  constructor(
    private authService: AuthService,
    private practiceService:PracticeService,
    private helperService:HelpersService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.signatureRequest = {
      subscription: this.selectedSubscription?.ssid.uuid,
      gen_document: '',
      esig_signers_list: '',
      subject: '',
      message: '',
      send_by: this.sendingMethod,
      to_origin_value: '',
    };
  }

  onChangeSendingMethod(event: any) {
    this.sendingMethod = event.value;
  }

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
  }

  validateFields(): boolean {
    let result = true;
    this.formSubmitted = true;

    this.signatureRequest.to_origin_value = this.sendingMethod === 'email' ? this.emailField : this.phoneNumberField;

    if (this.signatureRequest.to_origin_value === '') result = false;

    return result;
  }

  sendCustomerIntakeRequest() {
    const formValidated = this.validateFields();

    this.signatureRequest.send_by = this.sendingMethod;

    if (!formValidated) {
      this.helperService.showMessageRequiredFields()
      return;
    }

    this.practiceService.createSignatureRequest(this.signatureRequest).subscribe({

      next: (data) => {
        this.helperService.showCustomMessage("Ok","Documento Enviado para Firma","Documento Enviado exitosamente")
      },
      error: (error) => {
        this.helperService.showCustomMessage("Error","El documento no pudo ser enviado","Error al enviar")
      }

    })


  }



}
