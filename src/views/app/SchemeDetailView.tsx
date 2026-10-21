import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useData } from '../../context/DataContext';
import { verifiedSchemes } from '../../data/schemesData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  ListOrdered,
  Landmark,
  Calendar,
} from 'lucide-react';

interface SchemeDetailViewProps {
  schemeId: string;
  onNavigate: (path: string) => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  schemeId,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { bookmarkedSchemeIds, toggleBookmark } = useData();

  const scheme = verifiedSchemes.find((s) => s.id === schemeId) || verifiedSchemes[0];
  const isBookmarked = bookmarkedSchemeIds.includes(scheme.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate('/schemes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes Directory</span>
        </button>

        <Button
          size="sm"
          variant={isBookmarked ? 'saffron' : 'outline'}
          onClick={() => toggleBookmark(scheme.id)}
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{t('schemesBookmarked')}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t('schemesBookmark')}</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Header Banner */}
      <Card className="p-6 border-slate-200 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white space-y-3">
        <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
          {scheme.agency}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
          {language === 'mr' ? scheme.nameMr : scheme.name}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          {language === 'mr' ? scheme.shortDescriptionMr : scheme.shortDescription}
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs text-emerald-200 font-mono">
          <span>Max Limit: {scheme.maxFunding}</span>
          <span>·</span>
          <span>Subsidy: {scheme.subsidyRate}</span>
        </div>
      </Card>

      {/* Fraud Warning Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Official Verification & Anti-Fraud Notice</p>
          <p className="leading-relaxed">
            Government schemes like {scheme.name} NEVER require upfront cash commission to agents or brokers. Always apply directly via the verified government portal below or visit your authorized nationalized/cooperative bank branch.
          </p>
        </div>
      </div>

      {/* Eligibility Checklist */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            {t('schemesEligible')}
          </h2>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-700">
          {(language === 'mr' ? scheme.eligibilityMr : scheme.eligibility).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                ✓
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Required Documents Checklist */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCheck2 className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            {t('schemesDocs')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          {(language === 'mr' ? scheme.documentsRequiredMr : scheme.documentsRequired).map((doc, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start gap-2"
            >
              <span className="font-mono text-emerald-800 font-bold text-xs">{idx + 1}.</span>
              <span className="leading-relaxed">{doc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Application Steps */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ListOrdered className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            {t('schemesApplySteps')}
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          {(language === 'mr' ? scheme.applicationStepsMr : scheme.applicationSteps).map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Official Portal Link Card */}
      <Card className="p-6 border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-emerald-950">
            Apply on Official Government Portal
          </h3>
          <p className="text-xs text-emerald-800 mt-0.5">
            Portal: {scheme.portalLabel} · Verified: {scheme.lastVerifiedDate}
          </p>
        </div>

        <a
          href={scheme.officialPortal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0"
        >
          <span>Open {scheme.portalLabel}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </Card>

      {/* Legal Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
        <strong>Disclaimer:</strong> {scheme.disclaimer} BachatBiz provides official information compiled from government gazettes. We do not charge fees or guarantee sanctions.
      </div>
    </div>
  );
};
