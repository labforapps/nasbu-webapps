import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Tutorial } from 'core-models';

@Component({
  selector: 'lib-dialog-tutorial-video',
  template: `
    <div class="c-dialog-header c-dialog-tutorial-video">
      <div class="c-dialog-header__header d-flex align-items-center">
        {{ data.title }}
      </div>
      <mat-dialog-content>
        <div class="c-dialog-tutorial-video__wrap">
          <iframe
            [src]="safeUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <p class="u-smallSize u-textLightColor mt-3" *ngIf="data.description">
          {{ data.description }}
        </p>
      </mat-dialog-content>
      <mat-dialog-actions class="c-dialog-header__footer">
        <button mat-button mat-dialog-close class="u-link">Cerrar ventana</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .c-dialog-tutorial-video__wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
    }
    .c-dialog-tutorial-video__wrap iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  `]
})
export class DialogTutorialVideoComponent {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tutorial,
    private sanitizer: DomSanitizer
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${data.youtube_video_id}?autoplay=1`
    );
  }
}
