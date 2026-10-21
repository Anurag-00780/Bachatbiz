import {
  User,
  EntrepreneurProfile,
  Transaction,
  Budget,
  SavingsGoal,
  LearningProgress,
} from '../types';
import {
  demoUser,
  demoProfile,
  demoTransactions,
  demoBudget,
  demoSavingsGoals,
  demoBookmarks,
  demoLearningProgress,
  DEMO_USER_ID,
} from '../data/seedData';

// User account list storage key
const USERS_STORAGE_KEY = 'bachatbiz_users_v1';
const ACTIVE_USER_ID_KEY = 'bachatbiz_active_user_id';

// Initialize users table with demo user if empty
export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initialUsers = [demoUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const parsed: User[] = JSON.parse(raw);
    if (!parsed.some((u) => u.id === DEMO_USER_ID)) {
      parsed.push(demoUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [demoUser];
  }
}

export function saveUser(user: User): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getActiveUserId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function setActiveUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
    }
  } catch {
    // ignore
  }
}

// User-scoped data access helpers
function getKey(type: string, userId: string): string {
  return `bachatbiz_${type}_${userId}`;
}

export function getUserProfile(userId: string): EntrepreneurProfile | null {
  try {
    const raw = localStorage.getItem(getKey('profile', userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        saveUserProfile(demoProfile);
        return demoProfile;
      }
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: EntrepreneurProfile): void {
  try {
    localStorage.setItem(getKey('profile', profile.userId), JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getUserTransactions(userId: string): Transaction[] {
  try {
    const raw = localStorage.getItem(getKey('transactions', userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        saveUserTransactions(userId, demoTransactions);
        return demoTransactions;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserTransactions(userId: string, transactions: Transaction[]): void {
  try {
    localStorage.setItem(getKey('transactions', userId), JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function getUserBudget(userId: string, month: string): Budget {
  try {
    const raw = localStorage.getItem(getKey(`budget_${month}`, userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        return demoBudget;
      }
      return {
        id: `budget-${month}-${Date.now()}`,
        userId,
        month,
        expectedIncome: 0,
        targetSavings: 0,
        limits: {
          inventory: 0,
          raw_materials: 0,
          rent: 0,
          transportation: 0,
          utilities: 0,
          wages: 0,
          marketing: 0,
          equipment: 0,
          other_expenses: 0,
        },
        updatedAt: new Date().toISOString(),
      };
    }
    return JSON.parse(raw);
  } catch {
    return demoBudget;
  }
}

export function saveUserBudget(budget: Budget): void {
  try {
    localStorage.setItem(getKey(`budget_${budget.month}`, budget.userId), JSON.stringify(budget));
  } catch (e) {
    console.error('Failed to save budget', e);
  }
}

export function getUserSavingsGoals(userId: string): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(getKey('goals', userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        saveUserSavingsGoals(userId, demoSavingsGoals);
        return demoSavingsGoals;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserSavingsGoals(userId: string, goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(getKey('goals', userId), JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save savings goals', e);
  }
}

export function getUserBookmarks(userId: string): string[] {
  try {
    const raw = localStorage.getItem(getKey('bookmarks', userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        saveUserBookmarks(userId, demoBookmarks);
        return demoBookmarks;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserBookmarks(userId: string, bookmarks: string[]): void {
  try {
    localStorage.setItem(getKey('bookmarks', userId), JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

export function getUserLearningProgress(userId: string): LearningProgress {
  try {
    const raw = localStorage.getItem(getKey('progress', userId));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        saveUserLearningProgress(demoLearningProgress);
        return demoLearningProgress;
      }
      return {
        userId,
        completedModuleIds: [],
        quizScores: {},
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      userId,
      completedModuleIds: [],
      quizScores: {},
    };
  }
}

export function saveUserLearningProgress(progress: LearningProgress): void {
  try {
    localStorage.setItem(getKey('progress', progress.userId), JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save learning progress', e);
  }
}

/**
 * Resets demo user data back to clean factory state
 */
export function resetDemoData(): void {
  saveUserProfile(demoProfile);
  saveUserTransactions(DEMO_USER_ID, demoTransactions);
  saveUserBudget(demoBudget);
  saveUserSavingsGoals(DEMO_USER_ID, demoSavingsGoals);
  saveUserBookmarks(DEMO_USER_ID, demoBookmarks);
  saveUserLearningProgress(demoLearningProgress);
}

/**
 * Deletes all data belonging to a user account
 */
export function deleteUserData(userId: string): void {
  const users = getAllUsers().filter((u) => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.removeItem(getKey('profile', userId));
  localStorage.removeItem(getKey('transactions', userId));
  localStorage.removeItem(getKey('goals', userId));
  localStorage.removeItem(getKey('bookmarks', userId));
  localStorage.removeItem(getKey('progress', userId));
  if (getActiveUserId() === userId) {
    setActiveUserId(null);
  }
}

/**
 * Exports complete user financial data as a structured JSON object
 */
export function exportUserBackup(userId: string) {
  const profile = getUserProfile(userId);
  const transactions = getUserTransactions(userId);
  const goals = getUserSavingsGoals(userId);
  const bookmarks = getUserBookmarks(userId);
  const progress = getUserLearningProgress(userId);

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    userId,
    profile,
    transactions,
    goals,
    bookmarks,
    progress,
  };
}
