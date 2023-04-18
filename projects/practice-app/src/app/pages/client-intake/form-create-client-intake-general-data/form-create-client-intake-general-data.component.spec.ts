import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateClientIntakeGeneralDataComponent } from './form-create-client-intake-general-data.component';

describe('FormCreateClientIntakeGeneralDataComponent', () => {
  let component: FormCreateClientIntakeGeneralDataComponent;
  let fixture: ComponentFixture<FormCreateClientIntakeGeneralDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreateClientIntakeGeneralDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateClientIntakeGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
