import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';


import { DialogRecoveryComponent } from './dialogs/dialog-recovery/dialog-recovery.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './layout/menu/menu.component';
import { DialogNewTaskComponent } from './dialogs/dialog-new-task/dialog-new-task.component';
import { DialogAddRoleComponent } from './dialogs/dialog-add-role/dialog-add-role.component';
import { DialogNewDocumentComponent } from './dialogs/dialog-new-document/dialog-new-document.component';
import { DialogNewTemplateComponent } from './dialogs/dialog-new-template/dialog-new-template.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { DialogChargedHoursComponent } from './dialogs/dialog-charged-hours/dialog-charged-hours.component';
import { DialogNewExpedientComponent } from './dialogs/dialog-new-expedient/dialog-new-expedient.component';
import { DialogAddCreditcardComponent } from './dialogs/dialog-add-creditcard/dialog-add-creditcard.component';
import { DialogUploadComponent } from './dialogs/dialog-upload/dialog-upload.component';
import { DialogNewNoteComponent } from './dialogs/dialog-new-note/dialog-new-note.component';
import { DialogNewExpedientTaskComponent } from './dialogs/dialog-new-expedient-task/dialog-new-expedient-task.component';
import { DialogPaymentRegisterComponent } from './dialogs/dialog-payment-register/dialog-payment-register.component';
import { DialogAddBalanceComponent } from './dialogs/dialog-add-balance/dialog-add-balance.component';
import { DialogSendRegisterComponent } from './dialogs/dialog-send-register/dialog-send-register.component';
import { DialogNewCostumerComponent } from './dialogs/dialog-new-costumer/dialog-new-costumer.component';
import { DialogListComponent } from './dialogs/dialog-list/dialog-list.component';
import { DialogNewRoleComponent } from './dialogs/dialog-new-role/dialog-new-role.component';
import { DialogNewReasonComponent } from './dialogs/dialog-new-reason/dialog-new-reason.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { DialogPaymentHistoryComponent } from './dialogs/dialog-payment-history/dialog-payment-history.component';
import { DialogIntakeComponent } from './dialogs/dialog-intake/dialog-intake.component';
import { DialogSendInvoiceComponent } from './dialogs/dialog-send-invoice/dialog-send-invoice.component';
import { DialogReSendRegisterComponent } from './dialogs/dialog-re-send-register-email/dialog-re-send-register.component';
import { RouterModule } from '@angular/router';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { DialogUsersShareExpedientComponent } from './dialogs/dialog-users-share-expedient/dialog-users-share-expedient.component';


@NgModule({
  declarations: [
    HeaderComponent,
    DialogRecoveryComponent,
    LayoutComponent,
    MenuComponent,
    DialogNewTaskComponent,
    DialogAddRoleComponent,
    DialogAddCreditcardComponent,
    DialogNewDocumentComponent,
    DialogNewTemplateComponent,
    DocumentViewerComponent,
    DialogChargedHoursComponent,
    DialogNewExpedientComponent,
    DialogUploadComponent,
    DialogNewNoteComponent,
    DialogNewExpedientTaskComponent,
    DialogPaymentRegisterComponent,
    DialogAddBalanceComponent,
    DialogNewRoleComponent,
    DialogNewReasonComponent,
    DialogPaymentHistoryComponent,
    OnboardingComponent,
    DialogSendRegisterComponent,
    DialogNewCostumerComponent,
    DialogListComponent,
    DialogIntakeComponent,
    DialogSendInvoiceComponent,
    DialogReSendRegisterComponent,
    UploadImageComponent,
    DialogUsersShareExpedientComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    FilePickerModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    NgxPermissionsModule
  ],
  exports: [
    HeaderComponent,
    UploadImageComponent
  ]
})
export class ComponentsModule { }
