import React from 'react';
import { formatRupees } from '../../lib/currency';

interface BudgetProgressBarProps {
  categoryName: string;
  limit: number;
  spent: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  categoryName,
  limit,
  spent,
}) => {
  const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 200) : 0;
  const isExceeded = spent > limit;
  const isWarning = percentage >= 80 && !isExceeded;

  let barColor = 'bg-emerald-600';
  if (isExceeded) barColor = 'bg-rose-600';
  else if (isWarning) barColor = 'bg-amber-500';

  return (
    <div className="space-y-1.5 p-3 rounded-lg border border-slate-200/70 bg-white">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800 capitalize truncate">
          {categoryName.replace(/_/g, ' ')}
        </span>
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span className={`font-semibold ${isExceeded ? 'text-rose-600' : 'text-slate-700'}`}>
            {formatRupees(spent)}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">{formatRupees(limit)}</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
              isExceeded
                ? 'bg-rose-100 text-rose-800'
                : isWarning
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-500">
        <span>
          {isExceeded ? (
            <span className="text-rose-600 font-medium">
              Over budget by {formatRupees(spent - limit)}
            </span>
          ) : (
            <span>Remaining: {formatRupees(limit - spent)}</span>
          )}
        </span>
        {limit === 0 && <span className="text-slate-400 italic">No limit set</span>}
      </div>
    </div>
  );
};
