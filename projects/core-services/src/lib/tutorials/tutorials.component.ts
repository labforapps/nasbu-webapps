import { Component, OnInit } from '@angular/core';
import { Tutorial, TutorialComplexity } from 'core-models';
import { AuthService } from '../services/security/auth.service';
import { TutorialService } from '../services/learning/tutorial.service';
import { TutorialPipService } from './tutorial-pip.service';

@Component({
  selector: 'lib-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {

  tutorials: Tutorial[] = [];
  activeComplexity: TutorialComplexity | null = null;
  searchTerm = '';
  loading = false;

  readonly complexityLabels: Record<TutorialComplexity, string> = {
    B: 'básico',
    I: 'intermedio',
    A: 'avanzado'
  };

  private readonly tabComplexities: Array<TutorialComplexity | null> = [null, 'B', 'I', 'A'];

  constructor(
    private authService: AuthService,
    private tutorialService: TutorialService,
    private pipService: TutorialPipService
  ) {}

  ngOnInit(): void {
    const raw = this.authService.getUserInfoFromLocalStorage()?.ssid;
    const subscriptionUuid: string = typeof raw === 'string' ? raw : raw?.uuid;
    if (subscriptionUuid) {
      this.loading = true;
      this.tutorialService.getTutorials(subscriptionUuid).subscribe({
        next: (data) => { this.tutorials = data; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  get filteredTutorials(): Tutorial[] {
    return this.tutorials
      .filter(t => !this.activeComplexity || t.complexity === this.activeComplexity)
      .filter(t => !this.searchTerm || t.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onTabChange(index: number): void {
    this.activeComplexity = this.tabComplexities[index] ?? null;
  }

  formatDuration(minutes: number): string {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return s > 0 ? `${m} m ${s}s` : `${m} min`;
  }

  getThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  openVideo(tutorial: Tutorial): void {
    this.pipService.open(tutorial);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}
