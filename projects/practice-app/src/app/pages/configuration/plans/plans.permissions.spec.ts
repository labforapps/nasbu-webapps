import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SubscriptionService } from 'core-services';

import { PlansComponent } from './plans.component';
import { OnboardingService } from '../../../services/onboarding/onboarding.service';
import { AuthService } from '../../../services/auth/auth.service';
import { HelpersService } from '../../../services/helpers.service';

describe('PlansComponent – permisos tras cambio de plan (NAS-073)', () => {
  let fixture: ComponentFixture<PlansComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let subscriptions: jasmine.SpyObj<SubscriptionService>;
  let helpers: jasmine.SpyObj<HelpersService>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj('AuthService', ['getUserInfoFromLocalStorage', 'refreshPermissions']);
    auth.getUserInfoFromLocalStorage.and.returnValue({ ssid: { uuid: 'sub-1' } } as any);
    auth.refreshPermissions.and.returnValue(of(['add_documentsignaturerequest']));

    subscriptions = jasmine.createSpyObj('SubscriptionService', ['getSubscription', 'subscriptionChangePlanRequest']);
    subscriptions.getSubscription.and.returnValue(of({ uuid: 'sub-1', plan: 'starter' } as any));
    subscriptions.subscriptionChangePlanRequest.and.returnValue(of({} as any));

    helpers = jasmine.createSpyObj('HelpersService', ['showConfirmationChangePlan', 'showCustomMessage']);

    const onboarding = jasmine.createSpyObj('OnboardingService', ['getPlans']);
    onboarding.getPlans.and.returnValue(of([{ uuid: 'starter' }, { uuid: 'ultimate' }]));

    await TestBed.configureTestingModule({
      declarations: [PlansComponent],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: SubscriptionService, useValue: subscriptions },
        { provide: HelpersService, useValue: helpers },
        { provide: OnboardingService, useValue: onboarding },
      ],
    }).overrideTemplate(PlansComponent, '').compileComponents();

    fixture = TestBed.createComponent(PlansComponent);
    fixture.detectChanges();
  });

  it('recarga los permisos cuando el cambio de plan se confirma', async () => {
    helpers.showConfirmationChangePlan.and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    fixture.componentInstance.changePlanRequest({ uuid: 'ultimate' } as any);
    await fixture.whenStable();

    expect(subscriptions.subscriptionChangePlanRequest).toHaveBeenCalled();
    expect(auth.refreshPermissions).toHaveBeenCalledTimes(1);
  });

  it('no recarga permisos si el usuario cancela', async () => {
    helpers.showConfirmationChangePlan.and.returnValue(Promise.resolve({ isConfirmed: false } as any));

    fixture.componentInstance.changePlanRequest({ uuid: 'ultimate' } as any);
    await fixture.whenStable();

    expect(auth.refreshPermissions).not.toHaveBeenCalled();
  });
});
