import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenseSummaryComponent } from './income-expense-summary.component';

describe('IncomeExpenseSummaryComponent', () => {
  let component: IncomeExpenseSummaryComponent;
  let fixture: ComponentFixture<IncomeExpenseSummaryComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [IncomeExpenseSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeExpenseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
