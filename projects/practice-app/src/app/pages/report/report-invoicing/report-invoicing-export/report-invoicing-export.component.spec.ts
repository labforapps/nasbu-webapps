import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInvoicingExportComponent } from './report-invoicing-export.component';

describe('ReportInvoicingExportComponent', () => {
  let component: ReportInvoicingExportComponent;
  let fixture: ComponentFixture<ReportInvoicingExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInvoicingExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInvoicingExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
