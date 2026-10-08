import { test } from '../../support/fixtures';

test.describe('Suscripción y planes', () => {
  test.fixme('SUB-01 ver el plan actual y el uso de cada función', async () => {
  });
  test.fixme('SUB-02 upgrade de Starter a Ultimate habilita la firma sin cerrar sesión (NAS-073)', async () => {
    // Requiere una cuenta desechable recreada por API en cada corrida y la pasarela simulada.
  });
  test.fixme('SUB-03 el upgrade conserva usuarios y roles (NAS-073)', async () => {
  });
  test.fixme('SUB-04 el downgrade a Starter oculta los módulos fuera del plan (NAS-092)', async () => {
    // Hoy el downgrade es inmediato; ajustar si el cliente lo quiere al final del ciclo.
  });
  test.fixme('SUB-05 tras el downgrade, entrar por URL a un módulo fuera del plan (NAS-092, NAS-112)', async () => {
  });
  test.fixme('SUB-06 crear un rol en Starter solo ofrece módulos del plan (NAS-092)', async () => {
  });
  test.fixme('SUB-07 agregar o cambiar el método de pago (NAS-009)', async () => {
    // Pendiente de la definición de NAS-009.
  });
  test.fixme('SUB-08 cancelar la suscripción (NAS-011)', async () => {
    // Pendiente de la definición de NAS-011.
  });
});
