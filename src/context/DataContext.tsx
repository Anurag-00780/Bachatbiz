import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal, LearningProgress } from '../types';
import { useAuth } from './AuthContext';
import {
  getUserTransactions,
  saveUserTransactions,
  getUserBudget,
  saveUserBudget,
  getUserSavingsGoals,
  saveUserSavingsGoals,
  getUserBookmarks,
  saveUserBookmarks,
  getUserLearningProgress,
  saveUserLearningProgress,
} from '../lib/storage';

interface DataContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  budget: Budget;
  updateBudget: (budget: Budget) => void;

  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  bookmarkedSchemeIds: string[];
  toggleBookmark: (schemeId: string) => void;

  learningProgress: LearningProgress;
  markModuleCompleted: (moduleId: string) => void;
  recordQuizAttempt: (moduleId: string, score: number, total: number) => void;

  refreshAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const currentMonthKey = new Date().toISOString().substring(0, 7);
  const [budget, setBudget] = useState<Budget>(() => getUserBudget(userId, currentMonthKey));
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [bookmarkedSchemeIds, setBookmarkedSchemeIds] = useState<string[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    userId,
    completedModuleIds: [],
    quizScores: {},
  });

  const loadUserData = useCallback(() => {
    if (!userId) {
      setTransactions([]);
      setSavingsGoals([]);
      setBookmarkedSchemeIds([]);
      setLearningProgress({ userId: '', completedModuleIds: [], quizScores: {} });
      return;
    }
    setTransactions(getUserTransactions(userId));
    setBudget(getUserBudget(userId, currentMonthKey));
    setSavingsGoals(getUserSavingsGoals(userId));
    setBookmarkedSchemeIds(getUserBookmarks(userId));
    setLearningProgress(getUserLearningProgress(userId));
  }, [userId, currentMonthKey]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Transactions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return;
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveUserTransactions(userId, updated);
  };

  const editTransaction = (id: string, partial: Partial<Transaction>) => {
    if (!userId) return;
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...partial } : t));
    setTransactions(updated);
    saveUserTransactions(userId, updated);
  };

  const deleteTransaction = (id: string) => {
    if (!userId) return;
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveUserTransactions(userId, updated);
  };

  // Budget
  const updateBudget = (newBudget: Budget) => {
    setBudget(newBudget);
    saveUserBudget(newBudget);
  };

  // Savings Goals
  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return;
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
    };
    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    saveUserSavingsGoals(userId, updated);
  };

  const updateSavingsGoal = (id: string, partial: Partial<SavingsGoal>) => {
    if (!userId) return;
    const updated = savingsGoals.map((g) => (g.id === id ? { ...g, ...partial } : g));
    setSavingsGoals(updated);
    saveUserSavingsGoals(userId, updated);
  };

  const deleteSavingsGoal = (id: string) => {
    if (!userId) return;
    const updated = savingsGoals.filter((g) => g.id !== id);
    setSavingsGoals(updated);
    saveUserSavingsGoals(userId, updated);
  };

  // Bookmarks
  const toggleBookmark = (schemeId: string) => {
    if (!userId) return;
    const isBookmarked = bookmarkedSchemeIds.includes(schemeId);
    const updated = isBookmarked
      ? bookmarkedSchemeIds.filter((id) => id !== schemeId)
      : [...bookmarkedSchemeIds, schemeId];
    setBookmarkedSchemeIds(updated);
    saveUserBookmarks(userId, updated);
  };

  // Learning Progress
  const markModuleCompleted = (moduleId: string) => {
    if (!userId) return;
    if (learningProgress.completedModuleIds.includes(moduleId)) return;
    const updated: LearningProgress = {
      ...learningProgress,
      userId,
      completedModuleIds: [...learningProgress.completedModuleIds, moduleId],
    };
    setLearningProgress(updated);
    saveUserLearningProgress(updated);
  };

  const recordQuizAttempt = (moduleId: string, score: number, total: number) => {
    if (!userId) return;
    const passed = score >= Math.ceil(total * 0.6);
    const updated: LearningProgress = {
      ...learningProgress,
      userId,
      completedModuleIds: Array.from(new Set([...learningProgress.completedModuleIds, moduleId])),
      quizScores: {
        ...learningProgress.quizScores,
        [moduleId]: {
          score,
          total,
          passed,
          attemptDate: new Date().toISOString().substring(0, 10),
        },
      },
    };
    setLearningProgress(updated);
    saveUserLearningProgress(updated);
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        budget,
        updateBudget,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        bookmarkedSchemeIds,
        toggleBookmark,
        learningProgress,
        markModuleCompleted,
        recordQuizAttempt,
        refreshAllData: loadUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
