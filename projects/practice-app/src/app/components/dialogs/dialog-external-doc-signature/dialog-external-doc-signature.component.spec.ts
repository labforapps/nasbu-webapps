import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExternalDocSignatureComponent } from './dialog-external-doc-signature.component';

describe('DialogExternalDocSignatureComponent', () => {
  let component: DialogExternalDocSignatureComponent;
  let fixture: ComponentFixture<DialogExternalDocSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogExternalDocSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExternalDocSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
