import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIntakeComponent } from './dialog-intake.component';

describe('DialogIntakeComponent', () => {
  let component: DialogIntakeComponent;
  let fixture: ComponentFixture<DialogIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIntakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
