import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewExpedientTaskComponent } from './dialog-new-expedient-task.component';

describe('DialogNewExpedientTaskComponent', () => {
  let component: DialogNewExpedientTaskComponent;
  let fixture: ComponentFixture<DialogNewExpedientTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewExpedientTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewExpedientTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
