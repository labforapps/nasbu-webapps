import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTaxComponent } from './dialog-add-tax.component';

describe('DialogAddTaxComponent', () => {
  let component: DialogAddTaxComponent;
  let fixture: ComponentFixture<DialogAddTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
