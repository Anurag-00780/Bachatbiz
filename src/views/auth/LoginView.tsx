import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, Sparkles, Sprout } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        onNavigate('/dashboard');
      } else {
        setError(res.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('authLoginTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to manage your Maharashtra business ledger & schemes
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Evaluation & Demo Access</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Testing or evaluating BachatBiz? Log in instantly with our pre-configured Maharashtra Kirana business (3 months of transactions, active budgets, and savings goals).
          </p>
          <Button
            type="button"
            variant="saffron"
            size="sm"
            onClick={handleDemoLogin}
            className="w-full font-semibold shadow-xs"
          >
            Sign In with 1-Click Demo Account
          </Button>
        </div>

        <Card className="p-6 space-y-5 border-slate-200">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label={t('authEmail')}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {t('authPassword')}
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                >
                  {t('authForgotPassword')}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-600"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 cursor-pointer">
                {t('authRememberMe')}
              </label>
            </div>

            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              className="w-full font-semibold"
            >
              Sign In to BachatBiz
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>{t('authDontHaveAccount')} </span>
            <button
              onClick={() => onNavigate('/register')}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500/50 cursor-pointer"
            >
              {t('navRegister')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
