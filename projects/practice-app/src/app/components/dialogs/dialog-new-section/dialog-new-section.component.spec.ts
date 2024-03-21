import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewSectionComponent } from './dialog-new-section.component';

describe('DialogNewSectionComponent', () => {
  let component: DialogNewSectionComponent;
  let fixture: ComponentFixture<DialogNewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
