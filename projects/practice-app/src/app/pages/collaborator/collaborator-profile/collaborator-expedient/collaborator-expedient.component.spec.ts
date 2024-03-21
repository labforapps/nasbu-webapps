import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorExpedientComponent } from './collaborator-expedient.component';

describe('CollaboratorExpedientComponent', () => {
  let component: CollaboratorExpedientComponent;
  let fixture: ComponentFixture<CollaboratorExpedientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorExpedientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorExpedientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
