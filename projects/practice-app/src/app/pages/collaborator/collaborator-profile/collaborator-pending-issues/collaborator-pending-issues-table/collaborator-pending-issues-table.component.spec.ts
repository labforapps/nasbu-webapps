import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPendingIssuesTableComponent } from './collaborator-pending-issues-table.component';

describe('CollaboratorPendingIssuesTableComponent', () => {
  let component: CollaboratorPendingIssuesTableComponent;
  let fixture: ComponentFixture<CollaboratorPendingIssuesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorPendingIssuesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPendingIssuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
