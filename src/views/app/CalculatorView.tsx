import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { calculateEMI, evaluateAffordability } from '../../lib/calculations';
import { formatRupees } from '../../lib/currency';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { EmiDonutChart } from '../../components/charts/EmiDonutChart';
import {
  Calculator,
  Sliders,
  Scale,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';

export const CalculatorView: React.FC = () => {
  const { t, language } = useLanguage();

  // Primary Loan Inputs
  const [principal, setPrincipal] = useState('200000');
  const [annualRate, setAnnualRate] = useState('10.5');
  const [tenureYears, setTenureYears] = useState('3');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');

  // Comparison Scenario Inputs
  const [showComparison, setShowComparison] = useState(false);
  const [compPrincipal, setCompPrincipal] = useState('200000');
  const [compAnnualRate, setCompAnnualRate] = useState('12.0');
  const [compTenureYears, setCompTenureYears] = useState('2');

  // Business Affordability Inputs
  const [monthlyRevenue, setMonthlyRevenue] = useState('140000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('95000');

  // Amortization Schedule expanded
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [schedulePage, setSchedulePage] = useState(1);
  const schedulePageSize = 12;

  // Primary Calculation
  const parsedPrincipal = Math.max(0, parseFloat(principal) || 0);
  const parsedRate = Math.max(0, parseFloat(annualRate) || 0);
  const parsedTenureMonths =
    tenureUnit === 'years'
      ? Math.max(1, Math.round((parseFloat(tenureYears) || 1) * 12))
      : Math.max(1, parseInt(tenureYears || '12', 10));

  const result = useMemo(() => {
    return calculateEMI({
      principal: parsedPrincipal,
      annualRate: parsedRate,
      tenureMonths: parsedTenureMonths,
    });
  }, [parsedPrincipal, parsedRate, parsedTenureMonths]);

  // Comparison Calculation
  const compParsedPrincipal = Math.max(0, parseFloat(compPrincipal) || 0);
  const compParsedRate = Math.max(0, parseFloat(compAnnualRate) || 0);
  const compParsedTenureMonths = Math.max(
    1,
    Math.round((parseFloat(compTenureYears) || 1) * 12)
  );

  const compResult = useMemo(() => {
    return calculateEMI({
      principal: compParsedPrincipal,
      annualRate: compParsedRate,
      tenureMonths: compParsedTenureMonths,
    });
  }, [compParsedPrincipal, compParsedRate, compParsedTenureMonths]);

  // Affordability Assessment
  const parsedRev = parseFloat(monthlyRevenue) || 0;
  const parsedExp = parseFloat(monthlyExpenses) || 0;
  const affordability = useMemo(() => {
    return evaluateAffordability(parsedRev, parsedExp, result.monthlyEmi);
  }, [parsedRev, parsedExp, result.monthlyEmi]);

  // Presets
  const applyPreset = (p: number, r: number, y: number) => {
    setPrincipal(p.toString());
    setAnnualRate(r.toString());
    setTenureYears(y.toString());
    setTenureUnit('years');
  };

  // Paginated Amortization Rows
  const totalSchedulePages = Math.ceil(result.schedule.length / schedulePageSize) || 1;
  const paginatedSchedule = useMemo(() => {
    const start = (schedulePage - 1) * schedulePageSize;
    return result.schedule.slice(start, start + schedulePageSize);
  }, [result.schedule, schedulePage]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('calcTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('calcSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showComparison ? 'secondary' : 'outline'}
            onClick={() => setShowComparison(!showComparison)}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{showComparison ? 'Hide Comparison' : t('calcCompare')}</span>
          </Button>
        </div>
      </div>

      {/* Quick Presets Strip */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        <span className="text-slate-400 font-medium shrink-0">Common Loan Presets:</span>
        <button
          onClick={() => applyPreset(50000, 9.0, 1)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
        >
          Mudra Shishu (₹50k @ 9%)
        </button>
        <button
          onClick={() => applyPreset(250000, 10.5, 3)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
        >
          Mudra Kishore (₹2.5L @ 10.5%)
        </button>
        <button
          onClick={() => applyPreset(500000, 10.0, 5)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
        >
          CMEGP Maharashtra (₹5L @ 10%)
        </button>
        <button
          onClick={() => applyPreset(1000000, 11.5, 5)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
        >
          PMEGP Term Loan (₹10L @ 11.5%)
        </button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Loan Parameters</span>
            </h3>

            <div className="space-y-4">
              <Input
                label={t('calcPrincipal')}
                type="number"
                min="1000"
                step="5000"
                prefixText="₹"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                required
              />

              <div className="space-y-1">
                <Input
                  label={t('calcRate')}
                  type="number"
                  min="0"
                  max="40"
                  step="0.25"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  required
                  helperText="Annual percentage rate on reducing balance method."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Tenure Duration
                  </label>
                  <div className="flex rounded-md bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTenureUnit('years')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        tenureUnit === 'years'
                          ? 'bg-white font-bold text-slate-900 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Years
                    </button>
                    <button
                      type="button"
                      onClick={() => setTenureUnit('months')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        tenureUnit === 'months'
                          ? 'bg-white font-bold text-slate-900 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>

                <Input
                  type="number"
                  min="1"
                  max={tenureUnit === 'years' ? '30' : '360'}
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  required
                  helperText={
                    tenureUnit === 'years'
                      ? `Equals ${parsedTenureMonths} monthly installments`
                      : `Equals ${(parsedTenureMonths / 12).toFixed(1)} years`
                  }
                />
              </div>
            </div>
          </Card>

          {/* Educational Note */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1.5 text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Flat vs Reducing Rate Reminder</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              Never accept loans quoting &ldquo;Flat Interest&rdquo; from unverified agents. A 10% flat rate actually costs about 18% in true reducing balance interest.
            </p>
          </div>
        </div>

        {/* Right Column: Calculations & Donut */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 bg-emerald-900 text-white border-emerald-900">
              <span className="text-[11px] text-emerald-200 block font-medium">
                {t('calcMonthlyEmi')}
              </span>
              <span className="text-2xl font-extrabold font-mono tabular-nums">
                {formatRupees(result.monthlyEmi)}
              </span>
              <span className="text-[10px] text-emerald-300 block mt-1">
                for {parsedTenureMonths} months
              </span>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                {t('calcTotalInterest')}
              </span>
              <span className="text-xl font-extrabold text-amber-700 font-mono tabular-nums">
                {formatRupees(result.totalInterest)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Total extra borrowing cost
              </span>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                {t('calcTotalRepayment')}
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                {formatRupees(result.totalRepayment)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Principal + Interest
              </span>
            </Card>
          </div>

          {/* Interactive Donut Breakdown */}
          <EmiDonutChart
            principal={result.principal}
            totalInterest={result.totalInterest}
            monthlyEmi={result.monthlyEmi}
          />
        </div>
      </div>

      {/* Loan Comparison Section (When Enabled) */}
      {showComparison && (
        <Card className="p-6 border-slate-200 space-y-5 bg-slate-50/60">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Loan Scenario Comparison (Scenario A vs Scenario B)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Evaluate shorter tenures or lower interest alternatives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario A: Current */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Scenario A (Current Choice)
              </span>
              <div className="space-y-1 text-xs font-mono tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Loan Principal:</span>
                  <span className="font-semibold text-slate-900">{formatRupees(result.principal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Annual Interest Rate:</span>
                  <span className="font-semibold text-slate-900">{result.annualRate}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Repayment Tenure:</span>
                  <span className="font-semibold text-slate-900">{result.tenureMonths} Months</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-emerald-800 text-sm">
                  <span>Monthly EMI:</span>
                  <span>{formatRupees(result.monthlyEmi)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Total Interest:</span>
                  <span>{formatRupees(result.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Scenario B: Competitor / Alternative */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Scenario B (Alternative Offer)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Amount (₹)"
                  type="number"
                  value={compPrincipal}
                  onChange={(e) => setCompPrincipal(e.target.value)}
                />
                <Input
                  label="Rate (%)"
                  type="number"
                  step="0.25"
                  value={compAnnualRate}
                  onChange={(e) => setCompAnnualRate(e.target.value)}
                />
                <Input
                  label="Years"
                  type="number"
                  value={compTenureYears}
                  onChange={(e) => setCompTenureYears(e.target.value)}
                />
              </div>

              <div className="space-y-1 text-xs font-mono tabular-nums pt-1">
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Monthly EMI:</span>
                  <span>{formatRupees(compResult.monthlyEmi)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Total Interest:</span>
                  <span>{formatRupees(compResult.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Cost:</span>
                  <span>{formatRupees(compResult.totalRepayment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variance Verdict */}
          <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs flex items-center justify-between font-medium text-emerald-950">
            <span>
              <strong>Difference:</strong> Scenario {result.totalInterest < compResult.totalInterest ? 'A' : 'B'} saves you{' '}
              {formatRupees(Math.abs(result.totalInterest - compResult.totalInterest))} in total interest over the life of the loan!
            </span>
          </div>
        </Card>
      )}

      {/* Business Affordability Estimator */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('calcAffordabilityTitle')}
            </h3>
            <p className="text-xs text-slate-500">
              Educational simulation checking if your monthly business cash flow comfortably absorbs this EMI
            </p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              affordability.status === 'comfortable'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : affordability.status === 'moderate'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {affordability.status === 'comfortable'
              ? t('calcVerdictComfortable')
              : affordability.status === 'moderate'
              ? t('calcVerdictModerate')
              : t('calcVerdictHighRisk')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('calcMonthlyRevenue')}
            type="number"
            min="0"
            prefixText="₹"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
          />

          <Input
            label={t('calcMonthlyExpense')}
            type="number"
            min="0"
            prefixText="₹"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="grid grid-cols-3 gap-2 font-mono tabular-nums text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Monthly Surplus</span>
              <span className="text-sm font-bold text-slate-900">
                {formatRupees(affordability.monthlySurplus)}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Proposed EMI</span>
              <span className="text-sm font-bold text-emerald-800">
                {formatRupees(result.monthlyEmi)}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Surplus Share</span>
              <span className="text-sm font-bold text-slate-800">
                {affordability.emiToSurplusRatio}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed pt-1">
            {language === 'mr' ? affordability.explanationMr : affordability.explanationEn}
          </p>
        </div>
      </Card>

      {/* Amortization Schedule Table */}
      <Card className="p-5 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('calcSchedule')}</h3>
            <p className="text-xs text-slate-500">
              Month-by-month principal and interest breakdown
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setScheduleExpanded(!scheduleExpanded)}
          >
            {scheduleExpanded ? (
              <span className="flex items-center gap-1">
                <span>Hide Schedule</span>
                <ChevronUp className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>Show Full Schedule</span>
                <ChevronDown className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>

        {scheduleExpanded && (
          <div className="space-y-3 pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Opening Balance</th>
                    <th className="py-2.5 px-3">EMI</th>
                    <th className="py-2.5 px-3">Principal Paid</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3 text-right">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSchedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-800">
                        Month {row.month}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {formatRupees(row.startingBalance)}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {formatRupees(row.emi)}
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        {formatRupees(row.principalPaid)}
                      </td>
                      <td className="py-2 px-3 text-amber-700">
                        {formatRupees(row.interestPaid)}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">
                        {formatRupees(row.endingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalSchedulePages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Page {schedulePage} of {totalSchedulePages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={schedulePage === 1}
                    onClick={() => setSchedulePage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={schedulePage >= totalSchedulePages}
                    onClick={() => setSchedulePage((p) => Math.min(totalSchedulePages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
