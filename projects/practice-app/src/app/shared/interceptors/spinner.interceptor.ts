import { Injectable } from '@angular/core';
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

  constructor(private spinner: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const shouldSkipSpinner = this.excludedUrls.some(url => req.url.includes(url));

    if (!shouldSkipSpinner) {
      this.spinner.show();
    }


    return next.handle(req).pipe(
      finalize(() => {
        if (!shouldSkipSpinner) {
          this.spinner.hide();
        }
      })
    );
  }
}
