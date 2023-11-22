import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndicatorsComponent } from './dashboard/indicators/indicators.component';
import { TaskComponent } from './dashboard/task/task.component';
import { InvoicesComponent } from './dashboard/invoices/invoices.component';
import { EmptyDashboardComponent } from './dashboard/empty/empty-dashboard.component';
import { ClientComponent } from './client/client.component';
import { ClientTableComponent } from './client/components/client-table/client-table.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CreateClientComponent } from './client/create-client/create-client.component';
import { ComponentsModule } from '../components/components.module';
import { AssociateCustomersComponent } from './client/components/associate-customers/associate-customers.component';
import { ClientProfileComponent } from './client/client-profile/client-profile.component';
import { GeneralInfoComponent } from './client/client-profile/general-info/general-info.component';
import { ClientExpedientComponent } from './client/client-profile/client-expedient/client-expedient.component';
import { ClientPendingComponent } from './client/client-profile/client-pending/client-pending.component';
import { ClientInvoicingComponent } from './client/client-profile/client-invoicing/client-invoicing.component';
import { CollaboratorProfileComponent } from './collaborator/collaborator-profile/collaborator-profile.component';
import { CollabotatorGeneralInfoComponent } from './collaborator/collaborator-profile/collabotator-general-info/collabotator-general-info.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { InvoicingPendingComponent } from './invoicing/invoicing-pending/invoicing-pending.component';
import { InvoicingWaitingComponent } from './invoicing/invoicing-waiting/invoicing-waiting.component';
import { InvoicingPaidComponent } from './invoicing/invoicing-paid/invoicing-paid.component';
import { InvoicingExpiredComponent } from './invoicing/invoicing-expired/invoicing-expired.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { InvoicingParametersComponent } from './configuration/invoicing-parameters/invoicing-parameters.component';
import { PermissionComponent } from './configuration/permission/permission.component';
import { ProfileSignComponent } from './configuration/profile-sign/profile-sign.component';
import { ProfileGeneralInfoComponent } from './configuration/profile-sign/profile-general-info/profile-general-info.component';
import { PaymentMethodComponent } from './configuration/profile-sign/payment-method/payment-method.component';
import { SubscriptionComponent } from './configuration/profile-sign/subscription/subscription.component';
import { NotificationComponent } from './configuration/notification/notification.component';
import { PlansComponent } from './configuration/plans/plans.component';
import { TemplatesComponent } from './documents-templates/templates/templates.component';
import { NewInvoiceComponent } from './invoicing/new-invoice/new-invoice.component';
import { ExpedientComponent } from './expedient/expedient.component';
import { ExpedientInfoComponent } from './expedient/expedient-info/expedient-info.component';
import { DocumentComponent } from './expedient/expedient-info/document/document.component';
import { NotesComponent } from './expedient/expedient-info/notes/notes.component';
import { ExpedientTasksComponent } from './expedient/expedient-info/expedient-tasks/expedient-tasks.component';
import { ExpedientInvoicingComponent } from './expedient/expedient-info/expedient-invoicing/expedient-invoicing.component';
import { ExpedientWalletComponent } from './expedient/expedient-info/expedient-wallet/expedient-wallet.component';
import { CollaboratorComponent } from './collaborator/collaborator.component';
import { CreateCollaboratorComponent } from './collaborator/create-collaborator/create-collaborator.component';
import { CreateProfileComponent } from './configuration/profile-sign/create-profile/create-profile.component';
import { RegisterClientComponent } from './register/register-client/register-client.component';
import { SuccessSubscriptionPaymentComponent } from './success-subscription-payment/success-subscription-payment.component';
import { CancelSubscriptionPaymentComponent } from './cancel-subscription-payment/cancel-subscription-payment.component';
import { ClientIntakeComponent } from './client-intake/client-intake.component';
import { FormCreateClientComponent } from './client/components/form-create-client/form-create-client.component';
import { ClientIntakeSummaryComponent } from './client-intake/client-intake-summary/client-intake-summary.component';
import { ClientIntakeSuccessComponent } from './client-intake/client-intake-success/client-intake-success.component';
import { FormCreateClientIntakeGeneralDataComponent } from './client-intake/form-create-client-intake-general-data/form-create-client-intake-general-data.component';
import { FormCreateClientIntakeCircumstantialDataComponent } from './client-intake/form-create-client-intake-circumstantial-data/form-create-client-intake-circumstantial-data.component';
import { FormCreateRepresentativeDataComponent } from './client-intake/form-create-representative-data/form-create-representative-data.component';
import { FormCreateRepresentativeAddressComponent } from './client-intake/form-create-representative-address/form-create-representative-address.component';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { TasksModule } from './taskpage/tasks.module';
import { CollaboratorExpedientComponent } from './collaborator/collaborator-profile/collaborator-expedient/collaborator-expedient.component';
import { CollaboratorPendingIssuesComponent } from './collaborator/collaborator-profile/collaborator-pending-issues/collaborator-pending-issues.component';
import { CollaboratorInvoicingComponent } from './collaborator/collaborator-profile/collaborator-invoicing/collaborator-invoicing.component';
import { CollaboratorExpedientTableComponent } from './collaborator/collaborator-profile/collaborator-expedient/collaborator-expedient-table/collaborator-expedient-table.component';
import { CollaboratorInvoicingTableComponent } from './collaborator/collaborator-profile/collaborator-invoicing/collaborator-invoicing-table/collaborator-invoicing-table.component';
import { CollaboratorPendingIssuesTableComponent } from './collaborator/collaborator-profile/collaborator-pending-issues/collaborator-pending-issues-table/collaborator-pending-issues-table.component';
import { ProfileScheduleComponent } from './configuration/profile-sign/create-profile/profile-schedule/profile-schedule.component';
import { SettingRatedInvoiceCollaboratorComponent } from './collaborator/create-collaborator/setting-rated-invoice-collaborator/setting-rated-invoice-collaborator.component';
import { SignInFirstPasswordComponent } from './sign-in-first-password/sign-in-first-password.component';
import { ExpedientTableComponent } from './expedient/expedient-table/expedient-table.component';
import { ExpedientInvoicingTableComponent } from './expedient/expedient-info/expedient-invoicing/expedient-invoicing-table/expedient-invoicing-table.component';
import { ExpedientWalletExpensesComponent } from './expedient/expedient-info/expedient-wallet/expedient-wallet-expenses/expedient-wallet-expenses.component';
import { ExpedientWalletIncomesComponent } from './expedient/expedient-info/expedient-wallet/expedient-wallet-incomes/expedient-wallet-incomes.component';
import { ExpedientWalletTableComponent } from './expedient/expedient-info/expedient-wallet/expedient-wallet-table/expedient-wallet-table.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AngularImageViewerModule } from '@hreimer/angular-image-viewer';
import { InvoicingTableComponent } from './invoicing/components/invoicing-table/invoicing-table.component';
import { NoInvoicesComponent } from './invoicing/components/no-invoices/no-invoices.component';
import { DocumentsTemplatesComponent } from './documents-templates/documents-templates.component';
import { NoDocumentTemplateComponent } from './documents-templates/components/no-document-template/no-document-template.component';
import { DocumentsComponent } from './documents-templates/documents/documents.component';
import { DashboardNotesComponent } from './dashboard/dashboard-notes/dashboard-notes.component';
import { ReportComponent } from './report/report.component';
import { ReportInvoicingComponent } from './report/report-invoicing/report-invoicing.component';
import { ReportCasesComponent } from './report/report-cases/report-cases.component';
import { ReportClientComponent } from './report/report-client/report-client.component';
import { ReportIncomeComponent } from './report/report-income/report-income.component';
import { GeneralMetricsComponent } from './report/general-metrics/general-metrics.component';
import { ReportInvoicingExportComponent } from './report/report-invoicing/report-invoicing-export/report-invoicing-export.component';
import { ClientPaymentSuccessComponent } from './external/payment/client-payment-success/client-payment-success.component';
import { CheckoutRequestLadingComponent } from './external/payment/checkout-request-lading/checkout-request-lading.component';


