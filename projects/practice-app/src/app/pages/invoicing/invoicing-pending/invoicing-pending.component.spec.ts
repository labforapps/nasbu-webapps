import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingPendingComponent } from './invoicing-pending.component';

describe('InvoicingPendingComponent', () => {
  let component: InvoicingPendingComponent;
  let fixture: ComponentFixture<InvoicingPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
