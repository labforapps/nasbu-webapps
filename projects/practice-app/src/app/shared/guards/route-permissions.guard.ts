import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

import { AuthService } from '../../services/auth/auth.service';

/**
 * Exige los permisos declarados en `data.permissions.only` de la ruta (alcanza con uno).
 *
 * `NgxPermissionsGuard` no sirve solo: los permisos se cargan en ngx-permissions recién en el
 * `ngOnInit` del LayoutComponent, que corre después de los guards. Al recargar una página
 * protegida el servicio está vacío y el usuario terminaba en el inicio aunque tuviera
 * permiso. Este guard carga primero los permisos guardados en localStorage (NAS-092).
 *
 * Las rutas sin `data.permissions` quedan abiertas a cualquier usuario autenticado.
 */
@Injectable({ providedIn: 'root' })
export class RoutePermissionsGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private permissionsService: NgxPermissionsService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.check(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.check(route);
  }

  private check(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const config = route.data && route.data['permissions'];
    const required: string[] = (config && config.only) || [];
    if (!required.length) {
      return true;
    }

    if (Object.keys(this.permissionsService.getPermissions()).length === 0) {
      this.authService.addPermissions();
    }

    const granted = this.permissionsService.getPermissions();
    return required.some(permission => !!granted[permission])
      || this.router.parseUrl(config.redirectTo || '/');
  }
}
