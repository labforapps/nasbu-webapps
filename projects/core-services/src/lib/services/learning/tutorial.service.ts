import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutorial } from 'core-models';

@Injectable({ providedIn: 'root' })
export class TutorialService {

  constructor(@Inject('config') private config: any, private httpClient: HttpClient) {}

  getTutorials(subscriptionUuid: string): Observable<Tutorial[]> {
    return this.httpClient.get<Tutorial[]>(
      `${this.config.serverUrl}/core/tutorials/?subscription=${subscriptionUuid}`
    );
  }
}
