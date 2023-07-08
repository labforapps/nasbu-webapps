import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPasswordComponent } from './first-password.component';

describe('FirstPasswordComponent', () => {
  let component: FirstPasswordComponent;
  let fixture: ComponentFixture<FirstPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
