import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateRepresentativeAddressComponent } from './form-create-representative-address.component';

describe('FormCreateRepresentativeAddressComponent', () => {
  let component: FormCreateRepresentativeAddressComponent;
  let fixture: ComponentFixture<FormCreateRepresentativeAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreateRepresentativeAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateRepresentativeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
