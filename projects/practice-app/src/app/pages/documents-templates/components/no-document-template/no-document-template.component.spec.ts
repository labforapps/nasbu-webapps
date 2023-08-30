import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDocumentTemplateComponent } from './no-document-template.component';

describe('NoDocumentTemplateComponent', () => {
  let component: NoDocumentTemplateComponent;
  let fixture: ComponentFixture<NoDocumentTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDocumentTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDocumentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
