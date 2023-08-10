import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceListComponent } from './piece-list.component';

describe('PieceListComponent', () => {
  let component: PieceListComponent;
  let fixture: ComponentFixture<PieceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieceListComponent]
    });
    fixture = TestBed.createComponent(PieceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
