import { DialogExternalDocSignatureComponent } from './dialog-external-doc-signature.component';

describe('DialogExternalDocSignatureComponent – plan sin firma (NAS-061)', () => {
  let component: DialogExternalDocSignatureComponent;
  let helper: jasmine.SpyObj<any>;

  beforeEach(() => {
    helper = jasmine.createSpyObj('HelpersService', ['showCustomMessage']);
    component = Object.create(DialogExternalDocSignatureComponent.prototype);
    (component as any).helperService = helper;
  });

  it('muestra el motivo que envía el backend cuando el plan no incluye firma', () => {
    component.handleSignatureError({ status: 501, error: { detail: 'Usted no cuenta con esta funcionalidad' } });

    expect(helper.showCustomMessage).toHaveBeenCalledOnceWith(
      'Error', 'Usted no cuenta con esta funcionalidad', 'Firma no disponible');
  });

  it('no duplica el aviso cuando la respuesta trae code (lo muestra el interceptor)', () => {
    component.handleSignatureError({ status: 403, error: { detail: 'x', code: 'plan_feature_missing' } });

    expect(helper.showCustomMessage).not.toHaveBeenCalled();
  });

  it('mantiene el error genérico para otras fallas', () => {
    component.handleSignatureError({ status: 500, error: {} });

    expect(helper.showCustomMessage).toHaveBeenCalledOnceWith(
      'Error', 'El documento no pudo ser enviado', 'Error al enviar');
  });
});
