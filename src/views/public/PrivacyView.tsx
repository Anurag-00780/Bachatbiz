import React from 'react';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          Privacy Policy & Data Protection
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Business Data Belongs Strictly to You
        </h1>
        <p className="text-xs text-slate-500">Last updated: October 2026 · BachatBiz Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2 border-slate-200">
          <Lock className="w-5 h-5 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900">Local Browser Isolation</h3>
          <p className="text-[11px] text-slate-600">
            Transactions, budgets, and business metrics are partitioned per user account in browser storage.
          </p>
        </Card>

        <Card className="p-4 space-y-2 border-slate-200">
          <EyeOff className="w-5 h-5 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900">Zero Commercial Data Sales</h3>
          <p className="text-[11px] text-slate-600">
            We never sell or distribute your sales numbers, phone numbers, or ledger balances to advertising networks.
          </p>
        </Card>

        <Card className="p-4 space-y-2 border-slate-200">
          <FileText className="w-5 h-5 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900">Full Portability & Deletion</h3>
          <p className="text-[11px] text-slate-600">
            Export all financial records in one click to JSON or CSV, or wipe your account completely anytime.
          </p>
        </Card>
      </div>

      <Card className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed border-slate-200">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When registering, BachatBiz only asks for a name, email address, password, and preferred language. Onboarding collects basic business category and Maharashtra district to customize relevant scheme recommendations. We NEVER ask for, store, or process:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Bank account passwords or net banking credentials</li>
            <li>Aadhaar numbers or biometric details</li>
            <li>Debit/Credit card CVV numbers or ATM PINs</li>
            <li>UPI PINs or One-Time Passwords (OTPs)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. How Data is Handled</h2>
          <p>
            All income, expense, and budget calculations are processed locally within your browser application runtime. When you record a transaction or set a savings goal, it is saved under your isolated user ID in client storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. AI Assistant Communications</h2>
          <p>
            The BachatBiz Financial Assistant primarily uses a local rule-based knowledge engine containing verified scheme rules and financial literacy answers. If an optional server-side AI model is connected, questions are processed statelessly without storing conversations for training purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. User Rights & Data Deletion</h2>
          <p>
            Under the Settings tab, you have full control over your data. You can download an offline JSON backup of your records or permanently delete your account. Deletion immediately purges all associated transactions, goals, and profile information.
          </p>
        </section>
      </Card>
    </div>
  );
};
