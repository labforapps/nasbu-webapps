import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  ReportCustomerWalletDetailsComponent } from './report-customer-wallet-details.component';

describe('ReportClientBalanceComponent', () => {
  let component: ReportCustomerWalletDetailsComponent;
  let fixture: ComponentFixture<ReportCustomerWalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCustomerWalletDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCustomerWalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
