import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMetricsComponent } from './general-metrics.component';

describe('GeneralMetricsComponent', () => {
  let component: GeneralMetricsComponent;
  let fixture: ComponentFixture<GeneralMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
