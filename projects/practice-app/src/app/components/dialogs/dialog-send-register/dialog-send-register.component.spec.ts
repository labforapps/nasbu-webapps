import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendRegisterComponent } from './dialog-send-register.component';

describe('DialogSendRegisterComponent', () => {
  let component: DialogSendRegisterComponent;
  let fixture: ComponentFixture<DialogSendRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
