import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, EntrepreneurProfile, Language } from '../types';
import {
  getAllUsers,
  saveUser,
  getActiveUserId,
  setActiveUserId,
  getUserProfile,
  saveUserProfile,
  resetDemoData,
} from '../lib/storage';
import { DEMO_USER_ID, demoUser, demoProfile } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  profile: EntrepreneurProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  register: (fullName: string, email: string, pass: string, lang: Language) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<EntrepreneurProfile>) => void;
  completeOnboarding: (data: Omit<EntrepreneurProfile, 'userId' | 'updatedAt'>) => void;
  resetDemoState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = getActiveUserId();
    if (activeId) {
      const users = getAllUsers();
      const found = users.find((u) => u.id === activeId);
      if (found) {
        setCurrentUser(found);
        setProfile(getUserProfile(found.id));
      } else {
        setActiveUserId(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    // Trim and normalize email
    const cleanEmail = email.trim().toLowerCase();
    const users = getAllUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'Invalid email address or password. Please check your credentials.' };
    }

    setCurrentUser(found);
    setActiveUserId(found.id);
    setProfile(getUserProfile(found.id));
    return { success: true };
  };

  const loginAsDemo = () => {
    resetDemoData();
    const users = getAllUsers();
    let demo = users.find((u) => u.id === DEMO_USER_ID);
    if (!demo) {
      demo = demoUser;
      saveUser(demo);
    }
    setCurrentUser(demo);
    setActiveUserId(DEMO_USER_ID);
    setProfile(getUserProfile(DEMO_USER_ID) || demoProfile);
  };

  const register = async (
    fullName: string,
    email: string,
    _pass: string,
    lang: Language
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getAllUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      fullName: fullName.trim(),
      preferredLanguage: lang,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setActiveUserId(newUser.id);
    setProfile(null);

    return { success: true };
  };

  const logout = () => {
    setActiveUserId(null);
    setCurrentUser(null);
    setProfile(null);
  };

  const completeOnboarding = (data: Omit<EntrepreneurProfile, 'userId' | 'updatedAt'>) => {
    if (!currentUser) return;

    const newProfile: EntrepreneurProfile = {
      ...data,
      userId: currentUser.id,
      updatedAt: new Date().toISOString(),
    };

    saveUserProfile(newProfile);
    setProfile(newProfile);

    const updatedUser: User = {
      ...currentUser,
      onboardingCompleted: true,
    };
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const updateProfile = (updated: Partial<EntrepreneurProfile>) => {
    if (!currentUser || !profile) return;
    const merged: EntrepreneurProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(merged);
    setProfile(merged);
  };

  const resetDemoState = () => {
    if (currentUser?.id === DEMO_USER_ID) {
      resetDemoData();
      setProfile(getUserProfile(DEMO_USER_ID));
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        isAuthenticated: !!currentUser,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        resetDemoState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
