import { describe, it, expect } from 'vitest';
import {
  calculateEMI,
  evaluateAffordability,
  calculateFinancialSummary,
  calculateBudgetPerformance,
} from '../src/lib/calculations';
import { Transaction, Budget } from '../src/types';

describe('calculateEMI', () => {
  it('correctly calculates monthly reducing-balance EMI for standard business loan', () => {
    // ₹1,00,000 loan at 12% annual interest for 12 months
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    });

    // Reducing balance EMI for 1L @ 12% 1yr is ₹8,885
    expect(result.monthlyEmi).toBe(8885);
    expect(result.principal).toBe(100000);
    expect(result.schedule.length).toBe(12);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalRepayment).toBe(result.principal + result.totalInterest);
    // Ending balance on last month should be 0
    expect(result.schedule[11].endingBalance).toBe(0);
  });

  it('handles 0% zero-interest promotional loans correctly', () => {
    const result = calculateEMI({
      principal: 60000,
      annualRate: 0,
      tenureMonths: 12,
    });

    expect(result.monthlyEmi).toBe(5000);
    expect(result.totalInterest).toBe(0);
    expect(result.totalRepayment).toBe(60000);
    expect(result.schedule.length).toBe(12);
    expect(result.schedule[11].endingBalance).toBe(0);
  });

  it('handles invalid inputs and zero tenure gracefully', () => {
    const result = calculateEMI({
      principal: 0,
      annualRate: 10,
      tenureMonths: 0,
    });

    expect(result.monthlyEmi).toBe(0);
    expect(result.totalRepayment).toBe(0);
    expect(result.schedule).toEqual([]);
  });
});

describe('evaluateAffordability', () => {
  it('identifies comfortable loan scenario when EMI is under 30% of surplus', () => {
    // Monthly income ₹1,50,000, expenses ₹1,00,000 => surplus ₹50,000. EMI = ₹10,000 (20%)
    const evaluation = evaluateAffordability(150000, 100000, 10000);
    expect(evaluation.status).toBe('comfortable');
    expect(evaluation.monthlySurplus).toBe(50000);
    expect(evaluation.emiToSurplusRatio).toBe(20);
  });

  it('identifies moderate burden when EMI is between 30% and 60% of surplus', () => {
    // Surplus ₹50,000, EMI = ₹25,000 (50%)
    const evaluation = evaluateAffordability(150000, 100000, 25000);
    expect(evaluation.status).toBe('moderate');
    expect(evaluation.emiToSurplusRatio).toBe(50);
  });

  it('flags high risk when EMI exceeds 60% of monthly surplus', () => {
    // Surplus ₹50,000, EMI = ₹40,000 (80%)
    const evaluation = evaluateAffordability(150000, 100000, 40000);
    expect(evaluation.status).toBe('high_risk');
  });

  it('flags deficit when business expenses match or exceed revenues', () => {
    const evaluation = evaluateAffordability(80000, 95000, 5000);
    expect(evaluation.status).toBe('deficit');
    expect(evaluation.monthlySurplus).toBe(-15000);
  });
});

describe('calculateFinancialSummary', () => {
  it('correctly calculates total income, expenses, and net profit', () => {
    const testTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'u1',
        description: 'Retail sales',
        amount: 25000,
        type: 'income',
        category: 'product_sales',
        date: '2026-10-01',
        createdAt: '2026-10-01',
      },
      {
        id: '2',
        userId: 'u1',
        description: 'Wholesale inventory',
        amount: 15000,
        type: 'expense',
        category: 'inventory',
        date: '2026-10-02',
        createdAt: '2026-10-02',
      },
      {
        id: '3',
        userId: 'u1',
        description: 'Shop rent',
        amount: 5000,
        type: 'expense',
        category: 'rent',
        date: '2026-10-03',
        createdAt: '2026-10-03',
      },
    ];

    const summary = calculateFinancialSummary(testTransactions);
    expect(summary.totalIncome).toBe(25000);
    expect(summary.totalExpenses).toBe(20000);
    expect(summary.netProfit).toBe(5000);
    expect(summary.profitMargin).toBe(20.0);
    expect(summary.categoryTotals['inventory']).toBe(15000);
    expect(summary.categoryTotals['rent']).toBe(5000);
  });

  it('handles negative net profit (net loss) when expenses exceed income', () => {
    const lossTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'u1',
        description: 'Sales',
        amount: 10000,
        type: 'income',
        category: 'product_sales',
        date: '2026-10-01',
        createdAt: '2026-10-01',
      },
      {
        id: '2',
        userId: 'u1',
        description: 'Heavy machinery repair',
        amount: 25000,
        type: 'expense',
        category: 'equipment',
        date: '2026-10-02',
        createdAt: '2026-10-02',
      },
    ];

    const summary = calculateFinancialSummary(lossTransactions);
    expect(summary.netProfit).toBe(-15000);
    expect(summary.totalIncome).toBe(10000);
    expect(summary.totalExpenses).toBe(25000);
  });
});

describe('calculateBudgetPerformance', () => {
  it('correctly compares budget limits against actual expenses', () => {
    const mockBudget: Budget = {
      id: 'b1',
      userId: 'u1',
      month: '2026-10',
      expectedIncome: 50000,
      targetSavings: 10000,
      limits: {
        inventory: 20000,
        raw_materials: 0,
        rent: 8000,
        transportation: 3000,
        utilities: 2000,
        wages: 5000,
        marketing: 1000,
        equipment: 2000,
        other_expenses: 1000,
      },
      updatedAt: '2026-10-01',
    };

    const actualTxs: Transaction[] = [
      {
        id: '1',
        userId: 'u1',
        description: 'Inventory bulk',
        amount: 22000, // Exceeds limit 20000
        type: 'expense',
        category: 'inventory',
        date: '2026-10-05',
        createdAt: '2026-10-05',
      },
      {
        id: '2',
        userId: 'u1',
        description: 'Shop rent',
        amount: 8000,
        type: 'expense',
        category: 'rent',
        date: '2026-10-05',
        createdAt: '2026-10-05',
      },
      {
        id: '3',
        userId: 'u1',
        description: 'Revenue sales',
        amount: 45000,
        type: 'income',
        category: 'product_sales',
        date: '2026-10-06',
        createdAt: '2026-10-06',
      },
    ];

    const perf = calculateBudgetPerformance(mockBudget, actualTxs);
    expect(perf.actualTotalExpense).toBe(30000);
    expect(perf.actualTotalIncome).toBe(45000);

    const inventoryStatus = perf.categoryStatus.find((c) => c.category === 'inventory');
    expect(inventoryStatus?.isExceeded).toBe(true);
    expect(inventoryStatus?.spent).toBe(22000);

    const rentStatus = perf.categoryStatus.find((c) => c.category === 'rent');
    expect(rentStatus?.isExceeded).toBe(false);
    expect(rentStatus?.remaining).toBe(0);
  });
});
