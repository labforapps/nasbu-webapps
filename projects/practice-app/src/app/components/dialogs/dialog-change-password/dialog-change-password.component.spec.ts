import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DialogChangePasswordComponent } from './dialog-change-password.component';

describe('DialogChangePasswordComponent', () => {
  let component: DialogChangePasswordComponent;
  let auth: any;
  let security: any;
  let toastr: any;
  let dialogRef: any;

  const fill = (currentPassword = 'Actual123', newPassword = 'Nueva1234', confirmPassword = newPassword) =>
    component.form.setValue({ currentPassword, newPassword, confirmPassword });

  beforeEach(() => {
    auth = jasmine.createSpyObj('auth', ['changePassword', 'getUserInfoFromLocalStorage']);
    auth.changePassword.and.returnValue(of('SUCCESS'));
    auth.getUserInfoFromLocalStorage.and.returnValue({ ssid: { uuid: 'tenant-a' } });
    security = jasmine.createSpyObj('security', ['reportAccountEvent']);
    security.reportAccountEvent.and.returnValue(of(undefined));
    toastr = jasmine.createSpyObj('toastr', ['success']);
    dialogRef = jasmine.createSpyObj('dialogRef', ['close']);
    component = new DialogChangePasswordComponent(new FormBuilder(), auth, security, toastr,
      { instant: (key: string) => key } as any, dialogRef);
  });

  afterEach(() => component.ngOnDestroy());

  it('changes the password and reports the account event', () => {
    fill();
    component.save();
    expect(auth.changePassword).toHaveBeenCalledWith('Actual123', 'Nueva1234');
    expect(security.reportAccountEvent).toHaveBeenCalledWith('tenant-a', 'password_changed');
    expect(toastr.success).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('still succeeds when the account event cannot be reported', () => {
    security.reportAccountEvent.and.returnValue(throwError(() => new Error('offline')));
    fill();
    component.save();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('shows the wrong password error and does not report anything', () => {
    auth.changePassword.and.returnValue(throwError(() => ({ code: 'NotAuthorizedException' })));
    fill();
    component.save();
    expect(component.errorKey).toBe('wrongCurrentPassword');
    expect(component.saving).toBeFalse();
    expect(security.reportAccountEvent).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('maps unknown Cognito errors to a generic message', () => {
    auth.changePassword.and.returnValue(throwError(() => ({ code: 'SomethingElse' })));
    fill();
    component.save();
    expect(component.errorKey).toBe('generic');
  });

  it('rejects mismatching, reused or weak passwords without calling Cognito', () => {
    fill('Actual123', 'Nueva1234', 'Otra12345');
    expect(component.form.errors?.['mismatch']).toBeTrue();
    fill('Actual123', 'Actual123');
    expect(component.form.errors?.['sameAsCurrent']).toBeTrue();
    fill('Actual123', 'corta');
    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(auth.changePassword).not.toHaveBeenCalled();
  });
});
