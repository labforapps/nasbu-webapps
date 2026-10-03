import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/** Clave donde se guarda la ruta pedida antes de iniciar sesion (enlaces de notificaciones). */
export const RETURN_URL_KEY = 'nasbu_return_url';

/**
 * Solo deja entrar con sesion de Cognito. Sin sesion guarda la ruta pedida y manda al
 * login, que vuelve a ella al autenticarse: asi funcionan los enlaces de los emails.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.requireSession(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.requireSession(state.url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this.requireSession('/' + segments.map(segment => segment.path).join('/'));
  }

  private requireSession(requestedUrl: string): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((loggedIn: boolean) => {
        if (loggedIn) {
          return true;
        }
        sessionStorage.setItem(RETURN_URL_KEY, requestedUrl);
        return this.router.parseUrl('/signin');
      })
    );
  }
}

/**
 * Devuelve (y consume) la ruta guardada por el AuthGuard. Solo acepta rutas internas de
 * la aplicacion; cualquier otra cosa termina en el dashboard.
 */
export function consumeReturnUrl(fallback: string = '/dashboard'): string {
  const returnUrl = sessionStorage.getItem(RETURN_URL_KEY);
  sessionStorage.removeItem(RETURN_URL_KEY);
  const isInternal = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') &&
    !returnUrl.startsWith('/signin');
  return isInternal ? returnUrl as string : fallback;
}
