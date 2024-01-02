import { TestBed } from '@angular/core/testing';

import { PlanilhaanualService } from './planilhaanual.service';

describe('PlanilhaanualService', () => {
  let service: PlanilhaanualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanilhaanualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
