import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import {  Injectable } from '@angular/core';
import { User } from './user.model';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user: User | null = this.auth.getUser();
    console.log("user:" +  JSON.stringify(user));

    let requestToSend = req;
    if (user && user.getToken()) {
      let token = user.getToken();
        console.log("token:" + token);
        let newRequest = req.clone({
          setHeaders: {
            'authorization': token!
          }})
      console.log(JSON.stringify(newRequest.headers.get("authorization")));
      requestToSend = newRequest;
    }

    return next.handle(requestToSend).pipe(catchError(
      (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.Forbidden) {
          this.auth.logout(); //TODO: ez nem olyan szep, meg kene valahogy kulonboztetni a logged out allapotot a nincs joga allapottol majd a jovoben
          this.router.navigate(['/login']);
        }
        return next.handle(requestToSend);
      }
    ));
  }
}