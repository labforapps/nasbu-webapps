import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIntakeSummaryComponent } from './client-intake-summary.component';

describe('ClientIntakeSummaryComponent', () => {
  let component: ClientIntakeSummaryComponent;
  let fixture: ComponentFixture<ClientIntakeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientIntakeSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIntakeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
