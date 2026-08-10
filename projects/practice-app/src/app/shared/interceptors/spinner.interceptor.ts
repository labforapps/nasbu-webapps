import { Injectable, NgZone } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  private excludedUrls: string[] = [
    '/practice/case_files_notes/'
  ];

  private activeRequests = 0;
  private hideTimeout: any = null;

  /**
   * Margen antes de apagar el spinner. Absorbe las peticiones encadenadas
   * (una respuesta que en su subscribe dispara otra) y el salto del resolver
   * al ngOnInit de la página, para que la pantalla no quede un momento en blanco.
   */
  private readonly HIDE_GRACE_MS = 150;

  constructor(private spinner: NgxSpinnerService,
              private zone: NgZone) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const shouldSkipSpinner = this.excludedUrls.some(url => req.url.includes(url));

    if (shouldSkipSpinner) return next.handle(req);

    this.onRequestStart();

    return next.handle(req).pipe(
      finalize(() => this.onRequestEnd())
    );
  }

  private onRequestStart(){
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.activeRequests === 0) this.spinner.show();

    this.activeRequests++;
  }

  private onRequestEnd(){
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    if (this.activeRequests > 0) return;

    this.zone.runOutsideAngular(() => {
      this.hideTimeout = setTimeout(() => {
        this.hideTimeout = null;
        if (this.activeRequests === 0) this.zone.run(() => this.spinner.hide());
      }, this.HIDE_GRACE_MS);
    });
  }
}
