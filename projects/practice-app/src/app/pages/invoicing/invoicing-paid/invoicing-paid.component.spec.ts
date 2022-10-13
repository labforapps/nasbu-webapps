import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingPaidComponent } from './invoicing-paid.component';

describe('InvoicingPaidComponent', () => {
  let component: InvoicingPaidComponent;
  let fixture: ComponentFixture<InvoicingPaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingPaidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
