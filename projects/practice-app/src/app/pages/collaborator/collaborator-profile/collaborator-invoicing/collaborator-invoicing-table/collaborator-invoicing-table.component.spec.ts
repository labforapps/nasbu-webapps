import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorInvoicingTableComponent } from './collaborator-invoicing-table.component';

describe('CollaboratorInvoicingTableComponent', () => {
  let component: CollaboratorInvoicingTableComponent;
  let fixture: ComponentFixture<CollaboratorInvoicingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorInvoicingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorInvoicingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
