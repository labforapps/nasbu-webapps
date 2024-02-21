import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplatesTypesVariablesComponent } from './create-templates-types-variables.component';

describe('CreateTemplatesTypesVariablesComponent', () => {
  let component: CreateTemplatesTypesVariablesComponent;
  let fixture: ComponentFixture<CreateTemplatesTypesVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTemplatesTypesVariablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplatesTypesVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
