import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { InvoicingParametersComponent } from './invoicing-parameters.component';

describe('InvoicingParametersComponent – umbral de retainer bajo', () => {
  let component: InvoicingParametersComponent;
  let subscriptions: jasmine.SpyObj<any>;

  beforeEach(() => {
    subscriptions = jasmine.createSpyObj('SubscriptionService', ['saveSubscriptionBillingFee']);
    subscriptions.saveSubscriptionBillingFee.and.returnValue(of({}));
    component = Object.create(InvoicingParametersComponent.prototype);
    Object.assign(component as any, {
      formBuilder: new FormBuilder(),
      subscriptionService: subscriptions,
      toastr: jasmine.createSpyObj('ToastrService', ['success']),
      selectedSubscription: { ssid: { uuid: 'sub-1' } },
      subscriptionBillingFee: [{ uuid: 'fee-1', billing_fee_id: 'fee-1' }],
    });
    component.initForm();
  });

  const sentPayload = () => subscriptions.saveSubscriptionBillingFee.calls.mostRecent().args[0];

  it('envía el umbral cuando el retainer está habilitado', () => {
    component.invoicingParameterForm.patchValue({ allow_retainers: true, low_retainer_threshold: 500 });

    component.submitForm();

    expect(sentPayload().low_retainer_threshold).toBe(500);
  });

  it('un umbral vacío se envía como null (aviso desactivado)', () => {
    component.invoicingParameterForm.patchValue({ allow_retainers: true, low_retainer_threshold: '' });

    component.submitForm();

    expect(sentPayload().low_retainer_threshold).toBeNull();
  });

  it('no envía el umbral cuando el retainer está deshabilitado', () => {
    component.invoicingParameterForm.patchValue({ allow_retainers: false, low_retainer_threshold: 500 });

    component.submitForm();

    expect('low_retainer_threshold' in sentPayload()).toBeFalse();
    expect(sentPayload().allow_retainers).toBeFalse();
  });

  it('al desmarcar retainer limpia el umbral del formulario', () => {
    component.invoicingParameterForm.patchValue({ allow_retainers: true, low_retainer_threshold: 500 });

    component.onCheckRetainer({ checked: false } as any);

    expect(component.invoicingParameterForm.value.low_retainer_threshold).toBeNull();
  });
});
