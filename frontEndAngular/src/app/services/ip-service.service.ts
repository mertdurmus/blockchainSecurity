import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  constructor(private http: HttpClient, private userservice: UserService) { }

  path = 'http://127.0.0.1:8000';
  pathIp = 'https://api.ipify.org?format=json';

  getIPAddress() {
    return this.http.get(this.pathIp);
  }


  setİpAdress(username: any, ipAddress: any): Observable<any> {
   // this.userservice.loadToken();
    const httpOptions = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json'
    })
   };
    return this.http.post<any>(this.path + '/userIp', {username, ipAddress}, httpOptions).pipe(
         tap(data => console.log(JSON.stringify(data))),
         catchError(this.handleError)
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
