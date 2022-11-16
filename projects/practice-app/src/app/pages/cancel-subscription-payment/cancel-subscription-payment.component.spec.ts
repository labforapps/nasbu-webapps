import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionPaymentComponent } from './cancel-subscription-payment.component';

describe('CancelSubscriptionPaymentComponent', () => {
  let component: CancelSubscriptionPaymentComponent;
  let fixture: ComponentFixture<CancelSubscriptionPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
