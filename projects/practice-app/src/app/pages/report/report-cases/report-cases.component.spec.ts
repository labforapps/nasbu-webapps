import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCasesComponent } from './report-cases.component';

describe('ReportCasesComponent', () => {
  let component: ReportCasesComponent;
  let fixture: ComponentFixture<ReportCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
