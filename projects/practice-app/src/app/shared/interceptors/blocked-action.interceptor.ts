import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

/** Header para que una pantalla que ya muestra su propio error evite el toast global. */
export const SKIP_BLOCKED_ACTION_TOAST = 'X-Skip-Blocked-Toast';

/** Causas que el backend informa en el campo `code` de un 403 (NAS-031). */
export const BLOCKED_ACTION_CODES = ['permission_denied', 'plan_feature_missing', 'plan_limit_reached'];

/**
 * Muestra un mensaje uniforme cuando el backend rechaza una acción por permiso,
 * por plan o por límite de recursos.
 *
 * Solo reacciona a 403 con un `code` conocido: el 403 de una suscripción con el
 * pago pendiente no trae `code` y lo sigue manejando el AuthInterceptor.
 * El error se re-lanza siempre para no cambiar el flujo de quien hizo la petición.
 */
@Injectable()
export class BlockedActionInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService,
              private translate: TranslateService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipToast = req.headers.has(SKIP_BLOCKED_ACTION_TOAST);
    const request = skipToast ? req.clone({ headers: req.headers.delete(SKIP_BLOCKED_ACTION_TOAST) }) : req;

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const code = this.getBlockedCode(error);

        if (code && !skipToast) {
          this.toastr.warning(
            this.getMessage(code, error.error),
            this.translate.instant('errorMessages.blockedAction.title')
          );
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * Con `feature_code` el mensaje nombra la función ("Tu plan actual no incluye la firma
   * electrónica.") y, en un límite, la cantidad contratada ("…límite de 3 usuarios…").
   * Si no hay texto para esa función, o el límite llega sin cantidad, se usa el genérico.
   */
  private getMessage(code: string, body: any): string {
    const generic = `errorMessages.blockedAction.${code}`;
    const featureCode = body && body.feature_code;
    const variant = code === 'plan_feature_missing' ? 'missing' : code === 'plan_limit_reached' ? 'limit' : null;

    if (!featureCode || !variant) {
      return this.translate.instant(generic);
    }

    const contracted = body.contracted;
    const key = `errorMessages.blockedAction.features.${featureCode}.${variant}`;
    const message = this.translate.instant(key, { contracted });
    const missingTranslation = message === key;
    const missingCount = variant === 'limit' && (contracted === null || contracted === undefined)
      && message.includes('{{');

    return missingTranslation || missingCount ? this.translate.instant(generic) : message;
  }

  private getBlockedCode(error: HttpErrorResponse): string | null {
    if (!(error instanceof HttpErrorResponse) || error.status !== 403) {
      return null;
    }

    const code = error.error && error.error.code;
    return BLOCKED_ACTION_CODES.includes(code) ? code : null;
  }
}
