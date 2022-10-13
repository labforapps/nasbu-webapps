import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewTemplateComponent } from './dialog-new-template.component';

describe('DialogNewTemplateComponent', () => {
  let component: DialogNewTemplateComponent;
  let fixture: ComponentFixture<DialogNewTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
