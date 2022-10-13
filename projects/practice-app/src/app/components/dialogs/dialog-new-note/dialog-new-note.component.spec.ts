import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewNoteComponent } from './dialog-new-note.component';

describe('DialogNewNoteComponent', () => {
  let component: DialogNewNoteComponent;
  let fixture: ComponentFixture<DialogNewNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
