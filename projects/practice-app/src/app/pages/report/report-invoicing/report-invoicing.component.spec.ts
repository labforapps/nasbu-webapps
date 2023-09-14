import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInvoicingComponent } from './report-invoicing.component';

describe('ReportInvoicingComponent', () => {
  let component: ReportInvoicingComponent;
  let fixture: ComponentFixture<ReportInvoicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInvoicingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
