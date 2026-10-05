import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

import { RoutePermissionsGuard } from './route-permissions.guard';

describe('RoutePermissionsGuard (NAS-092)', () => {
  let loaded: Record<string, any>;
  let permissions: jasmine.SpyObj<NgxPermissionsService>;
  let auth: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<Router>;
  let guard: RoutePermissionsGuard;
  const home = {} as UrlTree;

  const route = (only?: string[]) =>
    ({ data: only ? { permissions: { only, redirectTo: '/' } } : {} } as unknown as ActivatedRouteSnapshot);

  beforeEach(() => {
    loaded = {};
    permissions = jasmine.createSpyObj('NgxPermissionsService', ['getPermissions']);
    permissions.getPermissions.and.callFake(() => loaded);
    auth = jasmine.createSpyObj('AuthService', ['addPermissions']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);
    router.parseUrl.and.returnValue(home);
    guard = new RoutePermissionsGuard(auth, permissions, router);
  });

  it('deja pasar las rutas sin permisos declarados', () => {
    expect(guard.canActivateChild(route())).toBeTrue();
    expect(auth.addPermissions).not.toHaveBeenCalled();
  });

  it('con alguno de los permisos pedidos deja pasar', () => {
    loaded = { view_invoice: {} };

    expect(guard.canActivateChild(route(['add_invoice', 'view_invoice']))).toBeTrue();
  });

  it('sin el permiso redirige al inicio', () => {
    loaded = { view_task: {} };

    expect(guard.canActivate(route(['view_invoice']))).toBe(home);
    expect(router.parseUrl).toHaveBeenCalledWith('/');
  });

  it('al recargar la página carga los permisos guardados antes de decidir', () => {
    auth.addPermissions.and.callFake(() => { loaded = { view_invoice: {} }; return null; });

    expect(guard.canActivateChild(route(['view_invoice']))).toBeTrue();
    expect(auth.addPermissions).toHaveBeenCalledTimes(1);
  });
});
