import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingWaitingComponent } from './invoicing-waiting.component';

describe('InvoicingWaitingComponent', () => {
  let component: InvoicingWaitingComponent;
  let fixture: ComponentFixture<InvoicingWaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingWaitingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
