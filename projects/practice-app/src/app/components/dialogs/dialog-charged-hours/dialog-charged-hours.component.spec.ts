import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChargedHoursComponent } from './dialog-charged-hours.component';

describe('DialogChargedHoursComponent', () => {
  let component: DialogChargedHoursComponent;
  let fixture: ComponentFixture<DialogChargedHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChargedHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChargedHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
