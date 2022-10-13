import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientInvoicingComponent } from './expedient-invoicing.component';

describe('ExpedientInvoicingComponent', () => {
  let component: ExpedientInvoicingComponent;
  let fixture: ComponentFixture<ExpedientInvoicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientInvoicingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientInvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
