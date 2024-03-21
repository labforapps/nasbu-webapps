import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientWalletIncomesComponent } from './expedient-wallet-incomes.component';

describe('ExpedientWalletIncomesComponent', () => {
  let component: ExpedientWalletIncomesComponent;
  let fixture: ComponentFixture<ExpedientWalletIncomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientWalletIncomesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientWalletIncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
