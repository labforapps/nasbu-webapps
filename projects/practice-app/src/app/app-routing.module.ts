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
import { TemplatesComponent } from './pages/templates/templates.component';
import { TaskpageComponent } from './pages/taskpage/taskpage.component';
import { NewInvoiceComponent } from './pages/invoicing/new-invoice/new-invoice.component';
import { ExpedientComponent } from './pages/expedient/expedient.component';
import { ExpedientInfoComponent } from './pages/expedient/expedient-info/expedient-info.component';
import { CollaboratorComponent } from './pages/collaborator/collaborator.component';
import { CreateCollaboratorComponent } from './pages/collaborator/create-collaborator/create-collaborator.component';
import { CreateProfileComponent } from './pages/configuration/profile-sign/create-profile/create-profile.component';
import { RegisterClientComponent } from './pages/register/register-client/register-client.component';
import { AuthGuard } from 'core-services';
import { SuccessSubscriptionPaymentComponent } from './pages/success-subscription-payment/success-subscription-payment.component';
import { CancelSubscriptionPaymentComponent } from './pages/cancel-subscription-payment/cancel-subscription-payment.component';
import { ClientIntakeComponent } from './pages/client-intake/client-intake.component';
import { UserResolver } from './resolvers/user.resolver';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PermissionsResolver } from './resolvers/permissions.resolver';
import { CollaboratorProfileComponent } from './pages/collaborator/collaborator-profile/collaborator-profile.component';
import { AccountConfirmationComponent } from './pages/account-confirmation/account-confirmation.component';

const routes: Routes = [
  {
    path: 'signin',
    component: LoginComponent,
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
    /*  canActivate: [AuthGuard],
    canActivateChild: [AuthGuard], */
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
        path: 'collaborator',
        component: CollaboratorComponent,
      },

      {
        path: 'client-profile',
        component: ClientProfileComponent,
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
        path: 'expedient-info',
        component: ExpedientInfoComponent,
      },
      {
        path: 'templates',
        component: TemplatesComponent,
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
        path: 'collaborator-profile',
        component: CollaboratorProfileComponent,
      },
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
    path: 'collaborator/create-collaborator',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
