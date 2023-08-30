import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DocumentTemplate, DocumentTemplatePayload, DocumentTemplateType } from 'core-models';
import { AuthService, CoreService, PracticeService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-new-template',
  templateUrl: './dialog-new-template.component.html',
  styleUrls: ['./dialog-new-template.component.scss']
})
export class DialogNewTemplateComponent implements OnInit {

  templateForm!:FormGroup;
  documentTemplateTypes!:DocumentTemplateType[];
  documentTemplateType!:DocumentTemplateType | undefined;
  imgTemp!:any;
  imgUrl!:any;
  imagenSubir!:File;
  selectedSubscription!:any;
  documentTemplate!:DocumentTemplate;


  constructor(private formBuilder:FormBuilder,
              private coreServices:CoreService,
              private practiceService:PracticeService,
              private authService:AuthService,
              private helperService:HelpersService,
              public dialogRef: MatDialogRef<DialogNewTemplateComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: {template:DocumentTemplate}) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.getDocumentTemplateTypes();
    this.setForm();
  }

  initForm(){
    this.templateForm = this.formBuilder.group({
      template_type: ['',Validators.required],
      name: ['',Validators.required]
    })
  }

  setForm(){
    if(this.dataDialog && this.dataDialog.template){

      this.documentTemplate = this.dataDialog.template;

      this.templateForm.patchValue({
        ...this.documentTemplate
      })

      this.documentTemplateType = this.documentTemplateTypes.find(x => x.uuid === this.documentTemplate.template_type);
    }
  }

  getDocumentTemplateTypes(){
    this.coreServices.getDocumentTemplateTypes().subscribe(data => {
      this.documentTemplateTypes = data;
      this.setForm();
    })
  }

  onChangeDocumentTemplateType(selection:MatSelectChange){
    this.documentTemplateType = this.documentTemplateTypes.find(x => x.uuid === selection.value);
  }

  changeImage(event: any) {
    const file = event.target.files[0];

    if (file) {
      const validTypes = [
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!validTypes.includes(file.type)) {
          this.helperService.showCustomMessage('Error','Error','Por favor, sube un documento Word válido.')
          event.target.value = ''; // Resetear la selección del archivo
          return;
      }
  }

    this.imagenSubir = file;

    if (!file) return (this.imgTemp = null);

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

    return this.imgTemp;
  }

  copyToClipboard(value: string): void {
    const el = document.createElement('textarea');
    el.value = `{${value}}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.helperService.showCustomMessage('Ok','Ok','Variable Copiada');
  }

  submitForm(){

    if(!this.templateForm.valid || !this.imagenSubir){
      this.helperService.showMessageRequiredFields();
      return;
    }

    const templatePayload:DocumentTemplatePayload = {
      ...this.templateForm.value,
      subscription:this.selectedSubscription?.ssid.uuid,
      file:this.imagenSubir
    }

    if(this.documentTemplate) templatePayload.uuid = this.documentTemplate.uuid;

    this.practiceService.saveDocumentTemplate(templatePayload).subscribe(data => {
      if(templatePayload.uuid){
        this.helperService.showMessageUpdated();
      }
      else{
        this.helperService.showMessageCreated();
      }

      this.dialogRef.close(data);

    })

  }

}
