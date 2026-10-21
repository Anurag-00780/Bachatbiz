import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/AppHeader';
import { Footer } from './components/layout/Footer';
import { TransactionModal } from './components/modals/TransactionModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { Transaction, TransactionType } from './types';

// Public Views
import { LandingView } from './views/public/LandingView';
import { FeaturesView } from './views/public/FeaturesView';
import { AboutView } from './views/public/AboutView';
import { PrivacyView } from './views/public/PrivacyView';
import { TermsView } from './views/public/TermsView';

// Auth Views
import { LoginView } from './views/auth/LoginView';
import { RegisterView } from './views/auth/RegisterView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { ResetPasswordView } from './views/auth/ResetPasswordView';

// App Views
import { OnboardingView } from './views/app/OnboardingView';
import { DashboardView } from './views/app/DashboardView';
import { ProfileView } from './views/app/ProfileView';
import { TransactionsView } from './views/app/TransactionsView';
import { FinancialPlannerView } from './views/app/FinancialPlannerView';
import { CalculatorView } from './views/app/CalculatorView';
import { SchemesView } from './views/app/SchemesView';
import { SchemeDetailView } from './views/app/SchemeDetailView';
import { InsuranceView } from './views/app/InsuranceView';
import { LearningView } from './views/app/LearningView';
import { LessonDetailView } from './views/app/LessonDetailView';
import { ChatbotView } from './views/app/ChatbotView';
import { ReportsView } from './views/app/ReportsView';
import { SettingsView } from './views/app/SettingsView';
import { HelpView } from './views/app/HelpView';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser, profile } = useAuth();
  const { addTransaction, editTransaction, budget, updateBudget } = useData();

  // Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    } catch {
      return '/';
    }
  });

  // Sidebar collapse & mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global modals
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('income');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  // Sync browser URL with popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    } catch {
      // safe fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route protection
  const publicPaths = ['/', '/features', '/about', '/privacy', '/terms', '/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicPaths.includes(currentPath);

  // Check if onboarding is needed
  useEffect(() => {
    if (isAuthenticated && currentUser && !currentUser.onboardingCompleted && currentPath !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [isAuthenticated, currentUser, currentPath]);

  // Modal helpers
  const handleOpenAddTx = (type: TransactionType = 'income') => {
    setEditingTx(null);
    setTxModalType(type);
    setTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setTxModalType(tx.type);
    setTxModalOpen(true);
  };

  const handleSaveTx = (data: {
    description: string;
    amount: number;
    type: TransactionType;
    category: any;
    date: string;
    notes?: string;
  }) => {
    if (editingTx) {
      editTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
  };

  // Render view router
  const renderCurrentView = () => {
    // Scheme detail route: /schemes/:id
    if (currentPath.startsWith('/schemes/')) {
      const schemeId = currentPath.replace('/schemes/', '');
      return <SchemeDetailView schemeId={schemeId} onNavigate={navigate} />;
    }

    // Learning module detail route: /learn/:id
    if (currentPath.startsWith('/learn/')) {
      const moduleId = currentPath.replace('/learn/', '');
      return <LessonDetailView moduleId={moduleId} onNavigate={navigate} />;
    }

    switch (currentPath) {
      // Public
      case '/':
        return <LandingView onNavigate={navigate} />;
      case '/features':
        return <FeaturesView onNavigate={navigate} />;
      case '/about':
        return <AboutView onNavigate={navigate} />;
      case '/privacy':
        return <PrivacyView />;
      case '/terms':
        return <TermsView />;

      // Auth
      case '/login':
        return <LoginView onNavigate={navigate} />;
      case '/register':
        return <RegisterView onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordView onNavigate={navigate} />;
      case '/reset-password':
        return <ResetPasswordView onNavigate={navigate} />;

      // App routes (if unauthenticated, automatically render login)
      case '/onboarding':
        return isAuthenticated ? <OnboardingView onNavigate={navigate} /> : <LoginView onNavigate={navigate} />;
      case '/dashboard':
        return isAuthenticated ? (
          <DashboardView
            onNavigate={navigate}
            onOpenAddTransaction={handleOpenAddTx}
            onOpenSetBudget={() => setBudgetModalOpen(true)}
          />
        ) : (
          <LoginView onNavigate={navigate} />
        );
      case '/profile':
        return isAuthenticated ? <ProfileView /> : <LoginView onNavigate={navigate} />;
      case '/transactions':
        return isAuthenticated ? (
          <TransactionsView
            onOpenAddModal={handleOpenAddTx}
            onOpenEditModal={handleOpenEditTx}
          />
        ) : (
          <LoginView onNavigate={navigate} />
        );
      case '/financial-planner':
        return isAuthenticated ? (
          <FinancialPlannerView onOpenSetBudget={() => setBudgetModalOpen(true)} />
        ) : (
          <LoginView onNavigate={navigate} />
        );
      case '/calculator':
        return <CalculatorView />;
      case '/schemes':
        return <SchemesView onNavigate={navigate} />;
      case '/insurance':
        return <InsuranceView />;
      case '/learn':
        return <LearningView onNavigate={navigate} />;
      case '/chatbot':
        return <ChatbotView onNavigate={navigate} />;
      case '/reports':
        return isAuthenticated ? <ReportsView /> : <LoginView onNavigate={navigate} />;
      case '/settings':
      case '/settings/security':
        return isAuthenticated ? <SettingsView onNavigate={navigate} /> : <LoginView onNavigate={navigate} />;
      case '/help':
        return <HelpView />;

      default:
        return <LandingView onNavigate={navigate} />;
    }
  };

  // If user is inside authenticated dashboard mode
  const showAuthenticatedLayout = isAuthenticated && !isPublicRoute && currentPath !== '/onboarding';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-800 antialiased font-sans">
      {showAuthenticatedLayout ? (
        <div className="flex-1 flex w-full">
          {/* Sidebar */}
          <Sidebar
            currentPath={currentPath}
            onNavigate={navigate}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />

          {/* Main workspace content area */}
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader
              currentPath={currentPath}
              onNavigate={navigate}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onOpenAddTransactionModal={() => handleOpenAddTx('income')}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {renderCurrentView()}
            </main>
            <Footer onNavigate={navigate} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <Navbar currentPath={currentPath} onNavigate={navigate} />
          <main className="flex-1">{renderCurrentView()}</main>
          <Footer onNavigate={navigate} />
        </div>
      )}

      {/* Global Modals */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        onSave={handleSaveTx}
        initialData={editingTx}
        defaultType={txModalType}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        currentBudget={budget}
        onSave={updateBudget}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
