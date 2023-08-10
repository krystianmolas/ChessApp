import { Component, OnInit } from '@angular/core';
import { MovesService } from '../../services/moves.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-moves-list',
  templateUrl: './moves-list.component.html',
  styleUrls: ['./moves-list.component.css']
})
export class MovesListComponent implements OnInit {
  moves: any[] = [];

  constructor(
    private movesService: MovesService,
    private alertService: AlertService,
    ) {}

    ngOnInit(): void {
      this.movesService.getMovesHistory().subscribe({
        next: data => {
          this.moves = data;
        },
        error: error => {
          console.error("Wystąpił błąd podczas pobierania historii ruchów:", error);
          this.alertService.showAlert('Nie udało się pobrać historii ruchów.');
        }
      });
  }
}
