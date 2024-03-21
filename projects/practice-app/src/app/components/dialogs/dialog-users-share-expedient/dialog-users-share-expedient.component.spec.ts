import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsersShareExpedientComponent } from './dialog-users-share-expedient.component';

describe('DialogUsersShareExpedientComponent', () => {
  let component: DialogUsersShareExpedientComponent;
  let fixture: ComponentFixture<DialogUsersShareExpedientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUsersShareExpedientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUsersShareExpedientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
