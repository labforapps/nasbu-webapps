import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country, SecurityUser, SecurityUserContact, TypeContact } from 'core-models';
import { CommonService } from 'core-services';

@Component({
  selector: 'app-collabotator-general-info',
  templateUrl: './collabotator-general-info.component.html',
  styleUrls: ['./collabotator-general-info.component.scss']
})
export class CollabotatorGeneralInfoComponent implements OnInit {

  @Input() securityUser!:SecurityUser;
  securityUserContactPhone!:SecurityUserContact[];
  securityUserContactEmail!:SecurityUserContact[];
  typeContact = TypeContact;
  countries!:Country[];


  constructor(private commonService:CommonService,
              private router:Router) { }

  ngOnInit(): void {
    this.securityUserContactPhone = this.securityUser.contacts.filter(x => x.type === this.typeContact.phone_number);
    this.securityUserContactEmail = this.securityUser.contacts.filter(x => x.type === this.typeContact.email);
    this.fetchCountries();

  }

  returnCountryName(countryId: string) {
    const country_filtered = this.countries.filter((x) => x.uuid === countryId);
    return country_filtered[0]?.name ? country_filtered[0]?.name : '' ;
  }

  fetchCountries() {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  navigateToEditUser(id:string){
    this.router.navigate(['user/edit', id]);
  }


}
