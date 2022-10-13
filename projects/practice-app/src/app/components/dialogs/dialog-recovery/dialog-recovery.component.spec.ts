import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRecoveryComponent } from './dialog-recovery.component';

describe('DialogRecoveryComponent', () => {
  let component: DialogRecoveryComponent;
  let fixture: ComponentFixture<DialogRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
