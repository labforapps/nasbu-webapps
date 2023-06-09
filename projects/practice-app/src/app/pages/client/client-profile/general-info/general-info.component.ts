import { Component, OnInit ,Input} from '@angular/core';
import {Customer,Contact,Country,Occupation,TypeContact,SubtypeContact,SubtypeContactDescripcion} from 'core-models';
import { AuthService, CommonService, CustomersService } from 'core-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  @Input() customer!: Customer;
  linkedCustomer!:Customer;
  customer_contacts_phone!: Contact[];
  customer_contacts_email!: Contact[];
  countries!: Country[];
  occupations!: Occupation[];
  typeContact = TypeContact

  constructor(private commonService: CommonService,
              private router:Router,
              private customerService:CustomersService) {}

  ngOnInit(): void {
    this.setCustomerContacts();
    this.fetchCountries();
    this.fetchOccupations();
    this.getlinkedCustomer();
  }

  getlinkedCustomer()
  {
   if(this.customer.linked_customer){
    this.customerService.getCustomerById(this.customer.subscription || '', this.customer.linked_customer || '').subscribe(data => {
      this.linkedCustomer = data;
    })
   }
  }

  setCustomerContacts() {
    this.customer_contacts_phone = this.customer.contacts.filter(
      (x) => x.type === this.typeContact.phone_number
    );
    this.customer_contacts_email = this.customer.contacts.filter(
      (x) => x.type === this.typeContact.email
    );
  }
  fetchCountries() {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  fetchOccupations() {
    this.commonService.getOccupations().subscribe((data) => {
      this.occupations = data;
    });
  }

  returnCountryName(countryId: string) {
    const country_filtered = this.countries.filter((x) => x.uuid === countryId);
    return country_filtered[0].name;
  }

  returnOccupationName(uuid: string) {
    if (uuid) {

      const occupation_filtered = this.occupations.filter(
        (x) => x.uuid === uuid
      );

      return occupation_filtered[0].name;
    } else {
      return '';
    }
  }

  returnContactDescription(subtypeContact:string){
    return SubtypeContactDescripcion.get(subtypeContact);
  }

  navigateToEditClient() {
    this.router.navigate(['customers/edit', this.customer.uuid]);
  }
}
