import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityUser } from 'core-models';
import { AuthService, SecurityService } from 'core-services';

@Component({
  selector: 'app-collaborator-profile',
  templateUrl: './collaborator-profile.component.html',
  styleUrls: ['./collaborator-profile.component.scss']
})
export class CollaboratorProfileComponent implements OnInit {

  private selectedSubscription!:any;
  private securityUserId!:string;
  public securityUser!:SecurityUser;

  constructor(private securityService:SecurityService,
              private authService:AuthService,
              private activatedRoute:ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.securityUserId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getSecurityUserById();
  }

  getSecurityUserById(){
    this.securityService.getSecurityUserById(this.selectedSubscription?.ssid.uuid,this.securityUserId).subscribe(data => {
      this.securityUser = data;
    })
  }

  navigateToEditUser(id:string){
    this.router.navigate(['user/edit', id]);
  }

}
