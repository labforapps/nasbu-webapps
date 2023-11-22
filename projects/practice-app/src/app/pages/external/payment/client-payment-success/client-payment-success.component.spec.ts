import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaymentSuccessComponent } from './client-payment-success.component';

describe('ClientPaymentSuccessComponent', () => {
  let component: ClientPaymentSuccessComponent;
  let fixture: ComponentFixture<ClientPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPaymentSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
