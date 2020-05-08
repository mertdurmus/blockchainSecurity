import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { user } from '../models/user';
import { Observable, throwError } from 'rxjs';
import {map, tap, catchError } from 'rxjs/operators'


export const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token1: any;
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



       login(username, passwd) {
        return this.http.post<any>(
          `${this.path}/login`, {
          username,
          passwd
         }).pipe(
            map(
              data => {
      
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
