import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatRupees } from '../../lib/currency';
import { calculateFinancialSummary } from '../../lib/calculations';
import { verifiedSchemes } from '../../data/schemesData';
import { learningModules } from '../../data/learningData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IncomeExpenseBarChart } from '../../components/charts/IncomeExpenseBarChart';
import { ProfitTrendLineChart } from '../../components/charts/ProfitTrendLineChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Calculator,
  Landmark,
  PiggyBank,
  BotMessageSquare,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (path: string) => void;
  onOpenAddTransaction: (type?: 'income' | 'expense') => void;
  onOpenSetBudget: () => void;
}

type PeriodFilter = 'this_month' | 'last_month' | 'last_3_months' | 'all_time';

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddTransaction,
  onOpenSetBudget,
}) => {
  const { t, language } = useLanguage();
  const { profile, currentUser } = useAuth();
  const {
    transactions,
    savingsGoals,
    bookmarkedSchemeIds,
    learningProgress,
  } = useData();

  const [period, setPeriod] = useState<PeriodFilter>('this_month');

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    return transactions.filter((tx) => {
      if (period === 'all_time') return true;
      const txDate = new Date(tx.date);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();

      if (period === 'this_month') {
        return txYear === currentYear && txMonth === currentMonth;
      }
      if (period === 'last_month') {
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return (
          txYear === lastMonthDate.getFullYear() &&
          txMonth === lastMonthDate.getMonth()
        );
      }
      if (period === 'last_3_months') {
        const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
        return txDate >= threeMonthsAgo;
      }
      return true;
    });
  }, [transactions, period]);

  const summary = useMemo(() => {
    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Aggregate monthly data for Bar Chart
  const monthlyChartData = useMemo(() => {
    const monthlyMap: Record<string, { income: number; expense: number; month: string }> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: label, income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        monthlyMap[key].income += tx.amount;
      } else {
        monthlyMap[key].expense += tx.amount;
      }
    });

    const sortedKeys = Object.keys(monthlyMap).sort();
    return sortedKeys.slice(-4).map((k) => monthlyMap[k]);
  }, [transactions]);

  // Aggregate profit trend
  const profitTrendData = useMemo(() => {
    return monthlyChartData.map((d) => ({
      month: d.month,
      profit: d.income - d.expense,
    }));
  }, [monthlyChartData]);

  // Category breakdown for Pie Chart
  const categoryChartData = useMemo(() => {
    return Object.entries(summary.categoryTotals).map(([cat, amount]) => ({
      category: cat,
      amount,
    }));
  }, [summary.categoryTotals]);

  // Savings progress
  const totalTargetSavings = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const savingsPct =
    totalTargetSavings > 0
      ? Math.min(Math.round((totalCurrentSaved / totalTargetSavings) * 100), 100)
      : 0;

  // Bookmarked schemes list
  const savedSchemesList = verifiedSchemes.filter((s) =>
    bookmarkedSchemeIds.includes(s.id)
  );

  // Profile completion meter
  const profileFields = [
    profile?.displayName,
    profile?.businessName,
    profile?.category,
    profile?.district,
    profile?.businessStage,
    profile?.mainGoal,
  ];
  const profileFilledCount = profileFields.filter(Boolean).length;
  const profilePct = Math.round((profileFilledCount / profileFields.length) * 100);

  // Learning progress count
  const completedLessonsCount = learningProgress.completedModuleIds.length;
  const totalLessonsCount = learningModules.length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Period Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {profile?.businessName || t('dashTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {profile?.district ? `${profile.district}, Maharashtra · ` : ''}
            {t('dashSubtitle')}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('this_month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              period === 'this_month'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('reportThisMonth')}
          </button>
          <button
            onClick={() => setPeriod('last_month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              period === 'last_month'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('reportLastMonth')}
          </button>
          <button
            onClick={() => setPeriod('last_3_months')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              period === 'last_3_months'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('reportLast3Months')}
          </button>
          <button
            onClick={() => setPeriod('all_time')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              period === 'all_time'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('reportAllTime')}
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('totalIncome')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-950 font-mono tabular-nums">
              {formatRupees(summary.totalIncome)}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              From {filteredTransactions.filter((t) => t.type === 'income').length} collections
            </span>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('totalExpenses')}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-950 font-mono tabular-nums">
              {formatRupees(summary.totalExpenses)}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              From {filteredTransactions.filter((t) => t.type === 'expense').length} payments
            </span>
          </div>
        </Card>

        {/* Net Profit / Loss */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {summary.netProfit >= 0 ? t('netProfit') : t('netLoss')}
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                summary.netProfit >= 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {summary.netProfit >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-extrabold font-mono tabular-nums ${
                summary.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatRupees(summary.netProfit)}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Margin: {summary.profitMargin}%
            </span>
          </div>
        </Card>

        {/* Savings Progress */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('savingsProgress')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatRupees(totalCurrentSaved)}
            </span>
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: `${savingsPct}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 block text-right font-mono tabular-nums">
                {savingsPct}% of {formatRupees(totalTargetSavings)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenAddTransaction('income')}
            className="w-full text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('actionAddIncome')}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenAddTransaction('expense')}
            className="w-full text-xs text-rose-800 border-rose-300 hover:bg-rose-50"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>{t('actionAddExpense')}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('/calculator')}
            className="w-full text-xs text-slate-700 hover:bg-slate-50"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('actionCalculateEmi')}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('/schemes')}
            className="w-full text-xs text-slate-700 hover:bg-slate-50"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{t('actionFindSchemes')}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenSetBudget}
            className="w-full text-xs text-slate-700 hover:bg-slate-50"
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>{t('actionCreateBudget')}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('/chatbot')}
            className="w-full text-xs text-purple-800 border-purple-200 hover:bg-purple-50"
          >
            <BotMessageSquare className="w-3.5 h-3.5" />
            <span>{t('actionAskAi')}</span>
          </Button>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Income vs Expense Chart */}
        <div className="lg:col-span-8">
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Monthly Cash Flow (मासिक जमा-खर्च)
                </h3>
                <p className="text-xs text-slate-500">Historical comparison across recent months</p>
              </div>
              <button
                onClick={() => onNavigate('/reports')}
                className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <IncomeExpenseBarChart data={monthlyChartData} height={240} />
          </Card>
        </div>

        {/* Expense Category Breakdown Donut */}
        <div className="lg:col-span-4">
          <Card className="p-5 border-slate-200 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Expense Distribution (खर्च विभागणी)
                  </h3>
                  <p className="text-xs text-slate-500">Where your business money went</p>
                </div>
              </div>
              <CategoryPieChart data={categoryChartData} height={200} />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onNavigate('/transactions')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Manage Transactions →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Row: Recent Transactions + Saved Schemes & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-7">
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {t('recentTransactions')}
              </h3>
              <button
                onClick={() => onNavigate('/transactions')}
                className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                <p>{t('noTransactionsYet')}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => onOpenAddTransaction('income')}
                >
                  {t('actionAddIncome')}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{tx.description}</p>
                        <p className="text-[11px] text-slate-400">
                          {tx.date} · {tx.category.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-mono tabular-nums font-bold shrink-0 ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatRupees(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Saved Schemes & Learning Progress Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Saved Schemes Widget */}
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {t('savedSchemes')} ({savedSchemesList.length})
              </h3>
              <button
                onClick={() => onNavigate('/schemes')}
                className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
              >
                {t('viewAll')}
              </button>
            </div>

            {savedSchemesList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {t('noSavedSchemesYet')}
              </p>
            ) : (
              <div className="space-y-2">
                {savedSchemesList.slice(0, 3).map((sch) => (
                  <div
                    key={sch.id}
                    onClick={() => onNavigate(`/schemes/${sch.id}`)}
                    className="p-2.5 rounded-lg border border-slate-200/80 hover:border-emerald-600/60 bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {language === 'mr' ? sch.nameMr : sch.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{sch.maxFunding}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Literacy Progress & Daily Tip Card */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-slate-900">
                  {t('learningProgress')}
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-600 font-bold">
                {completedLessonsCount} / {totalLessonsCount}
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${(completedLessonsCount / totalLessonsCount) * 100}%` }}
              ></div>
            </div>

            {/* Daily Tip */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('financialTipTitle')}</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                {language === 'mr'
                  ? 'दुकानाच्या गल्ल्यातून थेट घरखर्च काढू नका. नफ्यातून दरमहा स्वतःला निश्चित पगार ठरवा आणि घरखर्चासाठी वेगळे बँक खाते वापरा.'
                  : 'Never take cash directly from the shop drawer for household expenses. Pay yourself a fixed monthly owner’s salary into a separate savings account.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
