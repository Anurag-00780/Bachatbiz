import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Globe, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenMobileMenu: () => void;
  onOpenAddTransactionModal?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenMobileMenu,
  onOpenAddTransactionModal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, profile } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  // Generate breadcrumb
  const pathParts = currentPath.split('/').filter(Boolean);
  const breadcrumb = pathParts.length > 0
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1).replace(/-/g, ' ')
    : 'Dashboard';

  const userInitials = (currentUser?.fullName || 'Business Owner')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isDemo = currentUser?.id === 'demo_bachatbiz_user';

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="hover:text-emerald-800 transition-colors"
          >
            BachatBiz
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{breadcrumb}</span>
        </div>

        {/* Demo Account Indicator */}
        {isDemo && (
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Demo Mode (Nashik Kirana)
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Add Transaction Button */}
        {onOpenAddTransactionModal && (
          <Button
            size="sm"
            onClick={onOpenAddTransactionModal}
            className="hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4" />
            <span>{t('actionAddIncome')} / {t('actionAddExpense')}</span>
          </Button>
        )}

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          title="Switch Language / भाषा बदला"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'en' ? 'मराठी' : 'English'}</span>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => onNavigate('/profile')}
          className="flex items-center gap-2.5 pl-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-xs font-bold border border-emerald-900 shadow-2xs group-hover:ring-2 group-hover:ring-emerald-700/30 transition-all">
            {userInitials}
          </div>
          <span className="hidden sm:block text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate max-w-[120px]">
            {profile?.displayName || currentUser?.fullName}
          </span>
        </button>
      </div>
    </header>
  );
};
