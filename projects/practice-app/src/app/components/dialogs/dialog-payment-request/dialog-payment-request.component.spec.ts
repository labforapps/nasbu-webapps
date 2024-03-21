import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentRequestComponent } from './dialog-payment-request.component';

describe('DialogPaymentRequestComponent', () => {
  let component: DialogPaymentRequestComponent;
  let fixture: ComponentFixture<DialogPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
