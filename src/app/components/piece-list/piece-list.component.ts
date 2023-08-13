import { Component } from '@angular/core';
import { PieceSelectionService } from '../../services/piece.selection.service';
import { MovesService } from 'src/app/services/moves.service';
import { Piece } from '../../models/piece-model';

@Component({
  selector: 'app-piece-list',
  templateUrl: './piece-list.component.html',
  styleUrls: ['./piece-list.component.css']
})
export class PieceListComponent {
  pieces: Piece[] = [];
  selectedPiece: string = '';
  selectedElement: any = null;
  

  constructor(
    private pieceSelectionService: PieceSelectionService,
    private movesService: MovesService  // Wstrzyknięcie serwisu MovesService
  ) {}

  ngOnInit(): void {
    this.movesService.getAvailablePieces().subscribe(data => {
        this.pieces = data;
        console.log("Otrzymane figury z API:", this.pieces);
    });
  }

  selectPiece(pieceName: string, event: any) {
    
    this.selectedPiece = pieceName;
    this.pieceSelectionService.selectedPiece = pieceName; 
    console.log('Figura została kliknięta:', pieceName);

    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }
  
    // Podświetl kliknięty element
    this.selectedElement = event.target.closest('.piece');
    this.selectedElement.classList.add('selected');

    //Zresetuj wartość From
    this.pieceSelectionService.lastSelectedSquare = null;
    this.pieceSelectionService.newPieceJustSelected.next(true);
  }
}
