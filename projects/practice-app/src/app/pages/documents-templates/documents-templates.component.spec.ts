import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTemplatesComponent } from './documents-templates.component';

describe('DocumentsTemplatesComponent', () => {
  let component: DocumentsTemplatesComponent;
  let fixture: ComponentFixture<DocumentsTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
