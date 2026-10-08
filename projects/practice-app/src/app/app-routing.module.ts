import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RegisterComponent } from './pages/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientComponent } from './pages/client/client.component';
import { CreateClientComponent } from './pages/client/create-client/create-client.component';
import { ClientProfileComponent } from './pages/client/client-profile/client-profile.component';
import { InvoicingComponent } from './pages/invoicing/invoicing.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { InvoicingParametersComponent } from './pages/configuration/invoicing-parameters/invoicing-parameters.component';
import { PermissionComponent } from './pages/configuration/permission/permission.component';
import { ProfileSignComponent } from './pages/configuration/profile-sign/profile-sign.component';
import { NotificationComponent } from './pages/configuration/notification/notification.component';
import { PlansComponent } from './pages/configuration/plans/plans.component';
import { DocumentsTemplatesComponent } from './pages/documents-templates/documents-templates.component';
import { TaskpageComponent } from './pages/taskpage/taskpage.component';
import { NewInvoiceComponent } from './pages/invoicing/new-invoice/new-invoice.component';
import { ExpedientComponent } from './pages/expedient/expedient.component';
import { ExpedientInfoComponent } from './pages/expedient/expedient-info/expedient-info.component';
import { CollaboratorComponent } from './pages/collaborator/collaborator.component';
import { CreateCollaboratorComponent } from './pages/collaborator/create-collaborator/create-collaborator.component';
import { CreateProfileComponent } from './pages/configuration/profile-sign/create-profile/create-profile.component';
import { RegisterClientComponent } from './pages/register/register-client/register-client.component';
import { AuthGuard } from 'core-services';
import { SubscriptionGuard } from './services/auth/subscription.guard';
import { SuccessSubscriptionPaymentComponent } from './pages/success-subscription-payment/success-subscription-payment.component';
import { CancelSubscriptionPaymentComponent } from './pages/cancel-subscription-payment/cancel-subscription-payment.component';
import { ClientIntakeComponent } from './pages/client-intake/client-intake.component';
import { UserResolver } from './resolvers/user.resolver';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PermissionsResolver } from './resolvers/permissions.resolver';
import { CollaboratorProfileComponent } from './pages/collaborator/collaborator-profile/collaborator-profile.component';
import { AccountConfirmationComponent } from './pages/account-confirmation/account-confirmation.component';
import { SignInFirstPasswordComponent } from './pages/sign-in-first-password/sign-in-first-password.component';
import { DialogUploadComponent } from './components/dialogs/dialog-upload/dialog-upload.component';
import { CanComponenteDeactivateGuard } from './shared/guards/can-componente-deactivate.guard';
import { ReportComponent } from './pages/report/report.component';
import { ReportInvoicingComponent } from './pages/report/report-invoicing/report-invoicing.component';
import { ReportCasesComponent } from './pages/report/report-cases/report-cases.component';
import { ReportClientComponent } from './pages/report/report-client/report-client.component';
import { ReportIncomeComponent } from './pages/report/report-income/report-income.component';
import { GeneralMetricsComponent } from './pages/report/general-metrics/general-metrics.component';
import { ReportInvoicingExportComponent } from './pages/report/report-invoicing/report-invoicing-export/report-invoicing-export.component';
import { CheckoutRequestLadingComponent } from './pages/external/payment/checkout-request-lading/checkout-request-lading.component';
import { CreateTemplatesTypesComponent } from './pages/documents-templates/templates-types/create-templates-types/create-templates-types.component';
import { CreateExpedientTypeComponent } from './pages/expedient/create-expedient-type/create-expedient-type.component';
import { ReportCustomerWalletDetailsComponent } from './pages/report/report-customer-wallet-details/report-customer-wallet-details.component';
import { PaymentsComponent } from './pages/invoicing/payments/payments.component';
import { TutorialsComponent } from 'core-services';


