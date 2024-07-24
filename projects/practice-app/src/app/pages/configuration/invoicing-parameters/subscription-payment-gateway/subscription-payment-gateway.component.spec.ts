import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaymentGatewayComponent } from './subscription-payment-gateway.component';

describe('PaymentGatewayComponent', () => {
  let component: SubscriptionPaymentGatewayComponent;
  let fixture: ComponentFixture<SubscriptionPaymentGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPaymentGatewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
