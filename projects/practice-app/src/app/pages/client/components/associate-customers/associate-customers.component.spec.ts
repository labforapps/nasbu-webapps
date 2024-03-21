import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCustomersComponent } from './associate-customers.component';

describe('AssociateCustomersComponent', () => {
  let component: AssociateCustomersComponent;
  let fixture: ComponentFixture<AssociateCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociateCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
