import React from 'react';
import { Card } from '../../components/ui/Card';
import { AlertCircle } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          Terms of Service & Financial Disclaimers
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms & Responsible Usage
        </h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Important Financial Regulatory Notice</p>
          <p className="leading-relaxed">
            BachatBiz is an educational business management software platform. It is NOT a bank, non-banking financial company (NBFC), payment gateway, or registered investment advisory under Reserve Bank of India (RBI) or SEBI regulations.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed border-slate-200">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using BachatBiz (&ldquo;the Application&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. No Guarantee of Loan Approvals or Subsidies</h2>
          <p>
            All information regarding government schemes (such as PMEGP, CMEGP Maharashtra, PM Mudra Yojana, PM SVANidhi, and Annasaheb Patil IRSY) is curated from publicly accessible official government circulars. BachatBiz does not guarantee that any applicant will qualify for or receive a loan or capital subsidy. Loan approvals and disbursements remain strictly within the sole discretion of respective commercial/cooperative banks and government nodal task forces.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Nature of Financial Calculations</h2>
          <p>
            The loan EMI calculator, business cash flow forecasts, and affordability analyses are provided purely as educational planning simulations. Actual bank loan terms may vary based on credit bureau scores, bank MCLR/repo rate adjustments, processing charges, insurance premiums, and specific loan covenants.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Prohibited Misuse</h2>
          <p>
            Users agree not to use the application to process illegal transactions, fabricate false financial claims for fraudulent credit applications, or impersonate government scheme officers.
          </p>
        </section>
      </Card>
    </div>
  );
};
