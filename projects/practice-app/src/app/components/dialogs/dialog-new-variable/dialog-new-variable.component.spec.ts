import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewVariableComponent } from './dialog-new-variable.component';

describe('DialogNewVariableComponent', () => {
  let component: DialogNewVariableComponent;
  let fixture: ComponentFixture<DialogNewVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewVariableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
