import { Transaction } from '../types';

/**
 * Sanitizes spreadsheet formula triggers to prevent CSV injection vulnerabilities
 */
function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // If cell begins with formula characters, escape it
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape inner double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates and downloads a CSV file containing transactions
 */
export function exportTransactionsToCsv(transactions: Transaction[], filename = 'BachatBiz_Transactions.csv') {
  const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Description', 'Amount (INR)', 'Notes'];
  
  const rows = transactions.map((t) => [
    sanitizeCsvCell(t.id),
    sanitizeCsvCell(t.date),
    sanitizeCsvCell(t.type),
    sanitizeCsvCell(t.category.replace(/_/g, ' ')),
    sanitizeCsvCell(t.description),
    sanitizeCsvCell(t.amount),
    sanitizeCsvCell(t.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports financial summary / P&L statement to CSV
 */
export function exportProfitLossToCsv(
  periodLabel: string,
  totalIncome: number,
  totalExpense: number,
  netProfit: number,
  categoryBreakdown: { category: string; amount: number; percentage: number }[],
  filename = 'BachatBiz_ProfitLoss_Report.csv'
) {
  const lines: string[] = [
    `"BachatBiz Financial Report - ${periodLabel}"`,
    `"Generated At","${new Date().toISOString()}"`,
    '',
    '"Summary Metric","Amount (INR)"',
    `"Total Income","${totalIncome}"`,
    `"Total Expenses","${totalExpense}"`,
    `"Net Profit / (Loss)","${netProfit}"`,
    '',
    '"Expense Category","Amount (INR)","Share of Total Expense (%)"',
    ...categoryBreakdown.map(
      (c) => `${sanitizeCsvCell(c.category.replace(/_/g, ' '))},"${c.amount}","${c.percentage}%"`
    ),
  ];

  const csvContent = lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
