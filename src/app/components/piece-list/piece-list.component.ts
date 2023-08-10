import { Component } from '@angular/core';
import { PieceSelectionService } from '../../services/piece.selection.service';

@Component({
  selector: 'app-piece-list',
  templateUrl: './piece-list.component.html',
  styleUrls: ['./piece-list.component.css']
})
export class PieceListComponent {

  selectedPiece: string = '';
  selectedElement: any = null;
  constructor(private pieceSelectionService: PieceSelectionService) {}

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


  }


  

}