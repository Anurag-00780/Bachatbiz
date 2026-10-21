import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { insuranceTopics, insuranceGlossary, InsuranceTopic } from '../../data/insuranceData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Store,
  Sprout,
  HeartPulse,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const InsuranceView: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<InsuranceTopic>(insuranceTopics[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'glossary' | 'checklist'>('overview');

  const checklistItems = [
    {
      title: 'Maintain Purchase Invoices & Stock Register',
      titleMr: 'खरेदी बिले व स्टॉक रजिस्टर नियमित अद्ययावत ठेवा',
      desc: 'Insurance surveyors require verifiable invoices from wholesale distributors to approve inventory loss claims.',
      descMr: 'नुकसान भरपाई मिळवण्यासाठी घाऊक व्यापाऱ्यांची अधिकृत बिले असणे अनिवार्य असते.',
    },
    {
      title: 'Notify the Insurer Within 24-48 Hours',
      titleMr: 'घटनेनंतर २४ ते ४८ तासांच्या आत कंपनीला कळवा',
      desc: 'Late notification is the #1 reason claims are delayed or rejected by insurance companies.',
      descMr: 'उशिरा माहिती दिल्यास विमा कंपनी दावा नामंजूर करू शकते. २४ तासांत टोल-फ्री नंबरवर कॉल करा.',
    },
    {
      title: 'File Police Panchnama & FIR for Burglary/Fire',
      titleMr: 'चोरी किंवा आगीच्या घटनेत त्वरित पोलीस पंचनामा व FIR नोंदवा',
      desc: 'Obtain an attested copy of the station diary entry and spot panchnama from the local police station.',
      descMr: 'स्थानिक पोलीस ठाण्यातून स्पॉट पंचनामा व एफआयआरची साक्षांकित प्रत मिळवा.',
    },
    {
      title: 'Never Clean or Discard Damaged Goods Before Surveyor Visit',
      titleMr: 'सर्व्हेअर येण्यापूर्वी नुकसान झालेला माल हलवू नका किंवा फेकू नका',
      desc: 'Take comprehensive timestamped photos and video of all affected items in their original state.',
      descMr: 'सर्व्हेअरच्या प्रत्यक्ष तपासणीसाठी माल आहे त्या स्थितीत ठेवा आणि स्पष्ट फोटो-व्हिडिओ काढून ठेवा.',
    },
    {
      title: 'Ensure Correct Nominee Name in Bank Records',
      titleMr: 'बँक खात्यात योग्य वारसदाराचे नाव नोंदवलेले असल्याची खात्री करा',
      desc: 'For PMJJBY/PMSBY, the legal nominee on your bank passbook directly receives the claim amount without court delays.',
      descMr: 'वारसदार निश्चित असल्यास वारसाला कोणत्याही कोर्टाच्या फेऱ्यांशिवाय विम्याची रक्कम थेट मिळते.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('insTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('insSubtitle')}</p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Protection Policies
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms Glossary
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claim Checklist
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Policy Category Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Protection Modules
            </span>

            {insuranceTopics.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              let Icon = ShieldCheck;
              if (topic.category === 'business') Icon = Store;
              if (topic.category === 'agriculture') Icon = Sprout;
              if (topic.category === 'personal_health') Icon = HeartPulse;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-1 ring-emerald-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {language === 'mr' ? topic.titleMr : topic.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {topic.premiumRange}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Policy Detail */}
          <div className="lg:col-span-8 space-y-5">
            <Card className="p-6 border-slate-200 space-y-5">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Comprehensive Coverage Guide
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {language === 'mr' ? selectedTopic.titleMr : selectedTopic.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'mr' ? selectedTopic.summaryMr : selectedTopic.summary}
                </p>
              </div>

              {/* Coverage & Premium Pill */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">Coverage Scope:</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    {language === 'mr' ? selectedTopic.coverageDetailsMr : selectedTopic.coverageDetails}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Typical Premium Cost:</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {selectedTopic.premiumRange}
                  </span>
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Important Exclusions (नुकसान भरपाई न मिळणाऱ्या बाबी)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
                  {(language === 'mr' ? selectedTopic.exclusionsMr : selectedTopic.exclusions).map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>

              {/* Claim Process Steps */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Claim Process Walkthrough (दावा करण्याची पद्धत)
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {(language === 'mr' ? selectedTopic.claimProcessMr : selectedTopic.claimProcess).map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-emerald-800">{i + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTopic.officialLink && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href={selectedTopic.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    <span>Visit Official Information Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insuranceGlossary.map((term, i) => (
            <Card key={i} className="p-5 border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'mr' ? term.termMr : term.term}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mr' ? term.definitionMr : term.definition}
              </p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'checklist' && (
        <Card className="p-6 border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('insChecklist')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maintain these critical business records in a waterproof file in your shop
            </p>
          </div>

          <div className="space-y-4">
            {checklistItems.map((item, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'mr' ? item.titleMr : item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'mr' ? item.descMr : item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
