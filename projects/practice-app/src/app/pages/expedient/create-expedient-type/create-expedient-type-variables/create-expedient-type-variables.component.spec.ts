import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpedientTypeVariablesComponent } from './create-expedient-type-variables.component';

describe('CreateExpedientTypeVariablesComponent', () => {
  let component: CreateExpedientTypeVariablesComponent;
  let fixture: ComponentFixture<CreateExpedientTypeVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpedientTypeVariablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpedientTypeVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
