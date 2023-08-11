import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovesService } from '../../services/moves.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moves-list',
  templateUrl: './moves-list.component.html',
  styleUrls: ['./moves-list.component.css']
})
export class MovesListComponent implements OnInit, OnDestroy {
  moves: any[] = [];
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private movesService: MovesService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.fetchMoves();

    const movesUpdateSubscription = this.movesService.movesUpdated$.subscribe(() => {
        this.fetchMoves();
    });

    this.subscriptions.add(movesUpdateSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fetchMoves(): void {
    this.movesService.getMovesHistory().subscribe(
        data => {
            this.moves = data;
        },
        error => {
            this.alertService.showAlert('Nie udało się pobrać historii ruchów.');
        }
    );
  }
}
