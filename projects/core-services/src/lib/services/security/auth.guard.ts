import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.validate(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.validate(childRoute, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.validate(null, null);
  }

  private validate(route: ActivatedRouteSnapshot | null,
                   state: RouterStateSnapshot | null):
                   Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService
                 .isLoggedIn()
                 .pipe(
                    switchMap((isLoggedIn: boolean) => {

                          console.log('isLoggedIn: ', isLoggedIn);
                          if (isLoggedIn) {
                              return of(isLoggedIn);
                          }

                          const urlTree = this.router.createUrlTree(['/signin']);
                          return of(urlTree);
                    }),
                    catchError(() => {
                        const urlTree = this.router.createUrlTree(['/signin']);
                        return of(urlTree);
                    })
                 );
  }

}
