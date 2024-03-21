import { TestBed } from '@angular/core/testing';

import { DocumentTemplatesService } from './document-templates.service';

describe('DocumentTemplatesService', () => {
  let service: DocumentTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
