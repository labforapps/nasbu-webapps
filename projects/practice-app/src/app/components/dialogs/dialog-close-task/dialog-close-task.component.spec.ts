import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCloseTaskComponent } from './dialog-close-task.component';

describe('DialogCloseTaskComponent', () => {
  let component: DialogCloseTaskComponent;
  let fixture: ComponentFixture<DialogCloseTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCloseTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCloseTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
