import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BillingType } from 'core-models';

import { NewInvoiceComponent } from './new-invoice.component';
import { FormService } from '../../../services/form.service';

describe('NewInvoiceComponent – índice real de los ítems (NAS-105)', () => {
  let component: NewInvoiceComponent;
  let fb: FormBuilder;

  const detail = (description: string, isLegal: boolean) => fb.group({
    description: [description], billing_type: [BillingType.FLAT_FEE], total_hours: [0], bt_price_per_hour: [0],
    total_amt: [0], related_charge: [null], bt_amt: [0], is_legal_charge: [isLegal], total_retainer_amt: [0],
    manual_entry: [true], sub_total_amt: [0],
  });

  const details = () => component.invoiceForm.get('details') as FormArray;
  const normalRows = () => component.filterFormArray('details', 'is_legal_charge', false);

  beforeEach(() => {
    fb = new FormBuilder();
    component = Object.create(NewInvoiceComponent.prototype);
    Object.assign(component as any, {
      formService: new FormService(fb),
      billingType: BillingType,
      invoiceForm: fb.group({ details: fb.array([detail('Tarea 1', false), detail('Desembolso notaría', true)]) }),
    });
  });

  it('un ítem manual agregado después de un reembolso queda enlazado a su propio grupo', () => {
    component.addInvoiceDetail('details', false);

    const manualRow = normalRows()[1];
    const index = component.detailIndex(manualRow);

    expect(index).toBe(2);
    expect((details().at(index) as FormGroup).value.description).toBe('');
    expect((details().at(1) as FormGroup).value.description).toBe('Desembolso notaría');
  });

  it('dos ítems manuales vacíos tienen índices distintos', () => {
    component.addInvoiceDetail('details', false);
    component.addInvoiceDetail('details', false);

    const [, first, second] = normalRows();

    expect(component.detailIndex(first)).toBe(2);
    expect(component.detailIndex(second)).toBe(3);
  });

  it('eliminar un ítem manual no borra el reembolso', () => {
    component.addInvoiceDetail('details', false);

    component.removeItemFormArray('details', normalRows()[1]);

    expect(details().length).toBe(2);
    expect(details().value.map((d: any) => d.description)).toEqual(['Tarea 1', 'Desembolso notaría']);
  });

  it('recalcular un ítem manual no modifica el reembolso', () => {
    component.addInvoiceDetail('details', false);
    const manualRow = normalRows()[1];
    manualRow.patchValue({ billing_type: BillingType.FLAT_FEE, bt_amt: 50 });

    component.onChangeInvoiceDetail('details', manualRow);

    expect(manualRow.value.total_amt).toBe('50.00');
    expect(details().at(1).value.total_amt).toBe(0);
  });
});
