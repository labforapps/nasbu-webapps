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
            this.translate.instant(`errorMessages.blockedAction.${code}`),
            this.translate.instant('errorMessages.blockedAction.title')
          );
        }

        return throwError(() => error);
      })
    );
  }

  private getBlockedCode(error: HttpErrorResponse): string | null {
    if (!(error instanceof HttpErrorResponse) || error.status !== 403) {
      return null;
    }

    const code = error.error && error.error.code;
    return BLOCKED_ACTION_CODES.includes(code) ? code : null;
  }
}
