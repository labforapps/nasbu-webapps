import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentHistoryComponent } from './dialog-payment-history.component';

describe('DialogPaymentHistoryComponent', () => {
  let component: DialogPaymentHistoryComponent;
  let fixture: ComponentFixture<DialogPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
