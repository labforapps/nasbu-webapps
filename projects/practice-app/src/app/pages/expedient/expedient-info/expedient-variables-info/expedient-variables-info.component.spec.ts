import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientVariablesInfoComponent } from './expedient-variables-info.component';

describe('ExpedientVariablesInfoComponent', () => {
  let component: ExpedientVariablesInfoComponent;
  let fixture: ComponentFixture<ExpedientVariablesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientVariablesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientVariablesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
