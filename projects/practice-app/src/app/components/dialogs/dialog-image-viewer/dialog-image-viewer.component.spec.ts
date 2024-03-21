import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImageViewerComponent } from './dialog-image-viewer.component';

describe('DialogImageViewerComponent', () => {
  let component: DialogImageViewerComponent;
  let fixture: ComponentFixture<DialogImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogImageViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
