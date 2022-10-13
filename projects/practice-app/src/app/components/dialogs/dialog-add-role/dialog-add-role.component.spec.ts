import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddRoleComponent } from './dialog-add-role.component';

describe('DialogAddRoleComponent', () => {
  let component: DialogAddRoleComponent;
  let fixture: ComponentFixture<DialogAddRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
