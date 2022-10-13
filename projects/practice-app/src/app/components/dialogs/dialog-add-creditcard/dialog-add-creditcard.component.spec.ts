import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddCreditcardComponent } from './dialog-add-creditcard.component';

describe('DialogAddCreditcardComponent', () => {
  let component: DialogAddCreditcardComponent;
  let fixture: ComponentFixture<DialogAddCreditcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddCreditcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddCreditcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
