import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCloseExpedientComponent } from './dialog-close-expedient.component';

describe('DialogCloseExpedientComponent', () => {
  let component: DialogCloseExpedientComponent;
  let fixture: ComponentFixture<DialogCloseExpedientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCloseExpedientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCloseExpedientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
