import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tutorial } from 'core-models';

@Injectable({ providedIn: 'root' })
export class TutorialPipService {
  private readonly _tutorial$ = new BehaviorSubject<Tutorial | null>(null);
  readonly currentTutorial$ = this._tutorial$.asObservable();

  open(tutorial: Tutorial): void { this._tutorial$.next(tutorial); }
  close(): void { this._tutorial$.next(null); }
}
