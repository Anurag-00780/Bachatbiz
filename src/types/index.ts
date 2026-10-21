export type Language = 'en' | 'mr';

export type UserRole = 'entrepreneur' | 'demo';

export interface User {
  id: string;
  email: string;
  fullName: string;
  preferredLanguage: Language;
  createdAt: string;
  onboardingCompleted: boolean;
}

export type BusinessCategory =
  | 'kirana_retail'
  | 'agriculture'
  | 'artisan_handicraft'
  | 'local_services'
  | 'food_dairy'
  | 'textiles_garments'
  | 'manufacturing_small'
  | 'other';

export type BusinessStage = 'idea' | 'early_stage' | 'established' | 'scaling';

export interface EntrepreneurProfile {
  userId: string;
  displayName: string;
  businessName: string;
  category: BusinessCategory;
  district: string;
  locationType: 'rural' | 'semi_urban' | 'urban';
  businessStage: BusinessStage;
  mainGoal: string;
  fundingRequirement?: number;
  savingsTarget?: number;
  monthlyRevenueEstimate?: number;
  monthlyExpenseEstimate?: number;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
  | 'product_sales'
  | 'service_income'
  | 'agricultural_income'
  | 'other_income';

export type ExpenseCategory =
  | 'inventory'
  | 'raw_materials'
  | 'rent'
  | 'transportation'
  | 'utilities'
  | 'wages'
  | 'marketing'
  | 'equipment'
  | 'other_expenses';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number; // in Rupees
  type: TransactionType;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  expectedIncome: number;
  targetSavings: number;
  limits: Record<ExpenseCategory, number>;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type SchemeCategory =
  | 'all'
  | 'retail'
  | 'manufacturing'
  | 'agriculture'
  | 'services'
  | 'women';

export interface GovernmentScheme {
  id: string;
  name: string;
  nameMr: string;
  agency: string;
  category: SchemeCategory;
  targetBeneficiaries: string;
  targetBeneficiariesMr: string;
  shortDescription: string;
  shortDescriptionMr: string;
  maxFunding: string;
  subsidyRate: string;
  interestSubsidy?: string;
  eligibility: string[];
  eligibilityMr: string[];
  documentsRequired: string[];
  documentsRequiredMr: string[];
  applicationSteps: string[];
  applicationStepsMr: string[];
  officialPortal: string;
  portalLabel: string;
  verificationStatus: 'verified' | 'illustrative';
  lastVerifiedDate: string;
  disclaimer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionMr: string;
  options: string[];
  optionsMr: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationMr: string;
}

export interface LearningModule {
  id: string;
  order: number;
  title: string;
  titleMr: string;
  category: 'digital_payments' | 'credit_loans' | 'accounting' | 'planning' | 'security' | 'government';
  estimatedMinutes: number;
  summary: string;
  summaryMr: string;
  contentSections: {
    heading: string;
    headingMr: string;
    body: string;
    bodyMr: string;
    tips?: string[];
    tipsMr?: string[];
  }[];
  businessScenario: {
    title: string;
    titleMr: string;
    description: string;
    descriptionMr: string;
    takeaway: string;
    takeawayMr: string;
  };
  quiz: QuizQuestion[];
}

export interface LearningProgress {
  userId: string;
  completedModuleIds: string[];
  quizScores: Record<string, { score: number; total: number; passed: boolean; attemptDate: string }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface LoanCalculationInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  label?: string;
}

export interface AmortizationRow {
  month: number;
  startingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface LoanCalculationResult {
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
  principal: number;
  annualRate: number;
  tenureMonths: number;
}
