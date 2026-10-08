import { expect, test } from '../../support/fixtures';
import { createCustomer, customerName } from '../../support/data';
import { InvoiceFormPage } from '../../support/pages/invoice.page';
import { Shell } from '../../support/pages/shell.page';

test.describe('Facturación', () => {
  test('FAC-01 crear factura manual con un ítem de precio fijo @smoke', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const invoice = new InvoiceFormPage(page);
    await invoice.openFromList();
    await invoice.chooseCustomer(customerName(customer));
    await invoice.withoutCaseFile();
    await invoice.addFlatFeeItem(`Honorarios ${uid}`, '250');

    await expect(invoice.subtotal).toContainText('250.00');
    const created = await invoice.save();
    cleanup(`accounting/invoices/${created.uuid}/`);

    await expect(new Shell(page).toast('successMessages.created_succesfully')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`invoicing/edit-invoice/${created.uuid}`));
  });

  test.fixme('FAC-02 factura desde expediente trae horas, gastos y reembolsos', async () => {});
  test.fixme('FAC-03 el ítem manual no copia el texto del reembolso (NAS-105)', async () => {
    // Activar al mezclar fix/NAS-105-item-manual-factura.
  });
  test.fixme('FAC-04 editar factura en borrador recalcula totales (NAS-104)', async () => {});
  test.fixme('FAC-05 eliminar factura pide confirmación y respeta permisos (NAS-104)', async () => {});
  test.fixme('FAC-06 salir con cambios sin guardar pide confirmar', async () => {});
  test.fixme('FAC-07 facturar con el perfil de la firma incompleto avisa (NAS-096)', async () => {});
  test.fixme('FAC-08 el PDF muestra el teléfono de la firma (NAS-089)', async () => {});
  test.fixme('FAC-09 el PDF desglosa los cobros por incremento de tiempo (NAS-029)', async () => {});
  test.fixme('FAC-10 enviar factura por correo cambia el estado a enviada (NAS-104)', async () => {});
  test.fixme('FAC-11 la solicitud de pago genera el enlace de pago', async () => {});
  test.fixme('FAC-12 los parámetros de facturación se aplican a la siguiente factura', async () => {});
});

test.describe('Pagos y cartera', () => {
  test.fixme('PAG-01 pago total deja la factura pagada (NAS-103)', async () => {});
  test.fixme('PAG-02 pago parcial deja la factura parcial con el saldo correcto (NAS-103)', async () => {});
  test.fixme('PAG-03 varios pagos parciales hasta saldar (NAS-103)', async () => {});
  test.fixme('PAG-04 pago mayor que el saldo (regla por confirmar con el cliente)', async () => {});
  test.fixme('PAG-05 aplicar saldo a favor del cliente a una factura', async () => {});
  test.fixme('PAG-06 pago desde el enlace externo con la pasarela simulada', async () => {});
  test.fixme('PAG-07 historial de pagos con filtros', async () => {});
});
