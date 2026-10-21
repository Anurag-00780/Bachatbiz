import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatRupees } from '../../lib/currency';
import { calculateFinancialSummary } from '../../lib/calculations';
import { exportProfitLossToCsv } from '../../lib/exportCsv';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Building2,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { transactions, budget, savingsGoals } = useData();

  const [period, setPeriod] = useState<
    'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all_time'
  >('this_month');

  // Filter transactions
  const filtered = useMemo(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    return transactions.filter((tx) => {
      if (period === 'all_time') return true;
      const d = new Date(tx.date);
      const y = d.getFullYear();
      const m = d.getMonth();

      if (period === 'this_month') return y === curYear && m === curMonth;
      if (period === 'last_month') {
        const lm = new Date(curYear, curMonth - 1, 1);
        return y === lm.getFullYear() && m === lm.getMonth();
      }
      if (period === 'last_3_months') {
        const threeMonthsAgo = new Date(curYear, curMonth - 2, 1);
        return d >= threeMonthsAgo;
      }
      if (period === 'this_year') return y === curYear;
      return true;
    });
  }, [transactions, period]);

  const summary = useMemo(() => {
    return calculateFinancialSummary(filtered);
  }, [filtered]);

  // Category breakdown list
  const categoryBreakdown = useMemo(() => {
    const totalExp = summary.totalExpenses || 1;
    return Object.entries(summary.categoryTotals).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: Math.round((amt / totalExp) * 100),
    }));
  }, [summary]);

  const periodLabels: Record<string, string> = {
    this_month: 'Current Month (चालू महिना)',
    last_month: 'Last Month (मागील महिना)',
    last_3_months: 'Past 3 Months (मागील ३ महिने)',
    this_year: 'Current Financial Year (चालू आर्थिक वर्ष)',
    all_time: 'All Historical Records (सर्व नोंदी)',
  };

  const handleExportCsv = () => {
    exportProfitLossToCsv(
      periodLabels[period],
      summary.totalIncome,
      summary.totalExpenses,
      summary.netProfit,
      categoryBreakdown
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('reportsTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('reportsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" />
            <span>{t('reportPrint')}</span>
          </Button>

          <Button size="sm" onClick={handleExportCsv}>
            <Download className="w-3.5 h-3.5" />
            <span>{t('reportExportCsv')}</span>
          </Button>
        </div>
      </div>

      {/* Period Filter Bar */}
      <Card className="p-3 border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium shrink-0">Select Statement Period:</span>
        {(['this_month', 'last_month', 'last_3_months', 'this_year', 'all_time'] as const).map(
          (p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                period === p
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {periodLabels[p]}
            </button>
          )
        )}
      </Card>

      {/* Printable Report Document Card */}
      <Card className="p-8 border-slate-200 space-y-6 bg-white shadow-xs print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xl font-sans">
              <span>BachatBiz Financial Statement</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {profile?.businessName || 'Business Enterprise'}
            </h2>
            <p className="text-xs text-slate-500">
              {profile?.district ? `${profile.district}, Maharashtra` : 'Maharashtra, India'} · Trade: {profile?.category.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-900">{periodLabels[period]}</p>
            <p>Generated: {new Date().toLocaleDateString('en-IN')}</p>
            <p>{filtered.length} Recorded Entries</p>
          </div>
        </div>

        {/* Profit & Loss Statement Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Profit & Loss Summary (नफा-तोटा विवरण)
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-mono tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-sans">
                <tr>
                  <th className="py-2.5 px-4">Financial Line Item</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                  <th className="py-2.5 px-4 text-right">% of Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-emerald-50/30">
                  <td className="py-2.5 px-4 font-bold text-slate-900 font-sans">
                    Gross Business Revenue / Sales (एकूण जमा)
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-800 text-sm">
                    {formatRupees(summary.totalIncome)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">100.0%</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-700 font-sans pl-8">
                    Total Operating Expenses & Inventory (एकूण खर्च)
                  </td>
                  <td className="py-2.5 px-4 text-right text-rose-700 font-semibold">
                    {formatRupees(summary.totalExpenses)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">
                    {summary.totalIncome > 0
                      ? `${((summary.totalExpenses / summary.totalIncome) * 100).toFixed(1)}%`
                      : '0.0%'}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td className="py-3 px-4 text-slate-900 font-sans text-sm">
                    Net Operating Profit / (Loss) (निव्वळ नफा)
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-base ${
                      summary.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatRupees(summary.netProfit)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right ${
                      summary.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {summary.profitMargin}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Expense Category Breakdown (खर्च तपशील)
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-mono tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-sans">
                <tr>
                  <th className="py-2.5 px-4">Expense Category</th>
                  <th className="py-2.5 px-4 text-right">Expenditure (INR)</th>
                  <th className="py-2.5 px-4 text-right">Share of Total Expense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400 font-sans">
                      No expenses recorded for this reporting period.
                    </td>
                  </tr>
                ) : (
                  categoryBreakdown.map((row) => (
                    <tr key={row.category} className="hover:bg-slate-50">
                      <td className="py-2 px-4 capitalize text-slate-800 font-sans font-medium">
                        {row.category.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2 px-4 text-right font-medium text-slate-900">
                        {formatRupees(row.amount)}
                      </td>
                      <td className="py-2 px-4 text-right text-slate-500">
                        {row.percentage}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Prepared using BachatBiz Digital Platform · End-to-end Verified Ledger</span>
          <span>Official seal / Signature: _______________________</span>
        </div>
      </Card>
    </div>
  );
};
