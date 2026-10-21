import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BusinessCategory, BusinessStage } from '../../types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Building2, Save, CheckCircle2, MapPin, Target, Sparkles } from 'lucide-react';

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana',
  'Chandrapur', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Dhule', 'Gadchiroli',
  'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City',
  'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
  'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
  'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

export const ProfileView: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, updateProfile, currentUser } = useAuth();

  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [displayName, setDisplayName] = useState(profile?.displayName || currentUser?.fullName || '');
  const [category, setCategory] = useState<BusinessCategory>(profile?.category || 'kirana_retail');
  const [district, setDistrict] = useState(profile?.district || 'Nashik');
  const [locationType, setLocationType] = useState<'rural' | 'semi_urban' | 'urban'>(
    profile?.locationType || 'semi_urban'
  );
  const [businessStage, setBusinessStage] = useState<BusinessStage>(
    profile?.businessStage || 'established'
  );
  const [mainGoal, setMainGoal] = useState(profile?.mainGoal || '');
  const [fundingReq, setFundingReq] = useState(profile?.fundingRequirement?.toString() || '');
  const [savingsTarget, setSavingsTarget] = useState(profile?.savingsTarget?.toString() || '');
  const [monthlyRevenue, setMonthlyRevenue] = useState(profile?.monthlyRevenueEstimate?.toString() || '');
  const [monthlyExpenses, setMonthlyExpenses] = useState(profile?.monthlyExpenseEstimate?.toString() || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      businessName: businessName.trim(),
      displayName: displayName.trim(),
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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const categoryOptions = [
    { value: 'kirana_retail', label: 'Kirana / Grocery Retail (किराणा व किरकोळ दुकान)' },
    { value: 'agriculture', label: 'Agriculture & Agri-Business (शेती व कृषी व्यवसाय)' },
    { value: 'artisan_handicraft', label: 'Handicraft & Artisan (हस्तकला व कारागीर)' },
    { value: 'local_services', label: 'Local Services / Repair Shop (दुरुस्ती व स्थानिक सेवा)' },
    { value: 'food_dairy', label: 'Food, Catering & Dairy (खाद्यपदार्थ व दुग्ध व्यवसाय)' },
    { value: 'textiles_garments', label: 'Textiles & Tailoring (कापड व टेलरिंग)' },
    { value: 'manufacturing_small', label: 'Small Workshop / Manufacturing (लघु उद्योग)' },
    { value: 'other', label: 'Other Small Business (इतर व्यवसाय)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            <span>{t('sideProfile')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your business parameters updated to receive tailored scheme recommendations
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Business Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('obBusinessName')}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Input
              label="Owner Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label={t('obCategory')}
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              options={categoryOptions}
            />

            <Select
              label={t('obDistrict')}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }))}
            />

            <Select
              label={t('obLocationType')}
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as any)}
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
              { value: 'idea', label: 'Planning / Idea Stage' },
              { value: 'early_stage', label: 'Early Stage (< 1 Year)' },
              { value: 'established', label: 'Established (> 1 Year)' },
              { value: 'scaling', label: 'Expanding / Scaling' },
            ]}
          />
        </Card>

        <Card className="p-6 border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Growth Objectives & Financial Estimates
          </h3>

          <Input
            label={t('obMainGoal')}
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            required
            helperText="Used to suggest matching government subsidies and equipment savings plans."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('obFundingReq')}
              type="number"
              prefixText="₹"
              value={fundingReq}
              onChange={(e) => setFundingReq(e.target.value)}
            />

            <Input
              label={t('obSavingsTarget')}
              type="number"
              prefixText="₹"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Monthly Revenue (₹)"
              type="number"
              prefixText="₹"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
            />

            <Input
              label="Estimated Monthly Expenses (₹)"
              type="number"
              prefixText="₹"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="md">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save Profile Updates</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
