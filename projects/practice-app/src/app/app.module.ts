import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { DialogRecoveryComponent } from './components/dialogs/dialog-recovery/dialog-recovery.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/layout/menu/menu.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { IndicatorsComponent } from './pages/dashboard/indicators/indicators.component';
import { TaskComponent } from './pages/dashboard/task/task.component';
import { ClientComponent } from './pages/client/client.component';
import { CreateClientComponent } from './pages/client/create-client/create-client.component';
import { ClientProfileComponent } from './pages/client/client-profile/client-profile.component';
import { GeneralInfoComponent } from './pages/client/client-profile/general-info/general-info.component';
import { ClientExpedientComponent } from './pages/client/client-profile/client-expedient/client-expedient.component';
import { InvoicingComponent } from './pages/invoicing/invoicing.component';
import { DialogNewTaskComponent } from './components/dialogs/dialog-new-task/dialog-new-task.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { InvoicingParametersComponent } from './pages/configuration/invoicing-parameters/invoicing-parameters.component';
import { PermissionComponent } from './pages/configuration/permission/permission.component';
import { DialogAddRoleComponent } from './components/dialogs/dialog-add-role/dialog-add-role.component';
import { ProfileSignComponent } from './pages/configuration/profile-sign/profile-sign.component';
import { ProfileGeneralInfoComponent } from './pages/configuration/profile-sign/profile-general-info/profile-general-info.component';
import { PaymentMethodComponent } from './pages/configuration/profile-sign/payment-method/payment-method.component';
import { DialogAddCreditcardComponent } from './components/dialogs/dialog-add-creditcard/dialog-add-creditcard.component';
import { SubscriptionComponent } from './pages/configuration/profile-sign/subscription/subscription.component';
import { NotificationComponent } from './pages/configuration/notification/notification.component';
import { PlansComponent } from './pages/configuration/plans/plans.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { DialogNewDocumentComponent } from './components/dialogs/dialog-new-document/dialog-new-document.component';
import { DialogNewTemplateComponent } from './components/dialogs/dialog-new-template/dialog-new-template.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { TaskpageComponent } from './pages/taskpage/taskpage.component';
import { DialogChargedHoursComponent } from './components/dialogs/dialog-charged-hours/dialog-charged-hours.component';
import { DialogAddHoursComponent } from './components/dialogs/dialog-add-hours/dialog-add-hours.component';
import { NewInvoiceComponent } from './pages/invoicing/new-invoice/new-invoice.component';
import { ExpedientComponent } from './pages/expedient/expedient.component';
import { DialogNewExpedientComponent } from './components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import { ExpedientInfoComponent } from './pages/expedient/expedient-info/expedient-info.component';
import { DocumentComponent } from './pages/expedient/expedient-info/document/document.component';
import { DialogUploadComponent } from './components/dialogs/dialog-upload/dialog-upload.component';
import { FilePickerModule } from  'ngx-awesome-uploader';
import { NotesComponent } from './pages/expedient/expedient-info/notes/notes.component';
import { DialogNewNoteComponent } from './components/dialogs/dialog-new-note/dialog-new-note.component';
import { ExpedientTasksComponent } from './pages/expedient/expedient-info/expedient-tasks/expedient-tasks.component';
import { DialogNewExpedientTaskComponent } from './components/dialogs/dialog-new-expedient-task/dialog-new-expedient-task.component';
import { ExpedientInvoicingComponent } from './pages/expedient/expedient-info/expedient-invoicing/expedient-invoicing.component';
import { ExpedientWalletComponent } from './pages/expedient/expedient-info/expedient-wallet/expedient-wallet.component';
import { DialogPaymentRegisterComponent } from './components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { DialogAddBalanceComponent } from './components/dialogs/dialog-add-balance/dialog-add-balance.component';
import { ClientPendingComponent } from './pages/client/client-profile/client-pending/client-pending.component';
import { ClientInvoicingComponent } from './pages/client/client-profile/client-invoicing/client-invoicing.component';
import { CollaboratorComponent } from './pages/collaborator/collaborator.component';
import { CreateCollaboratorComponent } from './pages/collaborator/create-collaborator/create-collaborator.component';
import { DialogNewRoleComponent } from './components/dialogs/dialog-new-role/dialog-new-role.component';
import { DialogNewReasonComponent } from './components/dialogs/dialog-new-reason/dialog-new-reason.component';
import { InvoicingPendingComponent } from './pages/invoicing/invoicing-pending/invoicing-pending.component';
import { InvoicingWaitingComponent } from './pages/invoicing/invoicing-waiting/invoicing-waiting.component';
import { DialogPaymentHistoryComponent } from './components/dialogs/dialog-payment-history/dialog-payment-history.component';
import { InvoicingPaidComponent } from './pages/invoicing/invoicing-paid/invoicing-paid.component';
import { InvoicingExpiredComponent } from './pages/invoicing/invoicing-expired/invoicing-expired.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { CreateProfileComponent } from './pages/configuration/profile-sign/create-profile/create-profile.component';
import { RegisterClientComponent } from './pages/register/register-client/register-client.component';
import { CoreServicesModule } from 'core-services';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogRecoveryComponent,
    RecoveryComponent,
    RegisterComponent,
    DashboardComponent,
    LayoutComponent,
    MenuComponent,
    HeaderComponent,
    IndicatorsComponent,
    TaskComponent,
    ClientComponent,
    CreateClientComponent,
    ClientProfileComponent,
    GeneralInfoComponent,
    ClientExpedientComponent,
    InvoicingComponent,
    DialogNewTaskComponent,
    ConfigurationComponent,
    InvoicingParametersComponent,
    PermissionComponent,
    DialogAddRoleComponent,
    ProfileSignComponent,
    ProfileGeneralInfoComponent,
    PaymentMethodComponent,
    DialogAddCreditcardComponent,
    SubscriptionComponent,
    NotificationComponent,
    PlansComponent,
    TemplatesComponent,
    DialogNewDocumentComponent,
    DialogNewTemplateComponent,
    DocumentViewerComponent,
    TaskpageComponent,
    DialogChargedHoursComponent,
    DialogAddHoursComponent,
    NewInvoiceComponent,
    ExpedientComponent,
    DialogNewExpedientComponent,
    ExpedientInfoComponent,
    DocumentComponent,
    DialogUploadComponent,
    NotesComponent,
    DialogNewNoteComponent,
    ExpedientTasksComponent,
    DialogNewExpedientTaskComponent,
    ExpedientInvoicingComponent,
    ExpedientWalletComponent,
    DialogPaymentRegisterComponent,
    DialogAddBalanceComponent,
    ClientPendingComponent,
    ClientInvoicingComponent,
    CollaboratorComponent,
    CreateCollaboratorComponent,
    DialogNewRoleComponent,
    DialogNewReasonComponent,
    InvoicingPendingComponent,
    InvoicingWaitingComponent,
    DialogPaymentHistoryComponent,
    InvoicingPaidComponent,
    InvoicingExpiredComponent,
    OnboardingComponent,
    CreateProfileComponent,
    RegisterClientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FilePickerModule,
    HttpClientModule,
    AvatarModule,
    FormsModule,
    ReactiveFormsModule,
    CoreServicesModule.forRoot(environment)
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
