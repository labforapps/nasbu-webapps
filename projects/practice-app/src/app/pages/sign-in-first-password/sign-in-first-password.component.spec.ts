import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFirstPasswordComponent } from './sign-in-first-password.component';

describe('SignInFirstPasswordComponent', () => {
  let component: SignInFirstPasswordComponent;
  let fixture: ComponentFixture<SignInFirstPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInFirstPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInFirstPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
