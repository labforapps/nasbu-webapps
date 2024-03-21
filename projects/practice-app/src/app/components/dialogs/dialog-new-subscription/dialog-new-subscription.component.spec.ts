import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewSubscriptionComponent } from './dialog-new-subscription.component';

describe('DialogNewSubscriptionComponent', () => {
  let component: DialogNewSubscriptionComponent;
  let fixture: ComponentFixture<DialogNewSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
