import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientTasksComponent } from './expedient-tasks.component';

describe('ExpedientTasksComponent', () => {
  let component: ExpedientTasksComponent;
  let fixture: ComponentFixture<ExpedientTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
