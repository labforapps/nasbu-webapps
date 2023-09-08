import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogIntakeComponent } from '../dialogs/dialog-intake/dialog-intake.component';
import { CurrentUserInfo } from 'core-models';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @ViewChild(MatDrawer)
  sidenav!: MatDrawer;
  currentUser!:CurrentUserInfo;
  public openMenu!:boolean;

  constructor(
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private dialog:MatDialog
  ) {  this.authService.addPermissions(); }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.authService.getCurrentUserInfo().subscribe(data => {
      this.currentUser = data;

      if(localStorage.getItem(`first_login_${this.currentUser.username}`) === 'true'){
         this.openDialogIntake();
      }

    })

  }


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

  openDialogIntake(): void {
    const dialogRef = this.dialog.open(DialogIntakeComponent, {
      panelClass: 'c-dialog-intake',
    });

    dialogRef.afterClosed().subscribe(data => {
      if(localStorage.getItem(`first_login_${this.currentUser.username}`) === 'true'){
        localStorage.setItem(`first_login_${this.currentUser.username}`,'false')
        this.openMenu = true;
     }
    })
  }

}
