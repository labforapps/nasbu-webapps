import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpedientTypeBasicInfoComponent } from './create-expedient-type-basic-info.component';

describe('CreateExpedientTypeBasicInfoComponent', () => {
  let component: CreateExpedientTypeBasicInfoComponent;
  let fixture: ComponentFixture<CreateExpedientTypeBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpedientTypeBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpedientTypeBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
