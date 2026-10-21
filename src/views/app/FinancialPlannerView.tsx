import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useData } from '../../context/DataContext';
import { SavingsGoal, ExpenseCategory } from '../../types';
import { formatRupees } from '../../lib/currency';
import { calculateBudgetPerformance } from '../../lib/calculations';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BudgetProgressBar } from '../../components/charts/BudgetProgressBar';
import { GoalModal } from '../../components/modals/GoalModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import {
  PiggyBank,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Wallet,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface FinancialPlannerViewProps {
  onOpenSetBudget: () => void;
}

export const FinancialPlannerView: React.FC<FinancialPlannerViewProps> = ({
  onOpenSetBudget,
}) => {
  const { t, language } = useLanguage();
  const {
    transactions,
    budget,
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  } = useData();

  // Savings Goal modals
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<SavingsGoal | null>(null);

  // Cash flow forecast inputs
  const [openingBalance, setOpeningBalance] = useState('25000');

  // Filter current month transactions for budget performance
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.date.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  const budgetPerf = useMemo(() => {
    return calculateBudgetPerformance(budget, currentMonthTransactions);
  }, [budget, currentMonthTransactions]);

  // Cash flow projection
  const parsedOpening = parseFloat(openingBalance) || 0;
  const netHistoricalCashFlow = budgetPerf.actualTotalIncome - budgetPerf.actualTotalExpense;
  const estimatedClosing = parsedOpening + netHistoricalCashFlow;

  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  };

  const handleSaveGoal = (data: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  }) => {
    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, data);
    } else {
      addSavingsGoal(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('fpTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('fpSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onOpenSetBudget}>
            {t('fpSetBudget')}
          </Button>
          <Button size="sm" onClick={handleOpenAddGoal}>
            <Plus className="w-3.5 h-3.5" />
            <span>{t('fpAddGoal')}</span>
          </Button>
        </div>
      </div>

      {/* Monthly Budget Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-xs text-slate-500 block">Expected Revenue</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatRupees(budget.expectedIncome)}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">
            Actual: {formatRupees(budgetPerf.actualTotalIncome)}
          </span>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-xs text-slate-500 block">Total Budget Cap</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatRupees(budgetPerf.totalBudgetLimit)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Actual Spent: {formatRupees(budgetPerf.actualTotalExpense)}
          </span>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-xs text-slate-500 block">Target Savings</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatRupees(budget.targetSavings)}
          </span>
          <span className="text-[11px] text-amber-700 block mt-1">
            Net Surplus: {formatRupees(budgetPerf.actualSavings)}
          </span>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-xs text-slate-500 block">Budget Variance Status</span>
          <span
            className={`text-xl font-extrabold font-mono tabular-nums ${
              budgetPerf.actualTotalExpense <= budgetPerf.totalBudgetLimit
                ? 'text-emerald-700'
                : 'text-rose-700'
            }`}
          >
            {budgetPerf.actualTotalExpense <= budgetPerf.totalBudgetLimit
              ? `Safe (${formatRupees(budgetPerf.totalBudgetLimit - budgetPerf.actualTotalExpense)} left)`
              : `Exceeded by ${formatRupees(budgetPerf.actualTotalExpense - budgetPerf.totalBudgetLimit)}`}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Current month: {currentMonth}
          </span>
        </Card>
      </div>

      {/* Main Budget vs Actual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('fpBudgetVsActual')}
                </h3>
                <p className="text-xs text-slate-500">
                  Category limits help prevent over-spending on inventory or overheads
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={onOpenSetBudget}>
                Edit Caps
              </Button>
            </div>

            <div className="space-y-3">
              {budgetPerf.categoryStatus.map((st) => (
                <BudgetProgressBar
                  key={st.category}
                  categoryName={st.category}
                  limit={st.limit}
                  spent={st.spent}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Cash Flow Forecast & Projections */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {t('fpCashFlowForecast')}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <Input
                label="Opening Cash / Bank Balance (सुरुवातीची शिल्लक ₹)"
                type="number"
                min="0"
                prefixText="₹"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                helperText="Enter cash on hand plus bank account balance at month start."
              />

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 font-mono tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Opening Liquidity:</span>
                  <span className="font-semibold text-slate-800">{formatRupees(parsedOpening)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>+ Total Month Inflow:</span>
                  <span className="font-semibold">+{formatRupees(budgetPerf.actualTotalIncome)}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>- Total Month Outflow:</span>
                  <span className="font-semibold">-{formatRupees(budgetPerf.actualTotalExpense)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                  <span className="text-slate-900 font-sans">Estimated Closing Balance:</span>
                  <span className={estimatedClosing >= 0 ? 'text-emerald-800' : 'text-rose-700'}>
                    {formatRupees(estimatedClosing)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                <strong>Liquidity Guidance:</strong> Keep at least ₹20,000–₹40,000 in closing balance to buffer unexpected distributor price hikes or delayed customer udhaar payments.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('fpSavingsGoals')}
            </h2>
            <p className="text-xs text-slate-500">
              Targeted savings for equipment, inventory buffer, and store upgrades
            </p>
          </div>
          <Button size="sm" onClick={handleOpenAddGoal}>
            <Plus className="w-3.5 h-3.5" />
            <span>{t('fpAddGoal')}</span>
          </Button>
        </div>

        {savingsGoals.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 text-xs">
            <PiggyBank className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No business savings goals added yet.</p>
            <Button size="sm" className="mt-3" onClick={handleOpenAddGoal}>
              Create Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => {
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              const progressPct =
                goal.targetAmount > 0
                  ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
                  : 0;

              // Calculate required monthly pace
              const now = new Date();
              const target = new Date(goal.targetDate);
              const diffMonths = Math.max(
                1,
                (target.getFullYear() - now.getFullYear()) * 12 +
                  (target.getMonth() - now.getMonth())
              );
              const monthlyPace = Math.round(remaining / diffMonths);

              return (
                <Card
                  key={goal.id}
                  className="p-5 border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditGoal(goal)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-sm hover:bg-slate-100"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(goal)}
                          className="p-1 text-slate-400 hover:text-rose-700 rounded-sm hover:bg-slate-100"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Saved:</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {formatRupees(goal.currentAmount)} / {formatRupees(goal.targetAmount)}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{progressPct}% Achieved</span>
                        <span>{formatRupees(remaining)} Remaining</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Target Date:</span>
                        </span>
                        <span className="font-mono tabular-nums">{goal.targetDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-800 font-medium">
                        <span>Required Monthly Pace:</span>
                        <span className="font-mono tabular-nums font-bold">
                          {formatRupees(monthlyPace)} / mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {progressPct >= 100 && (
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Target Milestone Completed!</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />

      {/* Delete Goal Modal */}
      {deleteCandidate && (
        <DeleteConfirmModal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => {
            if (deleteCandidate) {
              deleteSavingsGoal(deleteCandidate.id);
              setDeleteCandidate(null);
            }
          }}
          title="Delete Savings Goal"
          message={`Are you sure you want to remove the goal "${deleteCandidate.title}"?`}
        />
      )}
    </div>
  );
};
