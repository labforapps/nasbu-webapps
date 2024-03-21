import { Component, Input, OnInit } from '@angular/core';
import { SecurityUser,Task, modules } from 'core-models';
import { SecurityService } from 'core-services';

@Component({
  selector: 'app-collaborator-pending-issues',
  templateUrl: './collaborator-pending-issues.component.html',
  styleUrls: ['./collaborator-pending-issues.component.scss']
})
export class CollaboratorPendingIssuesComponent implements OnInit {

  @Input() securityUser!:SecurityUser;
  tasks!:Task[];
  module = modules;

  constructor(private securityService:SecurityService) { }

  ngOnInit(): void {
    this.getTasksBySecurityUsers();
  }

  getTasksBySecurityUsers() {
    this.securityService.getTasksBySecurityUsers(this.securityUser.subscription || '',this.securityUser.uuid || '').subscribe((data:Task[]) => {
      this.tasks = data;
    })
  }

}
