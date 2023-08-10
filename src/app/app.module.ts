import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieceListComponent } from './components/piece-list/piece-list.component';
import { ChessboardComponent } from './components/chessboard/chessboard.component';
import { MovesListComponent } from './components/moves-list/moves-list.component';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  declarations: [
    AppComponent,
    PieceListComponent,
    ChessboardComponent,
    MovesListComponent,
    AlertComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
