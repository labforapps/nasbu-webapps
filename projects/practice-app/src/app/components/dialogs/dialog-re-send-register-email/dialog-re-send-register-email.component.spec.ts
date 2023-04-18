import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReSendRegisterComponent } from './dialog-re-send-register.component';

describe('DialogSendRegisterEmailComponent', () => {
  let component: DialogReSendRegisterComponent;
  let fixture: ComponentFixture<DialogReSendRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogReSendRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReSendRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
