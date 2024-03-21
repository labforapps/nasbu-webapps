import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProfileComponent } from './collaborator-profile.component';

describe('CollaboratorProfileComponent', () => {
  let component: CollaboratorProfileComponent;
  let fixture: ComponentFixture<CollaboratorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
