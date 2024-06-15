import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendAccountConfirmationComponent } from './dialog-send-account-confirmation.component';

describe('DialogSendAccountConfirmationComponent', () => {
  let component: DialogSendAccountConfirmationComponent;
  let fixture: ComponentFixture<DialogSendAccountConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendAccountConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendAccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
