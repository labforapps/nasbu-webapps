import { Component, Input, OnInit } from '@angular/core';
import { CaseFile, SecurityUser, modules } from 'core-models';
import { SecurityService } from 'core-services';

@Component({
  selector: 'app-collaborator-expedient',
  templateUrl: './collaborator-expedient.component.html',
  styleUrls: ['./collaborator-expedient.component.scss']
})
export class CollaboratorExpedientComponent implements OnInit {

  @Input() securityUser!:SecurityUser;
  caseFiles!:CaseFile[];
  module = modules

  constructor(private securityService:SecurityService) { }

  ngOnInit(): void {
    this.getCaseFilesBySecurityUsers();
  }

  getCaseFilesBySecurityUsers(){
    this.securityService.getCaseFilesBySecurityUsers(this.securityUser.subscription || '',this.securityUser.uuid || '').subscribe((data:CaseFile[]) => {
      this.caseFiles = data;
    })
  }

}
