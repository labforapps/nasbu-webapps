import { Component, OnInit ,Input} from '@angular/core';
import {Customer,Contact,Country,Occupation,TypeContact,SubtypeContact,SubtypeContactDescripcion, TypeCustomer} from 'core-models';
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
  typeCustomer = TypeCustomer

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
    return this.countries.find((x) => x.uuid === countryId)?.name || '';
  }

  returnOccupationName(uuid: string) {
      return this.occupations.find((x) => x.uuid === uuid)?.name || '';
  }

  returnContactDescription(subtypeContact:string){
    return SubtypeContactDescripcion.get(subtypeContact);
  }

  navigateToEditClient() {
    this.router.navigate(['customers/edit', this.customer.uuid]);
  }

  get fullName(): string {
      let customerFullName: string = '';
      if (! this.customer) {
          return customerFullName;
      }
      if (this.customer.type.toLowerCase() === 'p') {
          customerFullName = `${this.customer.first_name} ${this.customer.last_name}`;
      } else if (this.customer.type.toLowerCase() === 'c') {
          customerFullName = this.customer.company_name;
      }

      return customerFullName;
  }
}
