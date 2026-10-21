import {
  LoanCalculationInput,
  LoanCalculationResult,
  AmortizationRow,
  Transaction,
  Budget,
  ExpenseCategory,
} from '../types';

/**
 * Standard reducing-balance EMI Calculator
 * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * r = monthly interest rate (annualRate / (12 * 100))
 * n = tenure in months
 */
export function calculateEMI(input: LoanCalculationInput): LoanCalculationResult {
  const { principal, annualRate, tenureMonths } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalRepayment: 0,
      totalInterest: 0,
      schedule: [],
      principal: Math.max(0, principal),
      annualRate: Math.max(0, annualRate),
      tenureMonths: Math.max(1, tenureMonths),
    };
  }

  // Edge case: 0% interest
  if (annualRate <= 0) {
    const monthlyEmi = Math.round(principal / tenureMonths);
    const schedule: AmortizationRow[] = [];
    let currentBalance = principal;

    for (let month = 1; month <= tenureMonths; month++) {
      const principalPaid = month === tenureMonths ? currentBalance : monthlyEmi;
      const endingBalance = Math.max(0, currentBalance - principalPaid);

      schedule.push({
        month,
        startingBalance: currentBalance,
        emi: principalPaid,
        principalPaid,
        interestPaid: 0,
        endingBalance,
      });

      currentBalance = endingBalance;
    }

    return {
      monthlyEmi,
      totalRepayment: principal,
      totalInterest: 0,
      schedule,
      principal,
      annualRate: 0,
      tenureMonths,
    };
  }

  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emiFloat = (principal * monthlyRate * factor) / (factor - 1);
  const monthlyEmi = Math.round(emiFloat);

  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = Math.round(currentBalance * monthlyRate);
    let principalPaid = monthlyEmi - interestPaid;

    if (month === tenureMonths || currentBalance - principalPaid < 0) {
      principalPaid = currentBalance;
    }

    const endingBalance = Math.max(0, currentBalance - principalPaid);
    totalInterest += interestPaid;

    schedule.push({
      month,
      startingBalance: currentBalance,
      emi: principalPaid + interestPaid,
      principalPaid,
      interestPaid,
      endingBalance,
    });

    currentBalance = endingBalance;
    if (currentBalance <= 0) break;
  }

  const totalRepayment = principal + totalInterest;

  return {
    monthlyEmi,
    totalRepayment,
    totalInterest,
    schedule,
    principal,
    annualRate,
    tenureMonths,
  };
}

/**
 * Calculates loan affordability based on business income and expenses
 */
export interface AffordabilityAnalysis {
  monthlySurplus: number;
  emiToSurplusRatio: number; // percentage
  status: 'comfortable' | 'moderate' | 'high_risk' | 'deficit';
  recommendedMaxEmi: number;
  explanationEn: string;
  explanationMr: string;
}

export function evaluateAffordability(
  monthlyIncome: number,
  monthlyExpenses: number,
  proposedEmi: number
): AffordabilityAnalysis {
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const recommendedMaxEmi = Math.max(0, Math.round(monthlySurplus * 0.4)); // Max 40% of surplus

  if (monthlySurplus <= 0) {
    return {
      monthlySurplus,
      emiToSurplusRatio: proposedEmi > 0 ? 100 : 0,
      status: 'deficit',
      recommendedMaxEmi: 0,
      explanationEn:
        'Your business expenses currently match or exceed monthly revenue. Taking an EMI loan now is high risk without increasing sales or reducing costs.',
      explanationMr:
        'तुमचा व्यवसाय खर्च सध्या मासिक महसुलाइतका किंवा त्याहून अधिक आहे. विक्री वाढवल्याशिवाय किंवा खर्च कमी केल्याशिवाय आता कर्ज घेणे जोखमीचे ठरेल.',
    };
  }

  const ratio = Math.round((proposedEmi / monthlySurplus) * 100);

  if (ratio <= 30) {
    return {
      monthlySurplus,
      emiToSurplusRatio: ratio,
      status: 'comfortable',
      recommendedMaxEmi,
      explanationEn: `Safe zone! Proposed EMI of ₹${proposedEmi.toLocaleString('en-IN')} uses only ${ratio}% of your ₹${monthlySurplus.toLocaleString('en-IN')} monthly surplus, leaving sufficient room for emergencies.`,
      explanationMr: `सुरक्षित श्रेणी! सुचवलेला हप्ता तुमच्या ₹${monthlySurplus.toLocaleString('en-IN')} मासिक शिल्लक पैकी फक्त ${ratio}% आहे, ज्यामुळे अचानक खर्चासाठी पुरेशी रक्कम उरते.`,
    };
  }

  if (ratio <= 60) {
    return {
      monthlySurplus,
      emiToSurplusRatio: ratio,
      status: 'moderate',
      recommendedMaxEmi,
      explanationEn: `Moderate obligation. Proposed EMI consumes ${ratio}% of your monthly surplus. Ensure reliable customer payments before committing.`,
      explanationMr: `मध्यम भार. सुचवलेला हप्ता तुमच्या मासिक बचतीचा ${ratio}% भाग घेतो. कर्जाची वचनबद्धता घेण्यापूर्वी ग्राहकांची देयके वेळेवर मिळण्याची खात्री करा.`,
    };
  }

  return {
    monthlySurplus,
    emiToSurplusRatio: ratio,
    status: 'high_risk',
    recommendedMaxEmi,
    explanationEn: `Caution: Proposed EMI takes ${ratio}% of your monthly business surplus. A slow sales week could lead to missed payments or cash crunch.`,
    explanationMr: `सावधानता: सुचवलेला हप्ता तुमच्या मासिक शिल्लक रकमेच्या ${ratio}% भाग घेतो. विक्री कमी झाल्यास हप्ता भरण्यात अडचण येऊ शकते.`,
  };
}

/**
 * Calculates financial aggregates from transaction list
 */
export function calculateFinancialSummary(transactions: Transaction[]) {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals: Record<string, number> = {};

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  }

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin: Number(profitMargin.toFixed(1)),
    transactionCount: transactions.length,
    categoryTotals,
  };
}

/**
 * Evaluates budget vs actual spending
 */
export function calculateBudgetPerformance(budget: Budget, transactions: Transaction[]) {
  const actualByCategory: Record<ExpenseCategory, number> = {
    inventory: 0,
    raw_materials: 0,
    rent: 0,
    transportation: 0,
    utilities: 0,
    wages: 0,
    marketing: 0,
    equipment: 0,
    other_expenses: 0,
  };

  let actualTotalExpense = 0;
  let actualTotalIncome = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      actualTotalIncome += t.amount;
    } else if (t.category in actualByCategory) {
      actualByCategory[t.category as ExpenseCategory] += t.amount;
      actualTotalExpense += t.amount;
    }
  }

  let totalBudgetLimit = 0;
  const categoryStatus = Object.entries(budget.limits).map(([category, limit]) => {
    totalBudgetLimit += limit;
    const spent = actualByCategory[category as ExpenseCategory] || 0;
    const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const remaining = limit - spent;

    return {
      category: category as ExpenseCategory,
      limit,
      spent,
      remaining,
      percentage,
      isExceeded: spent > limit,
    };
  });

  return {
    actualTotalIncome,
    actualTotalExpense,
    totalBudgetLimit,
    expectedIncome: budget.expectedIncome,
    targetSavings: budget.targetSavings,
    actualSavings: actualTotalIncome - actualTotalExpense,
    categoryStatus,
  };
}
