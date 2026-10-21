import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Receipt,
  Calculator,
  Landmark,
  PiggyBank,
  GraduationCap,
  BotMessageSquare,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

interface FeaturesViewProps {
  onNavigate: (path: string) => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const featuresList = [
    {
      id: 'transactions',
      title: 'Business Income & Expense Manager',
      titleMr: 'व्यवसाय जमा आणि खर्च व्यवस्थापक',
      icon: Receipt,
      description: 'Replace messy paper notebooks with a clean, searchable digital ledger. Tag transactions by product sales, inventory purchases, rent, wages, and utilities.',
      descriptionMr: 'जुनी वही-खाती बाजूला ठेवा. माल विक्री, खरेदी, दुकान भाडे आणि वीज बिलांची तारखेनुसार स्पष्ट नोंद ठेवा.',
      highlights: [
        'One-click Add Income and Add Expense modals',
        'Automatic calculations of Total Income, Total Expense, and Net Profit',
        'Date range filtering (This Month, Last Month, Last 3 Months, All Time)',
        'Sanitized CSV export for sharing with tax consultants or loan officers',
      ],
      path: '/transactions',
    },
    {
      id: 'calculator',
      title: 'Reducing-Balance Loan EMI Calculator',
      titleMr: 'रिड्यूसिंग बॅलन्स कर्ज ईएमआय गणक',
      icon: Calculator,
      description: 'Accurately calculate monthly payments using RBI-standard reducing balance interest formulas. Never get deceived by local flat rate loan promises.',
      descriptionMr: 'रिझर्व्ह बँकेच्या अधिकृत रिड्यूसिंग बॅलन्स पद्धतीने अचूक मासिक हप्ता मोजा. सावकारांच्या १०% फ्लॅट व्याजातील छुपे धोके ओळखा.',
      highlights: [
        'Complete monthly amortization repayment schedule',
        'Side-by-side comparison of 2 loan options (Tenure, Total Interest, Total Cost)',
        'Business affordability index testing proposed EMI against monthly surplus',
        'Special handling for 0% promotional or interest-free schemes',
      ],
      path: '/calculator',
    },
    {
      id: 'schemes',
      title: 'Government Scheme & Loan Finder',
      titleMr: 'शासकीय योजना व अनुदान शोध',
      icon: Landmark,
      description: 'Explore verified state and central schemes for Maharashtra entrepreneurs, shopkeepers, women, and farmers.',
      descriptionMr: 'CMEGP, मुद्रा, PMEGP आणि अण्णासाहेब पाटील महामंडळाच्या अधिकृत शासकीय योजना शोधा.',
      highlights: [
        'Direct links to official application portals (MahaOnline, KVIC, Udyami Mitra)',
        'Clear eligibility rules and document checklists (7/12, Domicile, DPR)',
        'Personalized matching based on district, stage, and category',
        'Personal bookmarking to save schemes to your dashboard',
      ],
      path: '/schemes',
    },
    {
      id: 'planner',
      title: 'Financial Planner & Savings Goals',
      titleMr: 'आर्थिक नियोजन व बचत उद्दिष्टे',
      icon: PiggyBank,
      description: 'Set monthly spending caps by category and track progress towards business assets like deep freezers, solar backup, or delivery tempo.',
      descriptionMr: 'प्रत्येक खर्चावर मर्यादा ठेवा आणि दुकानासाठी आवश्यक नवीन उपकरणांसाठी नियोजनबद्ध बचत करा.',
      highlights: [
        'Budget vs Actual spending variance visualization with threshold alerts',
        'Cash flow forecast distinguishing historical transactions from projections',
        'Savings goal pace calculator showing required monthly savings',
        '3-month emergency cushion planning for monsoon or seasonal slumps',
      ],
      path: '/financial-planner',
    },
    {
      id: 'learning',
      title: 'Financial Literacy Academy',
      titleMr: 'आर्थिक साक्षरता अकादमी',
      icon: GraduationCap,
      description: '10 practical, bite-sized modules in English and Marathi covering UPI soundboxes, credit scores, udhaar recovery, and fraud defense.',
      descriptionMr: 'स्थानिक दुकानदारांसाठी तयार केलेले १० सोपे धडे आणि प्रश्नमंजुषा. डिजिटल पेमेंट व सायबर सुरक्षेचे नियम शिका.',
      highlights: [
        'Real-world business cases grounded in Maharashtra trade contexts',
        'Interactive 3-question quizzes with instant answer explanations',
        'Dedicated guidance on National Cyber Helpline 1930 and fraud traps',
        'Track module completion and quiz scores across sessions',
      ],
      path: '/learn',
    },
    {
      id: 'chatbot',
      title: 'AI Financial Assistant',
      titleMr: 'बचतबिझ वित्तीय सहाय्यक',
      icon: BotMessageSquare,
      description: 'Ask questions in English or Marathi regarding scheme documents, interest calculation differences, and accounting rules.',
      descriptionMr: 'मराठी व इंग्रजीत व्यवसाय कर्ज, हिशोब नियम आणि शासकीय योजनांबद्दल तातडीने उत्तरे मिळवा.',
      highlights: [
        '100% works locally with comprehensive rule-based knowledge engine',
        'Optional server-side Gemini integration when API key is configured',
        'Instant answers tailored to retail, agriculture, and small services',
        'Cautious educational disclaimers protecting user financial safety',
      ],
      path: '/chatbot',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Financial Management Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore every feature built into BachatBiz to help small business owners and rural entrepreneurs manage finances, access credit, and avoid debt traps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuresList.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.id} className="p-6 flex flex-col justify-between space-y-4 border-slate-200">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'mr' ? f.titleMr : f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? f.descriptionMr : f.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {f.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate(f.path)}
                  className="w-full justify-between"
                >
                  <span>Open {language === 'mr' ? f.titleMr : f.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-8 rounded-2xl bg-emerald-900 text-white text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-emerald-300 mx-auto" />
        <h2 className="text-2xl font-bold">Try All Features Right Now</h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          Experience the full platform using our pre-seeded Maharashtra demo business account, or create your own free account in under 30 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button variant="saffron" onClick={() => onNavigate('/register')}>
            {t('navRegister')}
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('/dashboard')}
            className="bg-white/10 text-white hover:bg-white/20 border-emerald-700"
          >
            Launch Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
