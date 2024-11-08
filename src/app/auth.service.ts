import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null = null;
  loginSuccess: Subject<User> = new Subject();
  logoutSuccess: Subject<any> = new Subject();
  constructor(private http: HttpClient, private router: Router) { }

  login(userName: string, password: string) {
    console.log("api:" + environment.apiUrl);
    return this.http.post<User>(environment.apiUrl + "/rest/auth/login", {userName: userName, password: password}).pipe(
      tap(user => {
        this.user = new User(user.id, user.name, user.token, user.expiration, user.expirationDuration)
        localStorage.setItem("user", JSON.stringify(user));
        this.loginSuccess.next(this.user);
        this.router.navigate(["/lists"]);
      }),
      catchError(error => AuthService.handleErrors(error))
    )
  }

  logout() : void {
    this.user = null;
    localStorage.removeItem("user");
    this.logoutSuccess.next(null);
  }

  getUser(): User | null{
    if (this.user) {
      return this.user;
    } else {
      return User.fromJSON(localStorage.getItem("user"));
    }
  }

  private static handleErrors(error: HttpErrorResponse) : Observable<any>{
    console.log(error);
    switch(error.status) { 
      case 404: { 
        throw "Not found.";
         break; 
      } 
      case 401: { 
        throw "Invalid username or password";
         break; 
      } 
      default: { 
         throw "Unknown Error."
         break; 
      } 
   } 
}

}
