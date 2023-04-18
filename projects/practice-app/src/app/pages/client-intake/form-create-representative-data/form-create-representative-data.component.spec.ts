import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateRepresentativeDataComponent } from './form-create-representative-data.component';

describe('FormCreateRepresentativeDataComponent', () => {
  let component: FormCreateRepresentativeDataComponent;
  let fixture: ComponentFixture<FormCreateRepresentativeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreateRepresentativeDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateRepresentativeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
