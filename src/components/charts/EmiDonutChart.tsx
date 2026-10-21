import React from 'react';
import { formatRupees } from '../../lib/currency';

interface EmiDonutChartProps {
  principal: number;
  totalInterest: number;
  monthlyEmi: number;
}

export const EmiDonutChart: React.FC<EmiDonutChartProps> = ({
  principal,
  totalInterest,
  monthlyEmi,
}) => {
  const totalRepayment = principal + totalInterest;
  if (totalRepayment <= 0) return null;

  const principalRatio = principal / totalRepayment;
  const interestRatio = totalInterest / totalRepayment;

  const radius = 64;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const principalDash = `${principalRatio * circumference} ${circumference}`;
  const interestDash = `${interestRatio * circumference} ${circumference}`;
  const interestOffset = -principalRatio * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
      <div className="relative shrink-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          {/* Principal arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#059669"
            strokeWidth={strokeWidth}
            strokeDasharray={principalDash}
            strokeDashoffset="0"
          />
          {/* Interest arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#D97706"
            strokeWidth={strokeWidth}
            strokeDasharray={interestDash}
            strokeDashoffset={interestOffset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Monthly EMI</span>
          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
            {formatRupees(monthlyEmi)}
          </span>
          <span className="text-[10px] text-slate-400">per month</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 w-full">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Principal Amount
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-800">
              {formatRupees(principal)} ({Math.round(principalRatio * 100)}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${principalRatio * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              Total Interest Payable
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-800">
              {formatRupees(totalInterest)} ({Math.round(interestRatio * 100)}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full"
              style={{ width: `${interestRatio * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Total Cost of Loan:</span>
          <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
            {formatRupees(totalRepayment)}
          </span>
        </div>
      </div>
    </div>
  );
};
