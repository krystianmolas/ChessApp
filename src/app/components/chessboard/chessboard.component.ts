import { Component, OnInit, OnDestroy } from '@angular/core';
import { PieceSelectionService } from '../../services/piece.selection.service';
import { Subscription, catchError } from 'rxjs';
import { MovesService } from '../../services/moves.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit, OnDestroy {
  
  board: { square: string, piece?: string }[][] = [];
  selectedSquare: string | null = null;
  lastSelectedSquare: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private pieceSelectionService: PieceSelectionService,
    private movesService: MovesService,
    private alertService: AlertService,
    ) {}

  ngOnInit(): void {
    this.initializeBoard();

    this.subscription = this.pieceSelectionService.selectedPiece$.subscribe(
      (newPiece) => {
        if (newPiece && newPiece !== this.lastSelectedSquare) {
          this.resetBoardAssignments();
        }
      }
    );
  }

  initializeBoard(): void {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let i = 8; i >= 1; i--) {
      const row: { square: string, piece?: string }[] = [];
      for (let j = 0; j < 8; j++) {
        row.push({ square: letters[j] + i });
      }
      this.board.push(row);
    }
  }

  isBlack(row: number, col: number): boolean {
    return (row + col) % 2 !== 0;
  }

  selectSquare(square: string): void {
    let selectedPiece = this.pieceSelectionService.selectedPiece;
  
    if (!selectedPiece && this.lastSelectedSquare) {
      for (let row of this.board) {
        for (let cell of row) {
          if (cell.square === this.lastSelectedSquare && cell.piece) {
            selectedPiece = cell.piece;
            cell.piece = undefined;
          }
        }
      }
    }
  
    if (selectedPiece) {
      for (let row of this.board) {
        for (let cell of row) {
          if (cell.square === square) {
            cell.piece = selectedPiece;
            this.pieceSelectionService.selectedPiece = null;
            this.lastSelectedSquare = square;
            
            // Zapisz ruch w bazie danych
          const move = {
            Piece: selectedPiece,
            From: this.lastSelectedSquare,
            To: square
          };
          this.movesService.addMove(move).pipe(
            catchError(error => {
              console.log("Błąd podczas komunikacji z API:", error);
              this.alertService.showAlert('Błąd podczas zapisywania ruchu w bazie danych.');
              throw error; 
            })
          ).subscribe(
            response => {
              console.log('Ruch zapisany w bazie danych:', response);
            }
          );
          break;
          }
        }
      }
    }
  }

  resetBoardAssignments(): void {
    for (let row of this.board) {
      for (let cell of row) {
        cell.piece = undefined;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}