import { TestBed } from '@angular/core/testing';

import { SubscriptionNotificationsService } from './subscription-notifications.service';

describe('SubscriptionNotificationsService', () => {
  let service: SubscriptionNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
