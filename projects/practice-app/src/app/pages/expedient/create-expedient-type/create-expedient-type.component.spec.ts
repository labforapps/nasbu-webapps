import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpedientTypeComponent } from './create-expedient-type.component';

describe('CreateExpedientTypeComponent', () => {
  let component: CreateExpedientTypeComponent;
  let fixture: ComponentFixture<CreateExpedientTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpedientTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpedientTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
