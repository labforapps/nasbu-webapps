import { parseAmount } from './amount';

describe('parseAmount (NAS-024)', () => {
  it('acepta coma de miles y punto decimal', () => {
    expect(parseAmount('4,000')).toBe(4000);
    expect(parseAmount('1,234,567.89')).toBe(1234567.89);
    expect(parseAmount(' 4,000.50 ')).toBe(4000.5);
  });

  it('acepta números sin separador y valores numéricos', () => {
    expect(parseAmount('4000')).toBe(4000);
    expect(parseAmount('25.5')).toBe(25.5);
    expect(parseAmount(300)).toBe(300);
  });

  it('devuelve null para vacío', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount(null)).toBeNull();
    expect(parseAmount(undefined)).toBeNull();
  });

  it('devuelve NaN para texto inválido', () => {
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('4,00')).toBeNaN();
    expect(parseAmount('4.000.50')).toBeNaN();
    expect(parseAmount('300USD')).toBeNaN();
  });
});
