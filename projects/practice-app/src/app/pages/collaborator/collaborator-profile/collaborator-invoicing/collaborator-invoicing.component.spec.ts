import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorInvoicingComponent } from './collaborator-invoicing.component';

describe('CollaboratorInvoicingComponent', () => {
  let component: CollaboratorInvoicingComponent;
  let fixture: ComponentFixture<CollaboratorInvoicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorInvoicingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorInvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
