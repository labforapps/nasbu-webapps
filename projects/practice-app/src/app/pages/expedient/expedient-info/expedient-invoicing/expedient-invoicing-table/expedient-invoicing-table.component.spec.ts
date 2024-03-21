import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientInvoicingTableComponent } from './expedient-invoicing-table.component';

describe('ExpedientInvoicingTableComponent', () => {
  let component: ExpedientInvoicingTableComponent;
  let fixture: ComponentFixture<ExpedientInvoicingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientInvoicingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientInvoicingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
