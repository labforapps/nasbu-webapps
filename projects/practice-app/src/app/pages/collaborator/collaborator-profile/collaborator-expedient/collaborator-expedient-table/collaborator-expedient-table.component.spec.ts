import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorExpedientTableComponent } from './collaborator-expedient-table.component';

describe('CollaboratorExpedientTableComponent', () => {
  let component: CollaboratorExpedientTableComponent;
  let fixture: ComponentFixture<CollaboratorExpedientTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorExpedientTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorExpedientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
