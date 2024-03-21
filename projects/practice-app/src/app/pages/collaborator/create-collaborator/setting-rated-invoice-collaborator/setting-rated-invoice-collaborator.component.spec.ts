import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingRatedInvoiceCollaboratorComponent } from './setting-rated-invoice-collaborator.component';

describe('SettingRatedInvoiceCollaboratorComponent', () => {
  let component: SettingRatedInvoiceCollaboratorComponent;
  let fixture: ComponentFixture<SettingRatedInvoiceCollaboratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingRatedInvoiceCollaboratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingRatedInvoiceCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
