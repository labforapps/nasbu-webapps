import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientWalletTableComponent } from './expedient-wallet-table.component';

describe('ExpedientWalletTableComponent', () => {
  let component: ExpedientWalletTableComponent;
  let fixture: ComponentFixture<ExpedientWalletTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientWalletTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientWalletTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
