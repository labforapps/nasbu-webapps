import { Component, OnInit ,Input} from '@angular/core';
import {Customer,Contact} from 'core-models';
import { AuthService, CommonService } from 'core-services';
import { Country } from '../../../../../../../../dist/core-models/lib/models/common/common';

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

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.setCustomerContacts();
    this.fetchCountries();
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

  return_country_name(countryId:string)
  {
    const country_filtered = this.countries.filter(x => x.uuid === countryId);

    return country_filtered[0].name;
  }
}
