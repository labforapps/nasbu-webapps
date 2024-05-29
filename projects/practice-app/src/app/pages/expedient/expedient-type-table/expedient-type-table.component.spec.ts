import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientTypeTableComponent } from './expedient-type-table.component';

describe('ExpedientTypeTableComponent', () => {
  let component: ExpedientTypeTableComponent;
  let fixture: ComponentFixture<ExpedientTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientTypeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
