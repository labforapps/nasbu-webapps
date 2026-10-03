import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TutorialsComponent } from './tutorials.component';
import { TutorialPipOverlayComponent } from './tutorial-pip-overlay.component';

@NgModule({
  declarations: [TutorialsComponent, TutorialPipOverlayComponent],
  imports: [CommonModule, MatTabsModule, MatIconModule],
  exports: [TutorialsComponent, TutorialPipOverlayComponent]
})
export class TutorialsModule {}
