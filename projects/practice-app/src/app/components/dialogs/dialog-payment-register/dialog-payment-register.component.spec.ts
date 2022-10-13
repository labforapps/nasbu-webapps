import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentRegisterComponent } from './dialog-payment-register.component';

describe('DialogPaymentRegisterComponent', () => {
  let component: DialogPaymentRegisterComponent;
  let fixture: ComponentFixture<DialogPaymentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaymentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
