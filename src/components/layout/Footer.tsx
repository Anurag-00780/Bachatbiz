import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldAlert, Sprout, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      {/* Helpline Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>National Cyber Financial Fraud Helpline:</strong> Dial{' '}
              <a href="tel:1930" className="underline font-bold text-white hover:text-emerald-300">
                1930
              </a>{' '}
              immediately or file a complaint at{' '}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-white hover:text-emerald-300 inline-flex items-center gap-0.5"
              >
                cybercrime.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>
          <span className="text-[11px] text-emerald-300/80">
            Never share your 6-digit OTP or UPI PIN with anyone.
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-md bg-emerald-700 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-base font-bold">BachatBiz</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('tagline')}
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Empowering shopkeepers, farmers, artisans, and women entrepreneurs across Maharashtra with digital financial tools and literacy.
            </p>
          </div>

          {/* Col 2: Financial Tools */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Financial Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/transactions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideTransactions')} (जमा-खर्च)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideCalculator')} (EMI गणक)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/financial-planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sidePlanner')} (आर्थिक नियोजन)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/reports')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideReports')} (नफा-तोटा अहवाल)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government & Support */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Support & Education
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/schemes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideSchemes')} (CMEGP, Mudra, PMEGP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insurance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideInsurance')} (पीक व व्यवसाय विमा)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/learn')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideLearning')} (साक्षरता अकादमी)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/chatbot')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideChatbot')} (वित्तीय सहाय्यक)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/help')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('sideHelp')} & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Disclaimers
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="pt-6 border-t border-slate-800 text-[11px] leading-relaxed text-slate-500">
          <p className="mb-2">
            <strong>Official Financial Disclaimer:</strong> {t('officialDisclaimer')} BachatBiz is not a bank, non-banking financial company (NBFC), or registered investment advisor under SEBI/RBI regulations. Information regarding government schemes and loan programs is curated from official public gazettes and government portals for educational awareness. Scheme approvals and loan disbursements are solely at the discretion of respective government nodal departments and lending banks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800/60 gap-2">
            <span>© 2026 BachatBiz. All rights reserved. Designed for Maharashtra entrepreneurs.</span>
            <span>Local data storage · End-to-end user isolation · No hidden charges</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
