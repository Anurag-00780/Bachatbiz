import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  Transaction,
  TransactionType,
  TransactionCategory,
} from '../../types';
import { formatRupees } from '../../lib/currency';
import { calculateFinancialSummary } from '../../lib/calculations';
import { exportTransactionsToCsv } from '../../lib/exportCsv';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import {
  Plus,
  Minus,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddModal: (type?: TransactionType) => void;
  onOpenEditModal: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { t, language } = useLanguage();
  const { transactions, deleteTransaction } = useData();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'this_month' | 'last_month' | 'last_3_months' | 'this_year'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Modals state
  const [deleteCandidate, setDeleteCandidate] = useState<Transaction | null>(null);
  const [viewCandidate, setViewCandidate] = useState<Transaction | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((tx) => {
      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        const matchesCategory = tx.category.toLowerCase().includes(query);
        if (!matchesDesc && !matchesNotes && !matchesCategory) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      // Date range filter
      if (dateRange !== 'all') {
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth();

        if (dateRange === 'this_month') {
          if (txYear !== currentYear || txMonth !== currentMonth) return false;
        } else if (dateRange === 'last_month') {
          const lm = new Date(currentYear, currentMonth - 1, 1);
          if (txYear !== lm.getFullYear() || txMonth !== lm.getMonth()) return false;
        } else if (dateRange === 'last_3_months') {
          const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
          if (txDate < threeMonthsAgo) return false;
        } else if (dateRange === 'this_year') {
          if (txYear !== currentYear) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, dateRange, sortBy]);

  // Summary of filtered dataset
  const summary = useMemo(() => {
    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Paginated items
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  const handleExport = () => {
    exportTransactionsToCsv(
      filteredTransactions,
      `BachatBiz_Transactions_${new Date().toISOString().substring(0, 10)}.csv`
    );
  };

  // Distinct category list from existing data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('txTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('txSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('txExportCsv')}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onOpenAddModal('income')}
            className="bg-emerald-800 hover:bg-emerald-900 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('txAddIncome')}</span>
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => onOpenAddModal('expense')}
            className="text-xs"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>{t('txAddExpense')}</span>
          </Button>
        </div>
      </div>

      {/* Filtered Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Filtered Total Income
            </span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {formatRupees(summary.totalIncome)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-4 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Filtered Total Expenses
            </span>
            <span className="text-xl font-extrabold text-rose-700 font-mono tabular-nums">
              {formatRupees(summary.totalExpenses)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-4 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Filtered Net {summary.netProfit >= 0 ? 'Profit' : 'Loss'}
            </span>
            <span
              className={`text-xl font-extrabold font-mono tabular-nums ${
                summary.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatRupees(summary.netProfit)}
            </span>
          </div>
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
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('txSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          {/* Type Segmented Filter */}
          <div className="md:col-span-3 flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setTypeFilter('all');
                setCurrentPage(1);
              }}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('txFilterAll')}
            </button>
            <button
              onClick={() => {
                setTypeFilter('income');
                setCurrentPage(1);
              }}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-white text-emerald-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('txFilterIncome')}
            </button>
            <button
              onClick={() => {
                setTypeFilter('expense');
                setCurrentPage(1);
              }}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-white text-rose-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('txFilterExpense')}
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            >
              <option value="all">All Categories (सर्व वर्ग)</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Amount (High to Low)</option>
              <option value="amount_asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Date Filter Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs overflow-x-auto">
          <span className="text-slate-400 font-medium shrink-0">Date Range:</span>
          {(['all', 'this_month', 'last_month', 'last_3_months', 'this_year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setDateRange(r);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 text-xs ${
                dateRange === r
                  ? 'bg-emerald-800 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all'
                ? t('reportAllTime')
                : r === 'this_month'
                ? t('reportThisMonth')
                : r === 'last_month'
                ? t('reportLastMonth')
                : r === 'last_3_months'
                ? t('reportLast3Months')
                : t('reportThisYear')}
            </button>
          ))}
          <span className="ml-auto text-slate-500 font-mono tabular-nums shrink-0">
            {filteredTransactions.length} records found
          </span>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t('txDate')}</th>
                <th className="py-3 px-4">{t('txDescription')}</th>
                <th className="py-3 px-4">{t('txCategory')}</th>
                <th className="py-3 px-4 text-right">{t('txAmount')}</th>
                <th className="py-3 px-4 text-center">{t('txActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No transactions match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{tx.description}</p>
                      {tx.notes && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="capitalize text-slate-600 text-xs">
                        {tx.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono tabular-nums font-bold text-sm ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatRupees(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewCandidate(tx)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(tx)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-slate-100"
                          title={t('txEdit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 rounded-md hover:bg-slate-100"
                          title={t('txDelete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} entries
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>
              <span className="font-mono tabular-nums px-2 font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <DeleteConfirmModal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => {
            if (deleteCandidate) {
              deleteTransaction(deleteCandidate.id);
              setDeleteCandidate(null);
            }
          }}
          title={t('txDelete')}
          message={`${t('txDeleteConfirm')} "${deleteCandidate.description}" (${formatRupees(
            deleteCandidate.amount
          )})`}
        />
      )}

      {/* View Details Modal */}
      {viewCandidate && (
        <Modal
          isOpen={!!viewCandidate}
          onClose={() => setViewCandidate(null)}
          title={t('txDetails')}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Record ID:</span>
                <span className="font-mono text-slate-700">{viewCandidate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Date:</span>
                <span className="font-mono text-slate-900 font-semibold">{viewCandidate.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span
                  className={`font-semibold capitalize ${
                    viewCandidate.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {viewCandidate.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {viewCandidate.category.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Amount:</span>
                <span
                  className={`text-base font-bold font-mono tabular-nums ${
                    viewCandidate.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {formatRupees(viewCandidate.amount)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 font-semibold">Description:</span>
              <p className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800">
                {viewCandidate.description}
              </p>
            </div>

            {viewCandidate.notes && (
              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Notes / Voucher Info:</span>
                <p className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                  {viewCandidate.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setViewCandidate(null)}>
                {t('btnClose')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
