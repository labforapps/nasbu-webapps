import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OnboardingComponent } from '../../components/onboarding/onboarding.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public userName!: string;
  public today: Date;
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.today = new Date();
  }

  ngOnInit(): void {
    this.userName = this.route.snapshot.data['user']['attributes']['name'];
    this.openOnboardingDialog();
  }


  openOnboardingDialog(): void {
    const user = this.authService.getUserInfoFromLocalStorage(); 
    if(user?.ssid?.tutorial_was_completed) return;
    this.dialog.open(OnboardingComponent, {
      width:'900px',
      height: '700px',
      minWidth: '350px',
      minHeight: '500px'
    });
  }
}
