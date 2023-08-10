import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Move } from '../models/move-model'; 
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MovesService {

  private apiUrl = 'http://localhost:5154/moves'; 

  constructor(private http: HttpClient) { }
  // Moves Get
  getMovesHistory(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  // Moves Post
  addMove(move: Move): Observable<Move> {
    return this.http.post<Move>(this.apiUrl, move).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    console.error('Wystąpił błąd:', error);
    return new Observable<Move>(observer => {
        observer.error(error.message || 'Wystąpił błąd podczas komunikacji z serwerem');
    });
  }
}