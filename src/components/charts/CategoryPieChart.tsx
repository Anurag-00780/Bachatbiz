import React, { useState } from 'react';
import { formatRupees } from '../../lib/currency';

interface CategoryItem {
  category: string;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryItem[];
  height?: number;
}

const CATEGORY_COLORS = [
  '#059669', // Emerald
  '#0D9488', // Teal
  '#D97706', // Amber
  '#E11D48', // Rose
  '#4F46E5', // Indigo
  '#0284C7', // Sky
  '#84CC16', // Lime
  '#7C3AED', // Violet
  '#64748B', // Slate
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  height = 240,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  if (total === 0 || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm"
      >
        No expense records to analyze
      </div>
    );
  }

  // Calculate SVG arc paths
  const radius = 70;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const slices = data.map((item, idx) => {
    const percentage = item.amount / total;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += percentage;
    const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

    return {
      ...item,
      percentage: Math.round(percentage * 100),
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {slices.map((slice, idx) => (
            <circle
              key={idx}
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            {activeItem ? activeItem.category.replace(/_/g, ' ') : 'Total'}
          </span>
          <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {activeItem ? formatRupees(activeItem.amount) : formatRupees(total)}
          </span>
          {activeItem && (
            <span className="text-[10px] text-emerald-700 font-semibold">
              {activeItem.percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-1.5 max-h-52 overflow-y-auto pr-2">
        {slices.map((slice, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              hoveredIdx === idx ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              ></span>
              <span className="text-slate-700 capitalize truncate">
                {slice.category.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600 shrink-0">
              <span>{formatRupees(slice.amount)}</span>
              <span className="text-slate-400 text-[10px] w-7 text-right">
                {slice.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
