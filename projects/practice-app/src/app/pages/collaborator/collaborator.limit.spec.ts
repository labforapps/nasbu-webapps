import { of, throwError } from 'rxjs';
import { CollaboratorComponent } from './collaborator.component';

describe('CollaboratorComponent – límite de usuarios (NAS-020)', () => {
  let component: CollaboratorComponent;
  let router: jasmine.SpyObj<any>;
  let toastr: jasmine.SpyObj<any>;
  let subscriptions: jasmine.SpyObj<any>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['warning']);
    subscriptions = jasmine.createSpyObj('SubscriptionService', ['getFeatureUsage']);
    component = Object.create(CollaboratorComponent.prototype);
    Object.assign(component as any, {
      router, toastr, subscriptionService: subscriptions,
      translate: { instant: (key: string) => key },
      selectedSubscription: { ssid: { uuid: 'sub-1' } },
    });
  });

  it('no abre el formulario y avisa cuando se alcanzó el límite', () => {
    subscriptions.getFeatureUsage.and.returnValue(of({ contracted_value: '3', current_usage: '3' }));

    component.createCollaborator();

    expect(subscriptions.getFeatureUsage).toHaveBeenCalledWith('sub-1', 'users');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.warning).toHaveBeenCalledWith('collaborator.users_limit_reached', 'collaborator.users_limit_reached_title');
  });

  it('abre el formulario cuando quedan usuarios disponibles', () => {
    subscriptions.getFeatureUsage.and.returnValue(of({ contracted_value: '3', current_usage: '2' }));

    component.createCollaborator();

    expect(router.navigate).toHaveBeenCalledWith(['/user/create']);
    expect(toastr.warning).not.toHaveBeenCalled();
  });

  it('si la consulta falla abre el formulario (el backend sigue validando)', () => {
    subscriptions.getFeatureUsage.and.returnValue(throwError(() => ({ status: 404 })));

    component.createCollaborator();

    expect(router.navigate).toHaveBeenCalledWith(['/user/create']);
  });
});
