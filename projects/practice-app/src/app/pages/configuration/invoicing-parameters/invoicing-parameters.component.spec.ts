import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingParametersComponent } from './invoicing-parameters.component';

describe('InvoicingParametersComponent', () => {
  let component: InvoicingParametersComponent;
  let fixture: ComponentFixture<InvoicingParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicingParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
