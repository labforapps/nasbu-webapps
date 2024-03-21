import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateClientIntakeCircumstantialDataComponent } from './form-create-client-intake-circumstantial-data.component';

describe('FormCreateClientIntakeCircumstantialDataComponent', () => {
  let component: FormCreateClientIntakeCircumstantialDataComponent;
  let fixture: ComponentFixture<FormCreateClientIntakeCircumstantialDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreateClientIntakeCircumstantialDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateClientIntakeCircumstantialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
