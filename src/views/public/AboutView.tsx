import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Sprout, Target, Shield, Users, Landmark } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-6 h-6 text-emerald-300" />
        </div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          About BachatBiz · बचतबिझ
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Save Smart. Grow Your Business.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          BachatBiz is a digital financial assistance and business management platform designed to help rural entrepreneurs, shopkeepers, farmers, artisans, and small business owners in Maharashtra manage finances, discover financial support schemes, plan business growth, and improve financial literacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 border-slate-200">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Target className="w-5 h-5 text-emerald-700" />
            <span>Our Mission</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            To bridge the digital divide between rural commerce and institutional finance by providing free, accessible, and bilingual business tools. We believe no small shopkeeper should suffer from debt traps or miss out on government subsidies simply due to a lack of simple bookkeeping tools.
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <Landmark className="w-5 h-5 text-emerald-700" />
            <span>Maharashtra Regional Focus</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tailored specifically for the trade dynamics of Maharashtra’s 36 districts: from APMC grain markets in Nashik and Kolhapur to handicraft clusters in Paithan and retail hubs across Pune, Nagpur, Chhatrapati Sambhajinagar, and Solapur.
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          Core Operating Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Empathy for Micro-Enterprise</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for entrepreneurs who manage counter sales, family needs, and vendor credits simultaneously. No complex accounting software jargon.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero Commercial Exploitation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never promote unregulated payday loans or fake credit cards. All interest calculations use standard reducing-balance math.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Bilingual Accessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full Marathi (मराठी) support ensures language is never an obstacle to mastering loan calculations or claiming government subsidies.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800">
          Academic & Educational Project Context
        </h4>
        <p>
          BachatBiz is developed as a complete full-stack demonstration for small business financial empowerment. It runs completely offline/locally without requiring paid commercial APIs or database subscriptions.
        </p>
      </div>
    </div>
  );
};
