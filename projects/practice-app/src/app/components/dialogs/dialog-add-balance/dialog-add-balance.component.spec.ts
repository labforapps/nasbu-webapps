import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddBalanceComponent } from './dialog-add-balance.component';

describe('DialogAddBalanceComponent', () => {
  let component: DialogAddBalanceComponent;
  let fixture: ComponentFixture<DialogAddBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
