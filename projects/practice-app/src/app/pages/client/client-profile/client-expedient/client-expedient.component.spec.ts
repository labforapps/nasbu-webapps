import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExpedientComponent } from './client-expedient.component';

describe('ClientExpedientComponent', () => {
  let component: ClientExpedientComponent;
  let fixture: ComponentFixture<ClientExpedientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientExpedientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientExpedientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
