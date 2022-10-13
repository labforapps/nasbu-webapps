import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewRoleComponent } from './dialog-new-role.component';

describe('DialogNewRoleComponent', () => {
  let component: DialogNewRoleComponent;
  let fixture: ComponentFixture<DialogNewRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