@NgModule({
  declarations: [
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
    DashboardComponent,
    IndicatorsComponent,
    TaskComponent,
    InvoicesComponent,
    EmptyDashboardComponent,
    ClientComponent,
    ClientTableComponent,
    CreateClientComponent,
    AssociateCustomersComponent,
    ClientProfileComponent,
    GeneralInfoComponent,
    ClientExpedientComponent,
    ClientPendingComponent,
    ClientInvoicingComponent,
    CollaboratorProfileComponent,
    CollabotatorGeneralInfoComponent,
    InvoicingComponent,
    InvoicingPendingComponent,
    InvoicingWaitingComponent,
    InvoicingPaidComponent,
    InvoicingExpiredComponent,
    ConfigurationComponent,
    InvoicingParametersComponent,
    PermissionComponent,
    ProfileSignComponent,
    ProfileGeneralInfoComponent,
    PaymentMethodComponent,
    SubscriptionComponent,
    NotificationComponent,
    PlansComponent,
    TemplatesComponent,
    CreateProfileComponent,
    RegisterClientComponent,
    SuccessSubscriptionPaymentComponent,
    CancelSubscriptionPaymentComponent,
    FormCreateClientComponent,
    ClientIntakeSummaryComponent,
    ClientIntakeSuccessComponent,
    FormCreateClientIntakeGeneralDataComponent,
    FormCreateClientIntakeCircumstantialDataComponent,
    FormCreateRepresentativeDataComponent,
    FormCreateRepresentativeAddressComponent,
    AccountConfirmationComponent,
    ClientIntakeComponent,
    CollaboratorComponent,
    CreateCollaboratorComponent,
    NewInvoiceComponent,
    ExpedientComponent,
    ExpedientInfoComponent,
    DocumentComponent,
    ExpedientInvoicingComponent,
    ExpedientWalletComponent,
    NotesComponent,
    ExpedientTasksComponent,
    CollaboratorExpedientComponent,
    CollaboratorPendingIssuesComponent,
    CollaboratorInvoicingComponent,
    CollaboratorExpedientTableComponent,
    CollaboratorInvoicingTableComponent,
    CollaboratorPendingIssuesTableComponent,
    ProfileScheduleComponent,
    SettingRatedInvoiceCollaboratorComponent,
    SignInFirstPasswordComponent,
    ExpedientTableComponent,
    ExpedientInvoicingTableComponent,
    ExpedientWalletExpensesComponent,
    ExpedientWalletIncomesComponent,
    ExpedientWalletTableComponent,
    InvoicingTableComponent,
    NoInvoicesComponent,
    DocumentsTemplatesComponent,
    NoDocumentTemplateComponent,
    DocumentsComponent,
    DashboardNotesComponent,
    ReportComponent,
    ReportInvoicingComponent,
    ReportCasesComponent,
    ReportClientComponent,
    ReportIncomeComponent,
    GeneralMetricsComponent,
    ReportInvoicingExportComponent,
    ClientPaymentSuccessComponent,
    CheckoutRequestLadingComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NgxPermissionsModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    AppRoutingModule,
    TasksModule,
    NgxDocViewerModule,
    AngularImageViewerModule

  ]
})
export class PagesModule { }
