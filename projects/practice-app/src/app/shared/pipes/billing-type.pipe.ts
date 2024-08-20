import { Pipe, PipeTransform } from '@angular/core';
import { BillingType } from 'core-models';

@Pipe({
  name: 'billingType'
})
export class BillingTypePipe implements PipeTransform {

  billingType = BillingType

  transform(value: unknown, ...args: unknown[]): string {
    if(value === this.billingType.PER_HOUR) return 'Por Hora'
    if(value === this.billingType.BY_TIME_INCREMENT) return 'Por Incremento de Tiempo'
    if(value === this.billingType.FLAT_FEE) return 'Monto Fijo'
    if(value === this.billingType.NO_BILLABLE) return 'No Facturable'

    return ''
  }

}
