import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sprout, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
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
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-500">
            Recover access to your BachatBiz financial account
          </p>
        </div>

        <Card className="p-6 space-y-5 border-slate-200">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('authEmail')}
                type="email"
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                helperText="Enter your registered business account email address."
              />

              <Button type="submit" className="w-full font-semibold">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Password Reset Initiated
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In this local development deployment without third-party mailer keys, click below to set your new password immediately.
              </p>
              <Button
                onClick={() => onNavigate('/reset-password')}
                className="w-full font-semibold"
              >
                Proceed to Set New Password
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
