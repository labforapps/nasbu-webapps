/**
 * Convierte a número un monto escrito por el usuario (NAS-024).
 *
 * Acepta separador de miles con coma y decimales con punto (4,000.50), el formato de RD/EE. UU.
 * Devuelve `null` si el campo está vacío y `NaN` si el texto no es un monto válido, para que
 * la pantalla pueda avisar en lugar de enviar el valor al backend.
 */
export function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }

  const text = String(value).trim().replace(/\s/g, '');
  if (text === '') {
    return null;
  }
  if (!/^-?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/.test(text)) {
    return NaN;
  }
  return Number(text.replace(/,/g, ''));
}
