import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Transaction,
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  TransactionCategory,
} from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
    notes?: string;
  }) => void;
  initialData?: Transaction | null;
  defaultType?: TransactionType;
}

const INCOME_CATEGORIES: { value: IncomeCategory; labelEn: string; labelMr: string }[] = [
  { value: 'product_sales', labelEn: 'Product Sales (माल विक्री)', labelMr: 'माल विक्री' },
  { value: 'service_income', labelEn: 'Service Income (सेवा उत्पन्न)', labelMr: 'सेवा उत्पन्न' },
  { value: 'agricultural_income', labelEn: 'Agricultural Income (कृषी उत्पन्न)', labelMr: 'शेती / कृषी उत्पन्न' },
  { value: 'other_income', labelEn: 'Other Income (इतर उत्पन्न)', labelMr: 'इतर उत्पन्न' },
];

const EXPENSE_CATEGORIES: { value: ExpenseCategory; labelEn: string; labelMr: string }[] = [
  { value: 'inventory', labelEn: 'Inventory / Stock (दुकान माल साठा)', labelMr: 'दुकान माल साठा' },
  { value: 'raw_materials', labelEn: 'Raw Materials (कच्चा माल)', labelMr: 'कच्चा माल' },
  { value: 'rent', labelEn: 'Shop / Land Rent (भाडे)', labelMr: 'दुकान / जागा भाडे' },
  { value: 'transportation', labelEn: 'Transport & Tempo (वाहतूक)', labelMr: 'वाहतूक खर्च' },
  { value: 'utilities', labelEn: 'Electricity & Water (वीज व पाणी बिल)', labelMr: 'वीज व पाणी बिल' },
  { value: 'wages', labelEn: 'Staff Wages / Labor (मजुरी / पगार)', labelMr: 'मजुरी / पगार' },
  { value: 'marketing', labelEn: 'Marketing & Signboard (जाहिरात)', labelMr: 'जाहिरात व फलक' },
  { value: 'equipment', labelEn: 'Equipment & Maintenance (यंत्रदुरुस्ती)', labelMr: 'यंत्रसामग्री व दुरुस्ती' },
  { value: 'other_expenses', labelEn: 'Other Expenses (इतर किरकोळ खर्च)', labelMr: 'इतर किरकोळ खर्च' },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultType = 'income',
}) => {
  const { language, t } = useLanguage();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('product_sales');
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setCategory(defaultType === 'income' ? 'product_sales' : 'inventory');
      setDate(new Date().toISOString().substring(0, 10));
      setNotes('');
    }
    setError('');
  }, [initialData, defaultType, isOpen]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'product_sales' : 'inventory');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!description.trim()) {
      setError('Please provide a description for this record.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!date) {
      setError('Please choose a valid transaction date.');
      return;
    }

    onSave({
      description: description.trim(),
      amount: Math.round(parsedAmount),
      type,
      category,
      date,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = categories.map((c) => ({
    value: c.value,
    label: language === 'mr' ? c.labelMr : c.labelEn,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        initialData
          ? `${t('txEdit')} ${type === 'income' ? t('totalIncome') : t('totalExpenses')}`
          : type === 'income'
          ? t('txAddIncome')
          : t('txAddExpense')
      }
      description="Record accurate cash or UPI transactions to maintain your financial health."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + {t('txFilterIncome')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            - {t('txFilterExpense')}
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <Input
          label={t('txDescription')}
          placeholder="e.g. Rice & Sugar Wholesale Purchase, Daily UPI Counter Sales"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('txAmount')}
            type="number"
            min="1"
            step="1"
            placeholder="0"
            prefixText="₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label={t('txDate')}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <Select
          label={t('txCategory')}
          value={category}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          options={categoryOptions}
        />

        <Input
          label={t('txNotes')}
          placeholder="Optional voucher number, vendor name, or Soundbox reference"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('btnCancel')}
          </Button>
          <Button
            type="submit"
            variant={type === 'income' ? 'primary' : 'danger'}
          >
            {t('btnSave')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
