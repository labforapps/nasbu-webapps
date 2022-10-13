import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from '../application/global.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(private authService: AuthService,
              private globalService: GlobalService,
              private router: Router) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
  //   console.log('Intercepting request:', req);
  //   const clonedRequest = this.authenticateReq(req);
  //   return next.handle(clonedRequest).pipe(
  //       catchError(error => {
  //         if (error.status === 401) {
  //           this.router.navigate([ 'signin' ]);
  //           return throwError(error);
  //         }
  //         return throwError(error);
  //       })
  //   );
  // }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.globalService.isLoading$.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const clonedRequest$ = this.authenticateReq(req);
      return clonedRequest$.pipe(
          switchMap((clonedRequest: HttpRequest<any>) => {
              this.requests.push(clonedRequest);
              console.log("No of requests--->" + this.requests.length);
              this.globalService.isLoading$.next(true);
              return Observable.create((observer: any) => {
                  const subscription = next.handle(clonedRequest).pipe(
                    retry(2),
                    catchError(error => {
                      if (error.status === 401 || error.status === 403) {
                          this.authService.signOut();
                          this.router.navigate([ 'signin' ]);
                          return throwError(error);
                      }
                      return throwError(error);
                    })
                ).subscribe(
                      event => {
                        console.log('Event: ', event);
                        if (event instanceof HttpResponse) {
                          this.removeRequest(clonedRequest);
                          observer.next(event);
                        }
                      },
                      err => {
                        //this.emitGlobalError(err, clonedRequest);
                        this.removeRequest(clonedRequest);
                        observer.error(err);
                      },
                      () => {
                        this.removeRequest(clonedRequest);
                        observer.complete();
                      });
                  // remove request from queue when cancelled
                  return () => {
                    this.removeRequest(clonedRequest);
                    subscription.unsubscribe();
                  };
              }) as Observable<HttpEvent<any>>;
          })
      );

  }

  authenticateReq(req: HttpRequest<any>): Observable<HttpRequest<any>> {
    if (req.url.toString().indexOf('/api/token') < 0
        && req.url.toString().indexOf('/oauth/access_token') < 0
        && req.url.toString().indexOf('password_recovery_request') < 0
        && !req.url.toString().endsWith('/api/inventory/items/availables_to_order/')
        && !req.url.toString().endsWith('/search_by_slug/')
        && !req.url.toString().endsWith('/available_items_suggestions/')
        && req.url.toString().indexOf('validate_password_recovery_token') < 0
        && req.url.toString().indexOf('catalog/customers/search_by_phone_number') < 0
        && req.url.toString().indexOf('common/payment_types/') < 0
        && req.url.toString().indexOf('recover_password') < 0
        && req.url.toString().indexOf('/api/catalog/cities/') < 0
        && req.url.toString().indexOf('/api/catalog/stores/') < 0
        && req.url.toString().indexOf('/api/catalog/delivery_zones/') < 0
        && ! this.isCreateCustomerOrAddressRequest(req)
        && ! this.isCreatedOrderRequest(req)) {
          return this.authService
              .getAccessToken()
              .pipe(
                switchMap((accessToken: string) => {
                  const newRequest = req.clone({headers : req.headers.set('Authorization', 'Bearer ' + accessToken)});
                  return of(newRequest);
              }));
    } else {
      return of(req);
    }
  }

  isCreateCustomerOrAddressRequest(req: HttpRequest<any>): boolean {
    return req.method.toLowerCase() === 'post' &&
           (req.url.toString().indexOf('/catalog/customers/') > 0 ||
            req.url.toString().indexOf('/catalog/addresses/') > 0)
  }

  isCreatedOrderRequest(req: HttpRequest<any>): boolean {
      return req.method.toLowerCase() === 'post' &&
             req.url.toString().indexOf('/orders/requests/') > 0
  }
}
