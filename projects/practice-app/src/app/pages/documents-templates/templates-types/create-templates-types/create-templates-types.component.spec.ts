import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplatesTypesComponent } from './create-templates-types.component';

describe('CreateTemplatesTypesComponent', () => {
  let component: CreateTemplatesTypesComponent;
  let fixture: ComponentFixture<CreateTemplatesTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTemplatesTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplatesTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
