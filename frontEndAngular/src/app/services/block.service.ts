import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { block } from '../models/block';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { transaction } from '../models/transaction';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  mesaj;
  constructor(private http: HttpClient, private service: UserService) { }


  path = 'http://127.0.0.1:5000';

  getBlocks(): Observable<block[]> {

    return this.http.get<block[]>(this.path + '/chain_1').pipe(
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
       console.log(this.service.token2);
     }

      return throwError (errorMessage);
    }

    setTransaction(dataa: transaction): Observable<transaction> {
      const httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json'
            })
     };
      return this.http.post<transaction>(this.path + '/new_transaction', dataa, httpOptions).pipe(
           tap(data => console.log(JSON.stringify(data))),
           catchError(this.handleError)
         );
       }



       getMine(): Observable<string>{
        this.service.loadToken();
        console.log(this.service.token2 );
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json',
          Authorization: this.service.token2 })
        };

        return this.http.get<string>(this.path + '/mine', httpOptions).pipe(
          tap(data => console.log(data)
          ),
          catchError(this.handleError)

        );
      }
  }

