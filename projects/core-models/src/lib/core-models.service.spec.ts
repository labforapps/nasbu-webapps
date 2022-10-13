import { TestBed } from '@angular/core/testing';

import { CoreModelsService } from './core-models.service';

describe('CoreModelsService', () => {
  let service: CoreModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
