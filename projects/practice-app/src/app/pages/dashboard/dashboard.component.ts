import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewCostumerComponent } from '../../components/dialogs/dialog-new-costumer/dialog-new-costumer.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public userName!: string;
  public today: Date;
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.today = new Date();
  }

  ngOnInit(): void {
    this.userName = this.route.snapshot.data['user']['attributes']['name'];
  }

  openDialogNewCostumer() {
    this.dialog.open(DialogNewCostumerComponent);
  }
}
