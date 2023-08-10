import { TestBed } from '@angular/core/testing';

import { PieceSelectionService } from './piece.selection.service';

describe('PieceSelectionService', () => {
  let service: PieceSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
