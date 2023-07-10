import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientTableComponent } from './expedient-table.component';

describe('ExpedientTableComponent', () => {
  let component: ExpedientTableComponent;
  let fixture: ComponentFixture<ExpedientTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
