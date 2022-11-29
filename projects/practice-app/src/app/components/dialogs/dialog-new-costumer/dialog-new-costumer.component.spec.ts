import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewCostumerComponent } from './dialog-new-costumer.component';

describe('DialogNewCostumerComponent', () => {
  let component: DialogNewCostumerComponent;
  let fixture: ComponentFixture<DialogNewCostumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewCostumerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewCostumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
