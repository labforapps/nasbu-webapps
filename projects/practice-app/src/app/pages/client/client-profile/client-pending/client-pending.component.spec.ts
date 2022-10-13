import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPendingComponent } from './client-pending.component';

describe('ClientPendingComponent', () => {
  let component: ClientPendingComponent;
  let fixture: ComponentFixture<ClientPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
