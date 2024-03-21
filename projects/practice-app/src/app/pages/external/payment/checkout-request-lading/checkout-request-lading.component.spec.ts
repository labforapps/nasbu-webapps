import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutRequestLadingComponent } from './checkout-request-lading.component';

describe('CheckoutRequestLadingComponent', () => {
  let component: CheckoutRequestLadingComponent;
  let fixture: ComponentFixture<CheckoutRequestLadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutRequestLadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutRequestLadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
