import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientWalletExpensesComponent } from './expedient-wallet-expenses.component';

describe('ExpedientWalletExpensesComponent', () => {
  let component: ExpedientWalletExpensesComponent;
  let fixture: ComponentFixture<ExpedientWalletExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientWalletExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientWalletExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
