import React, { useState } from 'react';
import { formatRupees } from '../../lib/currency';

interface ProfitDataPoint {
  month: string;
  profit: number;
}

interface ProfitTrendLineChartProps {
  data: ProfitDataPoint[];
  height?: number;
}

export const ProfitTrendLineChart: React.FC<ProfitTrendLineChartProps> = ({
  data,
  height = 200,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm"
      >
        No historical profit trend data
      </div>
    );
  }

  const values = data.map((d) => d.profit);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 10000);
  const range = maxVal - minVal || 1;

  const chartHeight = height - 40;
  const paddingLeft = 50;
  const paddingRight = 30;
  const svgWidth = 500;
  const plotWidth = svgWidth - paddingLeft - paddingRight;

  const points = data.map((d, idx) => {
    const x = paddingLeft + (idx / Math.max(data.length - 1, 1)) * plotWidth;
    const y = chartHeight - ((d.profit - minVal) / range) * (chartHeight - 30);
    return { x, y, profit: d.profit, month: d.month };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Area path closing down to 0 or bottom
  const zeroY = chartHeight - ((0 - minVal) / range) * (chartHeight - 30);
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
      >
        <defs>
          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Zero guideline if minVal < 0 */}
        {minVal < 0 && (
          <line
            x1={paddingLeft}
            y1={zeroY}
            x2={svgWidth - paddingRight}
            y2={zeroY}
            stroke="#94A3B8"
            strokeDasharray="2 2"
          />
        )}

        {/* Area fill */}
        <path d={areaD} fill="url(#profitGradient)" />

        {/* Trend line */}
        <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

        {/* Interactive Data Points */}
        {points.map((pt, idx) => (
          <g
            key={idx}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint(idx)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === idx ? 6 : 4}
              fill="#FFFFFF"
              stroke="#059669"
              strokeWidth="2.5"
              className="transition-all"
            />
            <text
              x={pt.x}
              y={chartHeight + 20}
              textAnchor="middle"
              className="text-[11px] font-medium fill-slate-500"
            >
              {pt.month}
            </text>

            {/* Hover Tooltip */}
            {hoveredPoint === idx && (
              <g>
                <rect
                  x={pt.x - 45}
                  y={pt.y - 36}
                  width="90"
                  height="26"
                  rx="4"
                  fill="#0F172A"
                  className="shadow-md"
                />
                <text
                  x={pt.x}
                  y={pt.y - 19}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-emerald-300 font-mono tabular-nums"
                >
                  {formatRupees(pt.profit)}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
