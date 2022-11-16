import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSubscriptionPaymentComponent } from './success-subscription-payment.component';

describe('SuccessSubscriptionPaymentComponent', () => {
  let component: SuccessSubscriptionPaymentComponent;
  let fixture: ComponentFixture<SuccessSubscriptionPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessSubscriptionPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessSubscriptionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