const routes: Routes = [
  {
    path: 'pg/checkoutRequest',
    component: CheckoutRequestLadingComponent,
  },
  {
    path: 'signin',
    component: LoginComponent,
  },
  {
    path: 'signin-first-password',
    component: SignInFirstPasswordComponent
  },
  {
    path: 'recovery',
    component: RecoveryComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'register-client',
    component: RegisterClientComponent,
  },
  {
    path: 'account-confirmation',
    component: AccountConfirmationComponent,
  },
  {
    path: 'register/success',
    component: SuccessSubscriptionPaymentComponent,
  },
  {
    path: 'register/cancel',
    component: CancelSubscriptionPaymentComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    // AuthGuard valida que haya sesion; SubscriptionGuard, que el alta haya pagado.
    // Estar autenticado no alcanza: en el registro por redirect la cuenta de Cognito se
    // confirma antes de tokenizar la tarjeta, asi que se puede tener sesion valida con
    // la suscripcion todavia sin pagar.
    canActivate: [AuthGuard, SubscriptionGuard],
    canActivateChild: [AuthGuard, SubscriptionGuard],
    resolve: { permissions: PermissionsResolver },
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'customers',
        component: ClientComponent,
        data: {
          permissions: {
            only: [
              'add_customer',
              'view_customer',
              'change_customer',
              'delete_customer',
            ],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'users',
        component: CollaboratorComponent,
      },
      {
        path: 'client-profile/:id',
        component: ClientProfileComponent,
      },
      {
        path: 'invoicing',
        component: InvoicingComponent,
      },
      {
        path: 'invoicing/new-invoice',
        component: NewInvoiceComponent,
        canDeactivate: [CanComponenteDeactivateGuard],

      },
      {
        path: 'invoicing/edit-invoice/:id',
        component: NewInvoiceComponent,
      },
      {
        path: 'invoicing/invoice/:id/:action',
        component: NewInvoiceComponent,
      },
      {
        path: 'payments',
        component: PaymentsComponent,
      },
      {
        path: 'task',
        component: TaskpageComponent,
      },
      {
        path: 'expedient',
        component: ExpedientComponent,
      },
      {
        path: 'expedient-info/:id',
        component: ExpedientInfoComponent,
      },
      {
        path: 'templates',
        component: DocumentsTemplatesComponent,
        // Documentos y plantillas no está en todos los planes (NAS-092): sin este guard la
        // ruta se abría escribiendo la URL aunque el menú ya la ocultara.
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['view_documenttemplate', 'view_documentgenerationlog'],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
      },
      {
        path: 'configuration/invoicing-parameters',
        component: InvoicingParametersComponent,
      },
      {
        path: 'configuration/permission',
        component: PermissionComponent,
      },
      {
        path: 'configuration/profile-sign',
        component: ProfileSignComponent,
      },
      {
        path: 'configuration/notification',
        component: NotificationComponent,
      },
      {
        path: 'configuration/plans',
        component: PlansComponent,
      },
      {
        path: 'user-profile/:id',
        component: CollaboratorProfileComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'report/report-invoicing',
        component: ReportInvoicingComponent,
      },
      {
        path: 'report/report-cases',
        component: ReportCasesComponent,
      },
      {
        path: 'report/report-client',
        component: ReportClientComponent,
      },
      {
        path: 'report/report-income',
        component: ReportIncomeComponent,
      },
      {
        path: 'report/general-metrics',
        component: GeneralMetricsComponent,
      },
      {
        path:'report/customer-wallet-details',
        component: ReportCustomerWalletDetailsComponent
      },
      {
        path: 'tutorials',
        component: TutorialsComponent
      }
    ],
  },
  {
    path: 'customers/create-client',
    component: CreateClientComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['add_customer'],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'customers/edit/:id',
    component: CreateClientComponent,
    data: {
      permissions: {
        only: ['change_customer'],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'configuration/profile-sign/create-profile',
    component: CreateProfileComponent,
  },
  {
    path: 'user/create',
    component: CreateCollaboratorComponent,
  },
  {
    path: 'user/edit/:id',
    component: CreateCollaboratorComponent,
  },
  {
    path: 'collaborator/edit/:id',
    component: CreateCollaboratorComponent,
  },
  {
    path: 'registerClient',
    component: ClientIntakeComponent,
  },
  {
    path: 'client-profile',
    component: ClientProfileComponent,
  },
  {
    path:'dialog-upload',
    component:DialogUploadComponent
  },
  {
    path: 'report/report-invoicing/export',
    component: ReportInvoicingExportComponent,
  },
  {
    path:'templates-types/create',
    component: CreateTemplatesTypesComponent
  },
  {
    path:'templates-types/:id',
    component: CreateTemplatesTypesComponent
  },
  {
    path:'expedient-type',
    component: CreateExpedientTypeComponent
  },
  {
    path:'expedient-type/:id',
    component: CreateExpedientTypeComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
