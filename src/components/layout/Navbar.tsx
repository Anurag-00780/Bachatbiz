import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Menu, X, Globe, Sprout } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const navLinks = [
    { label: t('navHome'), path: '/' },
    { label: t('navFeatures'), path: '/features' },
    { label: t('navHowItWorks'), path: '/#how-it-works' },
    { label: t('navLearning'), path: '/learn' },
    { label: t('navAbout'), path: '/about' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 text-left text-slate-900 focus-visible:outline-emerald-700 whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-900 transition-colors">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
              Bachat<span className="text-emerald-700">Biz</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-slate-500 border-l border-slate-300 pl-2">
              बचतबिझ
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean single-line links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath === link.path ? 'text-emerald-800 font-semibold' : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Language toggle & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Switch Language / भाषा बदला"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleNavClick('/dashboard')}>
                {t('sideDashboard')}
              </Button>
              <Button size="sm" variant="ghost" onClick={logout}>
                {t('sideLogout')}
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={loginAsDemo}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1.5 underline decoration-emerald-500/50 hover:decoration-emerald-700 cursor-pointer whitespace-nowrap"
              >
                {t('navDemo')}
              </button>
              <Button size="sm" variant="outline" onClick={() => handleNavClick('/login')}>
                {t('navLogin')}
              </Button>
              <Button size="sm" onClick={() => handleNavClick('/register')}>
                {t('navRegister')}
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Button size="sm" variant="outline" onClick={() => handleNavClick('/login')} className="w-full">
                  {t('navLogin')}
                </Button>
                <Button size="sm" onClick={() => handleNavClick('/register')} className="w-full">
                  {t('navRegister')}
                </Button>
                <Button
                  size="sm"
                  variant="saffron"
                  onClick={() => {
                    loginAsDemo();
                    onNavigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  {t('navDemo')} (One-Click)
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => handleNavClick('/dashboard')} className="w-full">
                {t('sideDashboard')}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
