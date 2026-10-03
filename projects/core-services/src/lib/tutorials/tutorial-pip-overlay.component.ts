import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Tutorial } from 'core-models';
import { TutorialPipService } from './tutorial-pip.service';

@Component({
  selector: 'lib-tutorial-pip-overlay',
  templateUrl: './tutorial-pip-overlay.component.html',
  styleUrls: ['./tutorial-pip-overlay.component.scss']
})
export class TutorialPipOverlayComponent {

  @ViewChild('pipOverlay') pipOverlayRef!: ElementRef<HTMLDivElement>;

  readonly tutorial$ = this.pipService.currentTutorial$;

  readonly safeUrl$ = this.tutorial$.pipe(
    map((tutorial: Tutorial | null) =>
      tutorial
        ? this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${tutorial.youtube_video_id}?autoplay=1`
          )
        : null
    )
  );

  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialLeft = 0;
  private initialTop = 0;

  constructor(
    private pipService: TutorialPipService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  close(): void {
    this.pipService.close();
  }

  onDragStart(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.c-pip-overlay__close')) return;

    const el = this.pipOverlayRef.nativeElement;
    const rect = el.getBoundingClientRect();

    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.initialLeft = rect.left;
    this.initialTop = rect.top;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const el = this.pipOverlayRef.nativeElement;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;

    const newLeft = Math.max(0, Math.min(this.initialLeft + dx, window.innerWidth - el.offsetWidth));
    const newTop  = Math.max(0, Math.min(this.initialTop  + dy, window.innerHeight - el.offsetHeight));

    this.renderer.setStyle(el, 'left',   `${newLeft}px`);
    this.renderer.setStyle(el, 'top',    `${newTop}px`);
    this.renderer.setStyle(el, 'right',  'auto');
    this.renderer.setStyle(el, 'bottom', 'auto');
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }
}
