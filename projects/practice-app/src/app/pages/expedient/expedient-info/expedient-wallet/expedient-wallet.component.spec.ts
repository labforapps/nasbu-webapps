import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientWalletComponent } from './expedient-wallet.component';

describe('ExpedientWalletComponent', () => {
  let component: ExpedientWalletComponent;
  let fixture: ComponentFixture<ExpedientWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
