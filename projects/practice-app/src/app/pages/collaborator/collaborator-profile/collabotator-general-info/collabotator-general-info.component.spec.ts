import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabotatorGeneralInfoComponent } from './collabotator-general-info.component';

describe('CollabotatorGeneralInfoComponent', () => {
  let component: CollabotatorGeneralInfoComponent;
  let fixture: ComponentFixture<CollabotatorGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabotatorGeneralInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabotatorGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
