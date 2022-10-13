import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSignComponent } from './profile-sign.component';

describe('ProfileSignComponent', () => {
  let component: ProfileSignComponent;
  let fixture: ComponentFixture<ProfileSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
