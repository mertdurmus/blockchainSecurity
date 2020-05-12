import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { user } from '../models/user';
import { Observable, throwError } from 'rxjs';
import {map, tap, catchError } from 'rxjs/operators';


export const TOKEN = 'token';
export const AUTHENTICATED_USER = 'authenticatedUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token1: any;
  token2;

  path = 'http://127.0.0.1:8000';


  constructor(private http: HttpClient) { }



  register(dataa: user): Observable<user> {
    const httpOptions = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json'
    })
   };
    return this.http.post<user>(this.path + '/userSave', dataa, httpOptions).pipe(
         tap(data => console.log(JSON.stringify(data))),
         catchError(this.handleError)
       );
     }

     loadToken() {
      this.token2 = localStorage.getItem('token1');
     }

       login(username, passwd) {
        return this.http.post<any>(
          `${this.path}/login`, {
          username,
          passwd
         }).pipe(
            map(
              data => {
                sessionStorage.setItem(AUTHENTICATED_USER, username);
                this.token1 = `${data.token}`;
                window.localStorage.removeItem('token1');
                window.localStorage.setItem('token1', this.token1);
                console.log(this.token1);
                sessionStorage.setItem(TOKEN, ` ${data.token}`);
                return data;
              }
            )
          );
     }





     getAuthenticatedUser() {
      return sessionStorage.getItem(AUTHENTICATED_USER);
    }

      getAuthenticatedToken() {
      // user boş değilse
      if (this.getAuthenticatedUser()) {
        return sessionStorage.getItem(TOKEN);
      }
    }


    // session storage da mevcut authenticatedUser varsa getir.
    isUserLoggedIn() {
      // tslint:disable-next-line:no-shadowed-variable
      const user = sessionStorage.getItem(AUTHENTICATED_USER);
      return !(user === null);
    }


    logout() {
      sessionStorage.removeItem(AUTHENTICATED_USER);
      sessionStorage.removeItem(TOKEN);

    }

     handleError(err: HttpErrorResponse) {
      let errorMessage = '';
      if (err.error instanceof ErrorEvent) {
     errorMessage = 'bir hata oluştu' + err.error.message;
     } else {
       errorMessage = 'sistemsel bir hata';
     }

      return throwError (errorMessage);
    }





}
