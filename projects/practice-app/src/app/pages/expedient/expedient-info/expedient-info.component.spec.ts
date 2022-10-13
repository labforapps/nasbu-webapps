import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientInfoComponent } from './expedient-info.component';

describe('ExpedientInfoComponent', () => {
  let component: ExpedientInfoComponent;
  let fixture: ComponentFixture<ExpedientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
