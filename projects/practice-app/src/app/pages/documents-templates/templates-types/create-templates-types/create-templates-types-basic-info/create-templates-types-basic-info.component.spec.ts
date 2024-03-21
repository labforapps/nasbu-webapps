import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplatesTypesBasicInfoComponent } from './create-templates-types-basic-info.component';

describe('CreateTemplatesTypesBasicInfoComponent', () => {
  let component: CreateTemplatesTypesBasicInfoComponent;
  let fixture: ComponentFixture<CreateTemplatesTypesBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTemplatesTypesBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplatesTypesBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
