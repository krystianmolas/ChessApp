import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PieceSelectionService {
  private _selectedPiece = new BehaviorSubject<string | null>(null);
  selectedPiece$ = this._selectedPiece.asObservable();
  public lastSelectedSquare: string | null = null;

  
  set selectedPiece(piece: string | null) {
    this._selectedPiece.next(piece);
  }

  get selectedPiece(): string | null {
    return this._selectedPiece.value;
  }
}
