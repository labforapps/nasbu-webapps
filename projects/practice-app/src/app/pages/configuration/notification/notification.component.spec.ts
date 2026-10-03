import { of, Subject, throwError } from 'rxjs';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent preferences', () => {
  let component: NotificationComponent;
  let service: any;
  let toastr: any;
  let selected: any;
  const result = () => ({ subscription: 'tenant-a', preferences: [
    { code: 'task_completed', category: 'tasks', dashboard: true, email: false },
    { code: 'retainer_low', category: 'billing', dashboard: true, email: true }
  ] });

  const create = () => {
    component = new NotificationComponent(service, { getUserInfoFromLocalStorage: () => selected } as any,
      toastr, { instant: (key: string) => key } as any);
    component.ngOnInit();
  };

  beforeEach(() => {
    selected = { ssid: { uuid: 'tenant-a', name: 'Tenant A' } };
    service = jasmine.createSpyObj('notifications', ['getPreferences', 'savePreferences']);
    service.getPreferences.and.returnValue(of(result()));
    service.savePreferences.and.callFake((id: string, rows: any[]) => of({ subscription: id, preferences: rows }));
    toastr = jasmine.createSpyObj('toastr', ['error']);
    create();
  });

  afterEach(() => component.ngOnDestroy());

  it('loads the selected subscription and groups rows by category', () => {
    expect(service.getPreferences).toHaveBeenCalledOnceWith('tenant-a');
    expect(component.loaded).toBeTrue();
    expect(component.categories).toEqual(['tasks', 'cases', 'clients', 'billing', 'documents', 'team', 'account']);
    expect(component.rows('billing').map(row => row.code)).toEqual(['retainer_low']);
    expect(component.rows('cases')).toEqual([]);
  });

  it('saves the email switch immediately, one row at a time', () => {
    const row = component.preferences[0];
    component.toggleEmail(row, true);
    expect(service.savePreferences).toHaveBeenCalledOnceWith('tenant-a', [row]);
    expect(row.email).toBeTrue();
    expect(component.isSaving(row)).toBeFalse();
  });

  it('disables the switch while saving', () => {
    const pending = new Subject<any>();
    service.savePreferences.and.returnValue(pending);
    const row = component.preferences[0];
    component.toggleEmail(row, true);
    expect(component.isSaving(row)).toBeTrue();
    pending.next(result());
    expect(component.isSaving(row)).toBeFalse();
  });

  it('reverts the switch and warns when saving fails', () => {
    service.savePreferences.and.returnValue(throwError(() => new Error('offline')));
    const row = component.preferences[1];
    component.toggleEmail(row, false);
    expect(row.email).toBeTrue();
    expect(toastr.error).toHaveBeenCalledWith('notificationPreferences.saveError');
  });

  it('warns when preferences cannot be loaded', () => {
    service.getPreferences.and.returnValue(throwError(() => new Error('offline')));
    create();
    expect(component.loaded).toBeFalse();
    expect(toastr.error).toHaveBeenCalledWith('notificationPreferences.loadError');
  });

  it('does nothing without a selected subscription', () => {
    selected = null;
    service.getPreferences.calls.reset();
    create();
    expect(service.getPreferences).not.toHaveBeenCalled();
  });
});
