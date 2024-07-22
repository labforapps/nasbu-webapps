import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPaymentGatewayComponent } from './dialog-add-payment-gateway.component';

describe('DialogAddPaymentGatewayComponent', () => {
  let component: DialogAddPaymentGatewayComponent;
  let fixture: ComponentFixture<DialogAddPaymentGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddPaymentGatewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddPaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
