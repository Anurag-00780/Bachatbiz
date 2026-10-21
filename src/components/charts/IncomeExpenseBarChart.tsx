import React, { useState } from 'react';
import { formatRupees } from '../../lib/currency';

interface MonthlyData {
  month: string; // e.g. "Aug 2026"
  income: number;
  expense: number;
}

interface IncomeExpenseBarChartProps {
  data: MonthlyData[];
  height?: number;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  data,
  height = 240,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm"
      >
        No transaction comparison data available
      </div>
    );
  }

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.income, d.expense]),
    10000
  );

  const chartHeight = height - 50; // leave room for labels
  const barWidth = 24;
  const groupGap = 48;
  const paddingLeft = 60;
  const totalWidth = paddingLeft + data.length * (barWidth * 2 + groupGap);

  // Generate 4 horizontal grid lines
  const gridTicks = [0, maxVal * 0.33, maxVal * 0.66, maxVal];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${Math.max(totalWidth, 500)} ${height}`}
        className="w-full text-slate-600"
        style={{ minWidth: `${Math.max(totalWidth, 500)}px`, height: `${height}px` }}
      >
        {/* Horizontal grid lines & ticks */}
        {gridTicks.map((val, idx) => {
          const y = chartHeight - (val / maxVal) * (chartHeight - 30);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2="100%"
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray={val === 0 ? 'none' : '3 3'}
                strokeWidth={val === 0 ? '1.5' : '1'}
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                ₹{val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${Math.round(val / 1000)}k`}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, idx) => {
          const groupX = paddingLeft + idx * (barWidth * 2 + groupGap) + 15;
          const incomeHeight = (item.income / maxVal) * (chartHeight - 30);
          const expenseHeight = (item.expense / maxVal) * (chartHeight - 30);

          const incomeY = chartHeight - incomeHeight;
          const expenseY = chartHeight - expenseHeight;

          const isHovered = hoveredIndex === idx;

          return (
            <g
              key={item.month}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer transition-opacity"
            >
              {/* Income bar */}
              <rect
                x={groupX}
                y={incomeY}
                width={barWidth}
                height={Math.max(incomeHeight, 2)}
                rx="4"
                fill="#059669"
                className="hover:opacity-90 transition-all"
              />
              {/* Expense bar */}
              <rect
                x={groupX + barWidth + 4}
                y={expenseY}
                width={barWidth}
                height={Math.max(expenseHeight, 2)}
                rx="4"
                fill="#DC2626"
                className="hover:opacity-90 transition-all"
              />

              {/* Month label */}
              <text
                x={groupX + barWidth + 2}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-[11px] font-medium fill-slate-600"
              >
                {item.month}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={groupX - 35}
                    y={Math.min(incomeY, expenseY) - 50}
                    width={120}
                    height={44}
                    rx="6"
                    fill="#0F172A"
                    className="shadow-lg"
                  />
                  <text
                    x={groupX + 25}
                    y={Math.min(incomeY, expenseY) - 34}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-emerald-400 font-mono tabular-nums"
                  >
                    In: {formatRupees(item.income)}
                  </text>
                  <text
                    x={groupX + 25}
                    y={Math.min(incomeY, expenseY) - 18}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-rose-300 font-mono tabular-nums"
                  >
                    Ex: {formatRupees(item.expense)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
          <span>Income (जमा)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-rose-600"></span>
          <span>Expenses (खर्च)</span>
        </div>
      </div>
    </div>
  );
};
