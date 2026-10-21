import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sprout, Check, Shield } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (path: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength check
  const hasMinLength = password.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!termsAgreed) {
      setError('Please accept the educational terms to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(fullName, email, password, prefLang);
      if (res.success) {
        setLanguage(prefLang);
        onNavigate('/onboarding');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch {
      setError('An error occurred during account creation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('authRegisterTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            Join thousands of small business owners across Maharashtra
          </p>
        </div>

        <Card className="p-6 space-y-5 border-slate-200">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('authFullName')}
              placeholder="e.g. Ramesh Kadam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />

            <Input
              label={t('authEmail')}
              type="email"
              placeholder="name@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Select
              label={t('authLanguagePref')}
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value as Language)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'mr', label: 'मराठी (Marathi)' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('authPassword')}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <Input
                label={t('authConfirmPassword')}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Password strength guide */}
            {password.length > 0 && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </span>
                  <span className={hasMinLength ? 'text-emerald-800' : 'text-slate-500'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumberOrSymbol ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </span>
                  <span className={hasNumberOrSymbol ? 'text-emerald-800' : 'text-slate-500'}>
                    Contains number or symbol
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-600 mt-0.5"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 leading-normal cursor-pointer">
                {t('authTermsAgree')}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/terms')}
                  className="text-emerald-800 underline hover:text-emerald-950 font-medium"
                >
                  Terms & Disclaimers
                </button>
              </label>
            </div>

            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              className="w-full font-semibold"
            >
              Create Account & Start Onboarding
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>{t('authAlreadyHaveAccount')} </span>
            <button
              onClick={() => onNavigate('/login')}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500/50 cursor-pointer"
            >
              {t('navLogin')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
