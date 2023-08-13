import { Component, OnInit, OnDestroy } from '@angular/core';
import { PieceSelectionService } from '../../services/piece.selection.service';
import { Subscription } from 'rxjs';
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
  styleUrls: ['./chessboard.component.css'],
})
export class ChessboardComponent implements OnInit, OnDestroy {
  board: Cell[][] = [];
  selectedSquare: string | null = null;
  lastSelectedSquare: string | null = null;
  private subscription: Subscription = new Subscription();
  columnLabels: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  highlightedSquares: string[] = [];

  constructor(
    private pieceSelectionService: PieceSelectionService,
    private movesService: MovesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeBoard();

    this.subscription.add(
      this.pieceSelectionService.selectedPiece$.subscribe(
        (newPiece) => {
          console.log(
            'Subscribed value of selectedPiece in ChessboardComponent:',
            newPiece
          );
          if (newPiece && newPiece !== this.lastSelectedSquare) {
            this.resetBoardAssignments();
          }
        }
      )
    );

    // Dodajemy nową subskrypcję
    this.subscription.add(
      this.pieceSelectionService.newPieceJustSelected.subscribe(justSelected => {
        if (justSelected) {
          this.highlightedSquares = [];
          this.pieceSelectionService.newPieceJustSelected.next(false); // Resetuj wartość
        }
      })
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
    console.log(`Wybrano pole: ${square}`);
    let selectedPiece = this.pieceSelectionService.selectedPiece;
    console.log(`Wybrana figura: ${selectedPiece}`);

    // Jeśli figura jest już wybrana
    if (selectedPiece) {
      const move = {
        Piece: selectedPiece,
        From: this.lastSelectedSquare || 'start',
        To: square,
      };

      this.movesService.addMove(move).subscribe(
        (response) => {
          console.log('Ruch zapisany w bazie danych:', response);
          this.updateBoardWithMove(selectedPiece!, square);
          this.getAvailableMovesForPiece(selectedPiece!, square);
        },
        (error) => {
          this.alertService.showAlert('Nieprawidłowy ruch!');
          if (this.lastSelectedSquare && selectedPiece) {
            this.updateBoardWithMove(selectedPiece!, this.lastSelectedSquare);
          }
        }
      );
    } else {
      // Jeśli figura nie jest wybrana, ale jest już na planszy
      for (let row of this.board) {
        for (let cell of row) {
          if (cell.square === square && cell.piece) {
            this.getAvailableMovesForPiece(cell.piece.name, square);
            return;
          }
        }
      }
    }
  }

  updateBoardWithMove(piece: string, targetSquare: string): void {
    for (let row of this.board) {
      for (let cell of row) {
        if (cell.square === targetSquare) {
          this.resetBoardAssignments();
          cell.piece = {
            name: piece,
            imagePath: `http://localhost:5154/images/${piece.toLowerCase()}.png`,
          };
          this.lastSelectedSquare = targetSquare;
          break;
        }
      }
    }
  }

  getAvailableMovesForPiece(piece: string, position: string): void {
    this.movesService.getValidMoves(piece, position).subscribe((moves) => {
      this.highlightedSquares = []; // Czyszczenie listy przed aktualizacją
      this.highlightedSquares = moves;
    });
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
