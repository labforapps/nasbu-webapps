import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserInfo } from 'core-models';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * This' in case the user is already logged in, then permissions will be updated in localStorage, 
 * on method fetchUserInfo, jus in case any group is edited.
 * @export
 * @class PermissionsResolver
 * @implements {Resolve<UserInfo>}
 */
@Injectable({providedIn: 'root'})
export class PermissionsResolver implements Resolve<string[]>{
  constructor(private authService: AuthService){}
  resolve(route: ActivatedRouteSnapshot): Observable<string[]> {
    // Los enlaces de las notificaciones traen ?ssid= para abrirse en la suscripcion correcta.
    const subscriptionId = route.queryParamMap.get('ssid');
    return this.authService.fetchUserInfo().pipe(
      tap(() => {
        if (subscriptionId) {
          this.authService.selectSubscription(subscriptionId);
        }
      }),
      map((userInfo: UserInfo) => this.authService.getAllPermisions(userInfo))
    );
  }
}