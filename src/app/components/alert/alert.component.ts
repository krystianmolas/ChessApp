import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('alertAnimation', [
      state('in', style({ transform: 'translate(-50%, -50%)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translate(-50%, -60%)', opacity: 0 }),
        animate('1000ms ease-out')
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({ transform: 'translate(-50%, -40%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AlertComponent implements OnInit {
  message: string | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void { 
    this.alertService.alert$.subscribe(message => {
      console.log("Otrzymano komunikat:", message);
      this.message = message;
      setTimeout(() => this.message = null, 3000); // Ukryj alert po 3 sekundach
    }); 
  }
}