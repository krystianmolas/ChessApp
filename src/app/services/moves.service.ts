import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Move } from '../models/move-model'; 
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovesService {

  private apiUrl = 'http://localhost:5154/moves'; 

  private movesUpdated = new Subject<void>();
  movesUpdated$ = this.movesUpdated.asObservable();

  constructor(private http: HttpClient) { }

  // Moves Get
  getMovesHistory(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError<any>('getMovesHistory'))
    );
  }
  getAvailablePieces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-pieces`);
  }
  // Moves Post
  addMove(move: Move): Observable<Move> {
    return this.http.post<Move>(this.apiUrl, move).pipe(
        tap(() => {
            this.movesUpdated.next();
        }),
        catchError(this.handleError<Move>('addMove'))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Logowanie błędu do konsoli
      return new Observable<T>(observer => {
        observer.error(`${operation} failed: ${error.message}`);
      });
    };
}
}
