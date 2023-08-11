import { Component, OnInit, OnDestroy } from '@angular/core';
import { PieceSelectionService } from '../../services/piece.selection.service';
import { Subscription, catchError } from 'rxjs';
import { MovesService } from '../../services/moves.service';
import { AlertService } from '../../services/alert.service';

interface Cell {
  square: string;
  piece?: {
      name: string;
      imagePath: string;
  };
}

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit, OnDestroy {
  
  board: Cell[][] = [];
  selectedSquare: string | null = null;
  lastSelectedSquare: string | null = null;
  private subscription: Subscription = new Subscription();
  columnLabels: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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
      const row: Cell[] = [];
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
    let fromSquare = this.lastSelectedSquare || "start";

    if (!selectedPiece && this.lastSelectedSquare && this.lastSelectedSquare !== square) {
      for (let row of this.board) {
        for (let cell of row) {
          if (cell.square === this.lastSelectedSquare && cell.piece) {
            selectedPiece = cell.piece.name;
            cell.piece = undefined;
          }
        }
      }
    }
  
    if (selectedPiece && square !== this.lastSelectedSquare) {
      for (let row of this.board) {
        for (let cell of row) {
          if (cell.square === square) {
            cell.piece = {
                name: selectedPiece,
                imagePath: `http://localhost:5154/images/${selectedPiece.toLowerCase()}.png`
            };
            this.pieceSelectionService.selectedPiece = null;
            this.lastSelectedSquare = square;
  
            // Zapisz ruch w bazie danych
            const move = {
              Piece: selectedPiece,
              From: fromSquare,
              To: square
            };
            this.movesService.addMove(move).subscribe(
              response => {
                console.log('Ruch zapisany w bazie danych:', response);
              },
              error => {
                this.alertService.showAlert('Twoja wiadomość tutaj');
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
    this.lastSelectedSquare = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
