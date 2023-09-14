import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIncomeComponent } from './report-income.component';

describe('ReportIncomeComponent', () => {
  let component: ReportIncomeComponent;
  let fixture: ComponentFixture<ReportIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
