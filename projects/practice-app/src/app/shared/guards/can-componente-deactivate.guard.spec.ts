import { TestBed } from '@angular/core/testing';

import { CanComponenteDeactivateGuard } from './can-componente-deactivate.guard';

describe('CanComponenteDeactivateGuard', () => {
  let guard: CanComponenteDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanComponenteDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
