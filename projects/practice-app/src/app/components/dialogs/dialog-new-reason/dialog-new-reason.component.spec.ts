import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewReasonComponent } from './dialog-new-reason.component';

describe('DialogNewReasonComponent', () => {
  let component: DialogNewReasonComponent;
  let fixture: ComponentFixture<DialogNewReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
