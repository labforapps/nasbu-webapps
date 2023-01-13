import { Component, OnInit ,Input} from '@angular/core';
import {Customer,Contact,Country} from 'core-models';
import { AuthService, CommonService } from 'core-services';
import { Occupation } from '../../../../../../../../dist/core-models/lib/models/common/common';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  @Input() customer!: Customer;
  customer_contacts_phone!: Contact[];
  customer_contacts_email!: Contact[];
  countries!: Country[];
  occupations!:Occupation[];

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.setCustomerContacts();
    this.fetchCountries();
    this.fetchOccupations();
  }

  setCustomerContacts() {
    this.customer_contacts_phone = this.customer.contacts.filter(
      (x) => x.type === 'P'
    );
    this.customer_contacts_email = this.customer.contacts.filter(
      (x) => x.type === 'E'
    );
  }
  fetchCountries() {
    this.commonService.getCountries().subscribe(data => {
      this.countries = data;
    })
  }

  fetchOccupations()
  {
    this.commonService.getOccupations().subscribe(data => {
      this.occupations = data;
    })
  }

  return_country_name(countryId:string)
  {
    const country_filtered = this.countries.filter(x => x.uuid === countryId);

    return country_filtered[0].name;
  }

  return_occupation_name(uuid:string)
  {

    if(uuid)
    {
      console.log(uuid);

      const occupation_filtered = this.occupations.filter(
        (x) => x.uuid === uuid
      );

      return occupation_filtered[0].name;
    }
    else
    {
      return '';
    }

  }
}
