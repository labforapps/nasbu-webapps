import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

export type CheckoutMode = 'lightbox' | 'redirect';

@Injectable({
  providedIn: 'root'
})
export class CheckoutModeService {

  constructor(private platform: Platform) { }

  /**
   * Elige como llevar al usuario al checkout de PlaceToPay.
   *
   * El lightbox se abre en un iframe, y las politicas de cookies de terceros de
   * WebKit lo rompen: en Safari y en moviles hay que mandarlo por redirect.
   *
   * `override` permite forzar el modo desde la URL (?checkout=redirect) para poder
   * ejercitar los dos caminos sin tener que cambiar de navegador.
   */
  detect(override?: string): CheckoutMode {
    if (override === 'lightbox' || override === 'redirect') {
      return override;
    }

    const isMobile = this.platform.IOS || this.platform.ANDROID;

    return (isMobile || this.platform.SAFARI) ? 'redirect' : 'lightbox';
  }
}
