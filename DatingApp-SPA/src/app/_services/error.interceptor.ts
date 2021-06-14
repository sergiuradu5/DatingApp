import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(error => {
            if(error.status == 401) {
                return throwError(error.statusText);
            }
            if (error.status == 400) {
                return throwError(error)
            }
            if(error instanceof HttpErrorResponse)
            {
                // These are the 500 Internal Errors
                const applicationError = error.headers.get('Application-Error');
                if(applicationError) {
                    return throwError(applicationError);
                }

                // Model State Errors (e.g. Password too short)
                const serverError = error.error;
                let modalStateErrors = '';
                if (serverError.errors && typeof serverError.errors == 'object') { 
                    for (const key in serverError.errors) {
                        if(serverError.errors[key]) {
                            modalStateErrors += serverError.errors[key] + '\n';
                        }
                    }
                }
                return throwError(modalStateErrors || serverError ||  'Server Error');

            }
        })
    )
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}
