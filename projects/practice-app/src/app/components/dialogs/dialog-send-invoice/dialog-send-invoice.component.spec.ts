import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendInvoiceComponent } from './dialog-send-invoice.component';

describe('DialogSendInvoiceComponent', () => {
  let component: DialogSendInvoiceComponent;
  let fixture: ComponentFixture<DialogSendInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
