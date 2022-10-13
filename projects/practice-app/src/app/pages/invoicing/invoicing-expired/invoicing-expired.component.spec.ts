import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingExpiredComponent } from './invoicing-expired.component';

describe('InvoicingExpiredComponent', () => {
  let component: InvoicingExpiredComponent;
  let fixture: ComponentFixture<InvoicingExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingExpiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
