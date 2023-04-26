import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPendingIssuesComponent } from './collaborator-pending-issues.component';

describe('CollaboratorPendingIssuesComponent', () => {
  let component: CollaboratorPendingIssuesComponent;
  let fixture: ComponentFixture<CollaboratorPendingIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorPendingIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPendingIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
