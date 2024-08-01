import { TestBed } from '@angular/core/testing';

import { IncomeExpenseSummaryService } from './income-expense-summary.service';

describe('IncomeExpenseSummaryService', () => {
  let service: IncomeExpenseSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeExpenseSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
