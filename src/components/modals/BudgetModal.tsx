import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Budget, ExpenseCategory } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: Budget;
  onSave: (updated: Budget) => void;
}

const CATEGORY_FIELDS: { key: ExpenseCategory; labelEn: string; labelMr: string }[] = [
  { key: 'inventory', labelEn: 'Inventory / Shop Stock', labelMr: 'दुकान माल साठा' },
  { key: 'rent', labelEn: 'Shop / Land Rent', labelMr: 'दुकान / जागा भाडे' },
  { key: 'transportation', labelEn: 'Transportation & Freight', labelMr: 'वाहतूक खर्च' },
  { key: 'utilities', labelEn: 'Electricity & Water Utilities', labelMr: 'वीज व पाणी बिल' },
  { key: 'wages', labelEn: 'Staff Wages / Labor', labelMr: 'मजुरी / पगार' },
  { key: 'marketing', labelEn: 'Marketing & Signage', labelMr: 'जाहिरात व फलक' },
  { key: 'equipment', labelEn: 'Equipment & Tool Repairs', labelMr: 'यंत्रसामग्री व दुरुस्ती' },
  { key: 'raw_materials', labelEn: 'Raw Materials', labelMr: 'कच्चा माल' },
  { key: 'other_expenses', labelEn: 'Miscellaneous / Other Expenses', labelMr: 'इतर किरकोळ खर्च' },
];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}) => {
  const { language, t } = useLanguage();

  const [expectedIncome, setExpectedIncome] = useState(
    currentBudget.expectedIncome.toString()
  );
  const [targetSavings, setTargetSavings] = useState(
    currentBudget.targetSavings.toString()
  );
  const [limits, setLimits] = useState<Record<ExpenseCategory, string>>(() => {
    const initial: Record<string, string> = {};
    for (const cat of CATEGORY_FIELDS) {
      initial[cat.key] = (currentBudget.limits[cat.key] || 0).toString();
    }
    return initial as Record<ExpenseCategory, string>;
  });

  const handleLimitChange = (cat: ExpenseCategory, val: string) => {
    setLimits((prev) => ({ ...prev, [cat]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericLimits: Record<ExpenseCategory, number> = {
      inventory: 0,
      raw_materials: 0,
      rent: 0,
      transportation: 0,
      utilities: 0,
      wages: 0,
      marketing: 0,
      equipment: 0,
      other_expenses: 0,
    };

    for (const cat of CATEGORY_FIELDS) {
      numericLimits[cat.key] = Math.max(0, parseInt(limits[cat.key] || '0', 10));
    }

    const updated: Budget = {
      ...currentBudget,
      expectedIncome: Math.max(0, parseInt(expectedIncome || '0', 10)),
      targetSavings: Math.max(0, parseInt(targetSavings || '0', 10)),
      limits: numericLimits,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('fpSetBudget')}
      description="Establish spending guardrails so monthly expenses do not erode business cash reserves."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <Input
            label="Expected Monthly Revenue (अंदाजे महसूल ₹)"
            type="number"
            min="0"
            prefixText="₹"
            value={expectedIncome}
            onChange={(e) => setExpectedIncome(e.target.value)}
          />

          <Input
            label="Monthly Target Savings (बचत उद्दिष्ट ₹)"
            type="number"
            min="0"
            prefixText="₹"
            value={targetSavings}
            onChange={(e) => setTargetSavings(e.target.value)}
          />
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Monthly Expense Category Limits (मासिक खर्च मर्यादा)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {CATEGORY_FIELDS.map((cat) => (
              <Input
                key={cat.key}
                label={language === 'mr' ? cat.labelMr : cat.labelEn}
                type="number"
                min="0"
                prefixText="₹"
                value={limits[cat.key]}
                onChange={(e) => handleLimitChange(cat.key, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('btnCancel')}
          </Button>
          <Button type="submit">{t('btnSave')}</Button>
        </div>
      </form>
    </Modal>
  );
};
