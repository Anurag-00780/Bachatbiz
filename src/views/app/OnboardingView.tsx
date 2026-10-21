import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  BusinessCategory,
  BusinessStage,
  Language,
} from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  Store,
  Target,
  Sparkles,
} from 'lucide-react';

interface OnboardingViewProps {
  onNavigate: (path: string) => void;
}

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Chhatrapati Sambhajinagar (Aurangabad)',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Dharashiv (Osmanabad)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { currentUser, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Personal Preferences
  const [displayName, setDisplayName] = useState(currentUser?.fullName || '');
  const [preferredLang, setPreferredLang] = useState<Language>(currentUser?.preferredLanguage || language);

  // Step 2: Business Details
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('kirana_retail');
  const [district, setDistrict] = useState('Nashik');
  const [locationType, setLocationType] = useState<'rural' | 'semi_urban' | 'urban'>('semi_urban');
  const [businessStage, setBusinessStage] = useState<BusinessStage>('established');

  // Step 3: Financial Goals
  const [mainGoal, setMainGoal] = useState('');
  const [fundingReq, setFundingReq] = useState('');
  const [savingsTarget, setSavingsTarget] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');

  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!displayName.trim()) {
        setError('Please enter your display name.');
        return;
      }
      setLanguage(preferredLang);
      setStep(2);
    } else if (step === 2) {
      if (!businessName.trim()) {
        setError('Please enter your business or shop name.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!mainGoal.trim()) {
        setError('Please share your primary business goal.');
        return;
      }
      setStep(4);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      displayName: displayName.trim(),
      businessName: businessName.trim(),
      category,
      district,
      locationType,
      businessStage,
      mainGoal: mainGoal.trim(),
      fundingRequirement: fundingReq ? parseInt(fundingReq, 10) : undefined,
      savingsTarget: savingsTarget ? parseInt(savingsTarget, 10) : undefined,
      monthlyRevenueEstimate: monthlyRevenue ? parseInt(monthlyRevenue, 10) : undefined,
      monthlyExpenseEstimate: monthlyExpenses ? parseInt(monthlyExpenses, 10) : undefined,
    });
    onNavigate('/dashboard');
  };

  const categoryOptions = [
    { value: 'kirana_retail', label: 'Kirana / Grocery Retail (किराणा व किरकोळ)' },
    { value: 'agriculture', label: 'Agriculture & Allied / Dairy (शेती व दुग्ध व्यवसाय)' },
    { value: 'artisan_handicraft', label: 'Handicraft & Artisan (हस्तकला व कारागीर)' },
    { value: 'local_services', label: 'Local Services / Repair Shop (दुरुस्ती व स्थानिक सेवा)' },
    { value: 'food_dairy', label: 'Food, Catering & Bakery (खाद्यपदार्थ व बेकरी)' },
    { value: 'textiles_garments', label: 'Textiles & Tailoring (कापड व टेलरिंग)' },
    { value: 'manufacturing_small', label: 'Small Workshop / Manufacturing (लघु उद्योग)' },
    { value: 'other', label: 'Other Small Business (इतर व्यवसाय)' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                    : step > s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
          <span>{t('obStep1Title')}</span>
          <span>{t('obStep2Title')}</span>
          <span>{t('obStep3Title')}</span>
          <span>{t('obStep4Title')}</span>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-sm">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Personal Preferences */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('obStep1Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">
                How should we address you and in what language?
              </p>
            </div>

            <Input
              label="Your Preferred Display Name"
              placeholder="e.g. Sachin Patil, Sunita Kadam"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <Select
              label={t('authLanguagePref')}
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value as Language)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'mr', label: 'मराठी (Marathi)' },
              ]}
              helperText="You can change language anytime from the top navigation bar."
            />
          </div>
        )}

        {/* STEP 2: Business Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('obStep2Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide details about your venture in Maharashtra
              </p>
            </div>

            <Input
              label={t('obBusinessName')}
              placeholder="e.g. Shree Ganesh Kirana & General Store"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Select
              label={t('obCategory')}
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              options={categoryOptions}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t('obDistrict')}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                options={MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }))}
              />

              <Select
                label={t('obLocationType')}
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as 'rural' | 'semi_urban' | 'urban')}
                options={[
                  { value: 'rural', label: t('obRural') },
                  { value: 'semi_urban', label: t('obSemiUrban') },
                  { value: 'urban', label: t('obUrban') },
                ]}
              />
            </div>

            <Select
              label={t('obStage')}
              value={businessStage}
              onChange={(e) => setBusinessStage(e.target.value as BusinessStage)}
              options={[
                { value: 'idea', label: 'Planning / New Idea (नियोजन टप्पा)' },
                { value: 'early_stage', label: 'Early Stage (< 1 Year) (सुरुवातीचा टप्पा)' },
                { value: 'established', label: 'Established Operational (> 1 Year) (स्थिर व्यवसाय)' },
                { value: 'scaling', label: 'Expanding / Scaling (विस्तार टप्पा)' },
              ]}
            />
          </div>
        )}

        {/* STEP 3: Financial Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('obStep3Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Help us personalize your budget limits and scheme matching. All financial figures are optional estimates.
              </p>
            </div>

            <Input
              label={t('obMainGoal')}
              placeholder="e.g. Buy commercial deep freezer and increase milk and cold drink sales"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('obFundingReq')}
                type="number"
                prefixText="₹"
                placeholder="100000"
                value={fundingReq}
                onChange={(e) => setFundingReq(e.target.value)}
              />

              <Input
                label={t('obSavingsTarget')}
                type="number"
                prefixText="₹"
                placeholder="15000"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Estimated Monthly Revenue (Optional ₹)"
                type="number"
                prefixText="₹"
                placeholder="120000"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
              />

              <Input
                label="Estimated Monthly Expenses (Optional ₹)"
                type="number"
                prefixText="₹"
                placeholder="80000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review and Complete */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{t('obStep4Title')}</h2>
              <p className="text-xs text-slate-500">
                Confirm your profile details before launching your interactive dashboard
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-2">
                <div>
                  <span className="text-slate-500 block">Owner Name:</span>
                  <span className="font-semibold text-slate-900">{displayName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Language:</span>
                  <span className="font-semibold text-slate-900">{preferredLang === 'mr' ? 'मराठी' : 'English'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-2">
                <div>
                  <span className="text-slate-500 block">Business:</span>
                  <span className="font-semibold text-slate-900">{businessName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-semibold text-slate-900">{district}, Maharashtra</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block">Primary Business Goal:</span>
                <span className="font-semibold text-slate-900">{mainGoal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('btnBack')}
            </Button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              {t('btnNext')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={handleFinish} className="font-semibold">
              {t('obFinishButton')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
