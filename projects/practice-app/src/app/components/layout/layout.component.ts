import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @ViewChild(MatDrawer)
  sidenav!: MatDrawer;

  constructor(
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) {  this.authService.addPermissions(); }


  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {

      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.cdRef.detectChanges();

      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  
}
