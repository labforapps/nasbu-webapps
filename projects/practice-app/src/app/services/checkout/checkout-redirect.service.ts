import { Injectable } from '@angular/core';

/**
 * Saca al usuario de la SPA hacia el checkout de PlaceToPay.
 *
 * Es una sola linea, pero envuelta en un servicio: `window.location.href` recarga la
 * pagina de verdad, lo que en Karma tumba al runner ("Some of your tests did a full page
 * reload!"). Con esto los tests pueden espiar el redirect en vez de sufrirlo.
 */
@Injectable({
  providedIn: 'root'
})
export class CheckoutRedirectService {

  goTo(url: string): void {
    window.location.href = url;
  }
}
