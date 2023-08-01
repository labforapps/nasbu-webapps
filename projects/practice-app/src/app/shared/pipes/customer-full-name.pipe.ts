import { Pipe, PipeTransform } from '@angular/core';
import { Customer, TypeCustomer } from 'core-models';

@Pipe({
  name: 'customerFullName'
})
export class CustomerFullNamePipe implements PipeTransform {

  typeCustomer = TypeCustomer

  transform(customer: Customer): string {
    if (customer.type === this.typeCustomer.person) {
      return customer.first_name + ' ' + customer.last_name;
    } else if (customer.type === this.typeCustomer.business) {
      return customer.company_name;
    }

    return '';
  }

}
