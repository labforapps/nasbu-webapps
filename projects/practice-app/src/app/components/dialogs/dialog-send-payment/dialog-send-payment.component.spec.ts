import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendPaymentComponent } from './dialog-send-payment.component';

describe('DialogSendPaymentComponent', () => {
  let component: DialogSendPaymentComponent;
  let fixture: ComponentFixture<DialogSendPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
