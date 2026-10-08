import { test } from '../../support/fixtures';

test.describe('Autenticación – cuenta y registro', () => {
  test.fixme('AUT-05 primer ingreso con contraseña temporal obliga a cambiarla', async () => {
    // Requiere una cuenta recién invitada por cada corrida.
  });
  test.fixme('AUT-06 recuperar contraseña con código', async () => {
    // Requiere leer el código del correo (buzón de captura).
  });
  test.fixme('AUT-07 registro de una firma nueva con pago exitoso (pasarela simulada)', async () => {
    // Simular PlaceToPay con page.route; crea una suscripción real en QA.
  });
  test.fixme('AUT-08 registro con pago cancelado permite reintentar', async () => {
  });
  test.fixme('AUT-09 validaciones del formulario de registro', async () => {
  });
  test.fixme('AUT-10 confirmación de cuenta desde el enlace', async () => {
  });
  test.fixme('AUT-12 suscripción suspendida muestra el diálogo de suspensión', async () => {
    // Requiere la cuenta suscripcionSuspendida.
  });
  test.fixme('AUT-13 cambiar contraseña desde el perfil', async () => {
    // Cambia la contraseña de una cuenta compartida: usar una cuenta propia.
  });
});
