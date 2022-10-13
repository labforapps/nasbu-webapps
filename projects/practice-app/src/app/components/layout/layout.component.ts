import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild(MatDrawer)
  sidenav!: MatDrawer;
 
   constructor(private observer: BreakpointObserver, private cdRef:ChangeDetectorRef) {}

 
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

  ngOnInit(): void {
  }

}
