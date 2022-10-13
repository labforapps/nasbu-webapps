import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewExpedientComponent } from './dialog-new-expedient.component';

describe('DialogNewExpedientComponent', () => {
  let component: DialogNewExpedientComponent;
  let fixture: ComponentFixture<DialogNewExpedientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewExpedientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewExpedientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
