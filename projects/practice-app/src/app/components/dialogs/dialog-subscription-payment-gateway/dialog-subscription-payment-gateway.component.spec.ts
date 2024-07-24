import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogSubscriptionPaymentGateway } from './dialog-subscription-payment-gateway.component';

describe('DialogAddPaymentGatewayComponent', () => {
  let component: DialogSubscriptionPaymentGateway;
  let fixture: ComponentFixture<DialogSubscriptionPaymentGateway>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSubscriptionPaymentGateway ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubscriptionPaymentGateway);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
