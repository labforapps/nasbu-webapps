import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIntakeSuccessComponent } from './client-intake-success.component';

describe('ClientIntakeSuccessComponent', () => {
  let component: ClientIntakeSuccessComponent;
  let fixture: ComponentFixture<ClientIntakeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientIntakeSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIntakeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
