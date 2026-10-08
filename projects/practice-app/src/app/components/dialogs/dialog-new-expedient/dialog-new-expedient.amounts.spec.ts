import { DialogNewExpedientComponent } from './dialog-new-expedient.component';

describe('DialogNewExpedientComponent – montos con coma (NAS-024)', () => {
  const component = Object.create(DialogNewExpedientComponent.prototype) as DialogNewExpedientComponent;

  it('convierte los montos con coma de miles a número', () => {
    const result = component.normalizeAmounts({
      name: 'Exp', retainer_amt: '4,000', bt_price_per_hour: '1,250.50', price_per_increment: '25', flat_fee_amt: 0,
    });

    expect(result.retainer_amt).toBe(4000);
    expect(result.bt_price_per_hour).toBe(1250.5);
    expect(result.price_per_increment).toBe(25);
    expect(result.flat_fee_amt).toBe(0);
    expect(result.name).toBe('Exp');
  });

  it('deja los montos vacíos como estaban', () => {
    const result = component.normalizeAmounts({ retainer_amt: 0, bt_price_per_hour: '', price_per_increment: null, flat_fee_amt: 0 });

    expect(result.bt_price_per_hour).toBe('');
    expect(result.price_per_increment).toBeNull();
  });

  it('devuelve null si un monto no es válido', () => {
    expect(component.normalizeAmounts({ retainer_amt: '300USD' })).toBeNull();
  });
});
