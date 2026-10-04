import { Component, Inject, OnInit } from '@angular/core';
import { AuthService, CustomersService, PracticeService } from 'core-services';
import { Customer, DocumentGeneration, SendingMethod, SignatureRequest, TypeContact } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-external-doc-signature',
  templateUrl: './dialog-external-doc-signature.component.html',
  styleUrls: ['./dialog-external-doc-signature.component.scss']
})
export class DialogExternalDocSignatureComponent implements OnInit {

  selectedSubscription!: any;
  sendingMethod = SendingMethod;
  formSubmitted: boolean = false;
  emailField: string = '';
  phoneNumberField: string = '';
  signatureRequest!: SignatureRequest;
  customer!:Customer;
  typeContact = TypeContact;
  emails:string[] = []
  phones:string[] = []

  constructor(
    private authService: AuthService,
    private practiceService:PracticeService,
    private helperService:HelpersService,
    private dialogRef: MatDialogRef<DialogExternalDocSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: {document:DocumentGeneration},
    private customerService:CustomersService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.signatureRequest = {
      subscription: this.selectedSubscription?.ssid.uuid,
      gen_document: this.dataDialog.document.uuid,
      esig_signers_list: '',
      subject: 'Asunto',
      message: 'Mensaje',
      send_by: this.sendingMethod.EMAIL,
      to_origin_value: '',
    };

    this.getCustomerById()
  }

  getCustomerById(){

    this.customerService.getCustomerById(this.selectedSubscription?.ssid.uuid,this.dataDialog.document.customer).subscribe({
      next: (data) => {
        this.customer = data
      }
    })

  }

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
  }

  addEmail(event: MatCheckboxChange,email:string){
    if(event.checked){
      this.emails.push(email);
    }
    else{
      this.emails = this.emails.filter(x => x !== email);
    }
  }

  addPhone(event: MatCheckboxChange,phone:string){
    if(event.checked){
      this.phones.push(phone);
    }
    else{
      this.phones = this.phones.filter(x => x !== phone);
    }
  }


  validateFields(): boolean {
    let result = true;
    this.formSubmitted = true;

    const emails = this.emails.join(", ");
    const phones = this.phones.join(", ")

    let contactsClient:string = '';

    if(this.signatureRequest.send_by === this.sendingMethod.EMAIL || this.signatureRequest.send_by === this.sendingMethod.CLIPBOARD ) contactsClient = emails
    if(this.signatureRequest.send_by === this.sendingMethod.SMS) contactsClient = phones


    this.signatureRequest.to_origin_value = contactsClient

    if(this.signatureRequest.send_by === this.sendingMethod.EMAIL || this.signatureRequest.send_by === this.sendingMethod.CLIPBOARD ){
      this.signatureRequest.esig_signers_list = this.signatureRequest.to_origin_value;
    }

    if (this.signatureRequest.to_origin_value === '') result = false;

    return result;
  }

  /**
   * Si el plan no incluye firma el backend lo informa (NAS-061) y se muestra ese motivo en
   * lugar del error genérico. Con `code` en la respuesta el aviso ya lo muestra el
   * BlockedActionInterceptor (NAS-031), así que no se duplica.
   */
  handleSignatureError(error: any) {
    const body = error?.error || {};

    if (body.code) {
      return;
    }

    if ((error?.status === 403 || error?.status === 501) && body.detail) {
      this.helperService.showCustomMessage("Error", body.detail, "Firma no disponible");
      return;
    }

    this.helperService.showCustomMessage("Error","El documento no pudo ser enviado","Error al enviar")
  }

  sendCustomerIntakeRequest() {
    const formValidated = this.validateFields();

    if (!formValidated) {
      this.helperService.showMessageRequiredFields()
      return;
    }

    this.practiceService.createSignatureRequest(this.signatureRequest).subscribe({

      next: (data) => {

        if(this.signatureRequest.send_by === this.sendingMethod.CLIPBOARD){
          this.helperService.copyToClipboard(data.esignature_request_url || '')
          this.helperService.showCustomMessage("Ok","Ok","Link de documento para firma copiado ")
        }
        else{
          this.helperService.showCustomMessage("Ok","Documento Enviado para Firma","Documento Enviado exitosamente")
        }

        this.dialogRef.close({})

      },
      error: (error) => this.handleSignatureError(error)

    })


  }



}
