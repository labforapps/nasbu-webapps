import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddHoursComponent } from './dialog-add-hours.component';

describe('DialogAddHoursComponent', () => {
  let component: DialogAddHoursComponent;
  let fixture: ComponentFixture<DialogAddHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
