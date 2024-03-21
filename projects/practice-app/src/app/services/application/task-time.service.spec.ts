import { TestBed } from '@angular/core/testing';

import { TaskTimeService } from './task-time.service';

describe('TaskTimeService', () => {
  let service: TaskTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
