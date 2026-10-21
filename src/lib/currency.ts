/**
 * Indian Rupee currency helpers and formatters
 * Adheres strictly to Indian numbering grouping (Lakhs and Crores): 1,00,000 / 1,00,00,000
 */

export function formatRupees(amount: number | null | undefined, showDecimals = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (showDecimals) {
    formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    formatted = Math.round(absAmount).toLocaleString('en-IN');
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatCompactRupees(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';

  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let result = '';
  if (abs >= 10000000) {
    result = `${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    result = `${(abs / 100000).toFixed(2)} Lakh`;
  } else if (abs >= 1000) {
    result = `${(abs / 1000).toFixed(1)}k`;
  } else {
    result = `${Math.round(abs)}`;
  }

  return `${isNegative ? '-' : ''}₹${result}`;
}

export function parseRupees(input: string): number {
  if (!input) return 0;
  const sanitized = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}
