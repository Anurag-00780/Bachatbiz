import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SavingsGoal } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  }) => void;
  initialData?: SavingsGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTargetAmount(initialData.targetAmount.toString());
      setCurrentAmount(initialData.currentAmount.toString());
      setTargetDate(initialData.targetDate);
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      // default 6 months in future
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setTargetDate(d.toISOString().substring(0, 10));
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (!title.trim()) {
      setError('Please enter a goal title (e.g. Deep Freezer, Solar Backup)');
      return;
    }

    if (isNaN(target) || target <= 0) {
      setError('Target savings amount must be greater than ₹0');
      return;
    }

    if (!targetDate) {
      setError('Please choose a target date');
      return;
    }

    onSave({
      title: title.trim(),
      targetAmount: Math.round(target),
      currentAmount: Math.round(current),
      targetDate,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : t('fpAddGoal')}
      description="Define tangible business milestones and track savings discipline."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <Input
          label={t('fpGoalTitle')}
          placeholder="e.g. 300L Commercial Deep Freezer, Delivery Bike"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('fpTargetAmount')}
            type="number"
            min="1"
            prefixText="₹"
            placeholder="50000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />

          <Input
            label={t('fpCurrentSaved')}
            type="number"
            min="0"
            prefixText="₹"
            placeholder="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        </div>

        <Input
          label={t('fpTargetDate')}
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />

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
