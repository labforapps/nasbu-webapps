import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingTableComponent } from './invoicing-table.component';

describe('InvoicingTableComponent', () => {
  let component: InvoicingTableComponent;
  let fixture: ComponentFixture<InvoicingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
