import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
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
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Store,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (path: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { loginAsDemo } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const featureCards = [
    {
      title: 'Business Income & Expense Manager',
      titleMr: 'जमा आणि खर्च व्यवस्थापक',
      desc: 'Track daily cash and UPI collections with zero missing entries. Keep your udhaar ledger organized.',
      descMr: 'दैनंदिन रोख व युपीआय जमा-खर्च स्पष्ट नोंदवा. उधारी वही सुरक्षित ठेवा.',
      icon: Receipt,
      path: '/transactions',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Loan EMI & Affordability Calculator',
      titleMr: 'कर्ज ईएमआय व परवडणारी क्षमता गणक',
      desc: 'Compare true reducing-balance interest rates against flat moneylender rates. Evaluate repayment safety.',
      descMr: 'फ्लॅट विरुद्ध रिड्यूसिंग व्याजाची अचूक तुलना करा. मासिक परवड तपासूनच कर्ज घ्या.',
      icon: Calculator,
      path: '/calculator',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'Government Scheme Discovery',
      titleMr: 'शासकीय योजना व अनुदान शोध',
      desc: 'Search verified Maharashtra and national schemes including CMEGP, Mudra, PMEGP, and Annasaheb Patil IRSY.',
      descMr: 'CMEGP, मुद्रा, PMEGP आणि अण्णासाहेब पाटील महामंडळाच्या अधिकृत योजना शोधा.',
      icon: Landmark,
      path: '/schemes',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      title: 'Monthly Budget & Savings Goals',
      titleMr: 'अंदाजपत्रक व बचत उद्दिष्टे',
      desc: 'Establish category spending caps for inventory, rent, and wages. Save for deep freezers or solar inverters.',
      descMr: 'मालाचा साठा, भाडे व मजुरीच्या खर्चावर मर्यादा ठेवा. नवीन यंत्रांसाठी नियोजनबद्ध बचत करा.',
      icon: PiggyBank,
      path: '/financial-planner',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Bilingual Financial Literacy Academy',
      titleMr: 'द्विभाषिक आर्थिक साक्षरता अकादमी',
      desc: '10 practical micro-lessons in Marathi and English with interactive quizzes on digital payments and scam defense.',
      descMr: 'डिजिटल पेमेंट, सायबर सुरक्षा आणि व्यवसाय नियोजनावर आधारित सोपे १० धडे व प्रश्नमंजुषा.',
      icon: GraduationCap,
      path: '/learn',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      title: 'AI Financial Assistant',
      titleMr: 'आर्थिक सहाय्यक',
      desc: 'Instant rule-based and AI guidance for small shopkeepers on bookkeeping rules, loans, and official schemes.',
      descMr: 'किराणा दुकानदार व शेतकऱ्यांच्या आर्थिक प्रश्नांवर तत्पर मराठी व इंग्रजी मार्गदर्शन.',
      icon: BotMessageSquare,
      path: '/chatbot',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Business Profile',
      titleMr: 'तुमची व्यवसाय माहिती भरा',
      desc: 'Tell us your trade (Kirana, Agriculture, Artisan, Dairy, Services) and your district in Maharashtra.',
      descMr: 'तुमचा व्यवसाय प्रकार (किराणा, शेती, हस्तकला, दुग्धव्यवसाय) आणि जिल्हा निवडा.',
    },
    {
      num: '02',
      title: 'Record Your Income & Expenses',
      titleMr: 'दैनंदिन जमा-खर्च नोंदवा',
      desc: 'Log cash sales, UPI collections, vendor payments, and bills in seconds with zero accounting jargon.',
      descMr: 'रोख विक्री, क्युआर पेमेंट, मालाची खरेदी व दुकान भाडे सहजतेने नोंदवा.',
    },
    {
      num: '03',
      title: 'Explore Schemes & Protection',
      titleMr: 'योग्य योजना व विमा शोधा',
      desc: 'Discover verified credit-linked subsidies and low-cost insurance tailored to your district and category.',
      descMr: 'तुमच्या जिल्ह्यासाठी लागू असलेले शासकीय अनुदान आणि परवडणारा विमा शोधा.',
    },
    {
      num: '04',
      title: 'Plan Confident Growth',
      titleMr: 'व्यवसाय वाढीचे नियोजन करा',
      desc: 'Use clear profit trends, cash flow forecasts, and EMI checks to expand without falling into debt traps.',
      descMr: 'नफ्याचा आलेख, रोख प्रवाहाचा अंदाज आणि ईएमआय तपासून निर्धास्तपणे प्रगती करा.',
    },
  ];

  const faqs = [
    {
      q: 'Is BachatBiz free for rural shopkeepers and small entrepreneurs?',
      qMr: 'बचतबिझ ग्रामीण दुकानदार व छोट्या उद्योजकांसाठी मोफत आहे का?',
      a: 'Yes. BachatBiz is completely free to use. All financial calculations, ledger management, government scheme guides, and literacy academy modules run locally in your browser with zero subscription charges.',
      aMr: 'होय. बचतबिझ पूर्णपणे मोफत आहे. हिशोब ठेवणे, ईएमआय गणक, शासकीय योजनांची माहिती आणि शिक्षण अकादमी या सर्व सुविधा विनामूल्य उपलब्ध आहेत.',
    },
    {
      q: 'Does BachatBiz directly approve or disburse bank loans?',
      qMr: 'बचतबिझ थेट कर्ज मंजूर किंवा वितरित करते का?',
      a: 'No. BachatBiz is strictly an educational financial management and discovery platform. We help you calculate loan affordability, prepare clean financial records, and locate official government application portals (like PMEGP, CMEGP, or Mudra). Only authorized banks disburse loans.',
      aMr: 'नाही. बचतबिझ हे शैक्षणिक व व्यवस्थापन व्यासपीठ आहे. आम्ही तुम्हाला ईएमआय परवड तपासायला आणि अधिकृत शासकीय पोर्टलवर अर्ज करायला मदत करतो. प्रत्यक्ष कर्ज केवळ अधिकृत बँकाच मंजूर करतात.',
    },
    {
      q: 'Is my financial transaction data kept private?',
      qMr: 'माझ्या दुकानाचा आर्थिक डेटा सुरक्षित व खाजगी राहतो का?',
      a: 'Absolutely. BachatBiz enforces strict per-user data isolation. Your transactions, customer balances, and budgets are never sold, shared, or accessible by other accounts. You can also export your full data to CSV or JSON anytime.',
      aMr: 'नक्कीच. प्रत्येक युझरचा डेटा पूर्णपणे वेगळा व सुरक्षित ठेवला जातो. तुमचा हिशोब, उधारी आणि नफा कोणाशीही शेअर केला जात नाही.',
    },
    {
      q: 'Can I use BachatBiz completely in Marathi (मराठी)?',
      qMr: 'मी बचतबिझ संपूर्णपणे मराठीत वापरू शकतो का?',
      a: 'Yes! The entire application has native Marathi language support. You can toggle between English and Marathi anytime using the language selector in the top header.',
      aMr: 'होय! संपूर्ण अ‍ॅप मराठीत उपलब्ध आहे. तुम्ही वर दिलेल्या भाषा बटणावरून कधीही मराठी किंवा इंग्रजी भाषा निवडू शकता.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Empowering Maharashtra’s Small Businesses & Rural Enterprises</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                {language === 'mr' ? (
                  <>
                    पैशांचे अचूक नियोजन करा.{' '}
                    <span className="text-emerald-400">व्यवसाय समृद्ध बनवा.</span>
                  </>
                ) : (
                  <>
                    Manage Your Money.{' '}
                    <span className="text-emerald-400">Grow Your Business.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                {language === 'mr'
                  ? 'बचतबिझ हे किराणा दुकानदार, शेतकरी, कारागीर व छोट्या व्यावसायिकांसाठी डिजिटल जमा-खर्च वही, कर्ज ईएमआय गणक, शासकीय अनुदान शोध व आर्थिक साक्षरतेचे हक्काचे व्यासपीठ आहे.'
                  : 'BachatBiz helps rural entrepreneurs and small shopkeepers in Maharashtra track income and expenses, plan loan repayments, discover financial support schemes, and make smarter financial decisions.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  variant="saffron"
                  onClick={() => onNavigate('/register')}
                  className="font-bold shadow-lg shadow-amber-900/30 text-white"
                >
                  {t('navGetStarted')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    loginAsDemo();
                    onNavigate('/dashboard');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border-emerald-700 font-semibold backdrop-blur-xs"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-amber-300" />
                  {t('navDemo')} (Nashik Kirana)
                </Button>
              </div>

              {/* Trust proof strip */}
              <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-3 gap-4 text-xs text-emerald-200/90">
                <div>
                  <p className="text-lg font-bold text-white font-mono tabular-nums">100%</p>
                  <p className="text-[11px] text-emerald-300/80">Local Browser Privacy</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white font-mono tabular-nums">8+</p>
                  <p className="text-[11px] text-emerald-300/80">Verified MH Schemes</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white font-mono tabular-nums">EN & MR</p>
                  <p className="text-[11px] text-emerald-300/80">Complete Marathi Support</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Dashboard Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-emerald-700/40 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Shree Ganesh Kirana (Nashik)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-slate-500">
                    October 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-emerald-800 font-medium block">
                      Total Income (जमा)
                    </span>
                    <span className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
                      ₹1,13,200
                    </span>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-[11px] text-rose-800 font-medium block">
                      Total Expenses (खर्च)
                    </span>
                    <span className="text-lg font-bold text-rose-900 font-mono tabular-nums">
                      ₹72,450
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Net Monthly Profit (निव्वळ नफा)
                    </span>
                    <span className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
                      +₹40,750
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>36% Margin</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Goal: Commercial Deep Freezer (₹42,000)</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-700">68%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[68%]"></div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full font-semibold"
                    onClick={() => {
                      loginAsDemo();
                      onNavigate('/dashboard');
                    }}
                  >
                    Open Live Interactive Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 block">
            Integrated Financial Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything A Rural Entrepreneur Needs To Succeed
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From daily counter accounting to government credit subvention, BachatBiz is built specifically for the realities of local commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.title}
                className="hover:border-emerald-600/60 transition-all duration-200 hover:shadow-md cursor-pointer group flex flex-col justify-between"
                onClick={() => onNavigate(feat.path)}
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${feat.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                    {language === 'mr' ? feat.titleMr : feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'mr' ? feat.descMr : feat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 block">
              Step-by-Step Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How BachatBiz Works in 4 Simple Steps
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              No complicated accounting software or expensive consultants required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative space-y-3"
              >
                <span className="text-3xl font-extrabold text-emerald-800/30 font-mono">
                  {st.num}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? st.titleMr : st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? st.descMr : st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rural Entrepreneur Value Props */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Maharashtra Focused
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for Shopkeepers, Farmers & Artisans Facing Real Realities
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike generic corporate accounting apps designed for large metro enterprises, BachatBiz is tailored for daily Kirana sales, monsoon weather unpredictability, and official state schemes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Zero Technical Jargon</h4>
                  <p className="text-xs text-slate-600">
                    Use everyday terms like &ldquo;दुकान माल साठा&rdquo;, &ldquo;उधारी&rdquo;, and &ldquo;वीज बिल&rdquo; rather than confusing double-entry accounting terms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Fraud & Scam Defense Built-in</h4>
                  <p className="text-xs text-slate-600">
                    Every section reinforces fraud warnings against fake electricity SMS, bogus loan app brokers, and UPI QR traps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Authoritative Scheme Direct Links</h4>
                  <p className="text-xs text-slate-600">
                    Direct access to official portals like MahaOnline CMEGP, KVIC PMEGP, and Mudra Udyami Mitra with verified eligibility guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => onNavigate('/register')}>
                {t('navGetStarted')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="p-6 bg-emerald-900 text-white space-y-4 border-emerald-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                <h3 className="text-base font-bold text-white">
                  Responsible Financial Design Guarantee
                </h3>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                BachatBiz does not harvest confidential passwords, OTPs, or UPI PINs. We will never guarantee an unverified bank loan or charge upfront loan application commissions.
              </p>
              <div className="pt-3 border-t border-emerald-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-emerald-300 font-semibold">100% Free Access</span>
                  <span className="text-[11px] text-emerald-200/70">No subscriptions or hidden fees</span>
                </div>
                <div>
                  <span className="block text-emerald-300 font-semibold">Emergency Support</span>
                  <span className="text-[11px] text-emerald-200/70">Helpline 1930 integrated</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 block">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 text-sm hover:text-emerald-900"
                >
                  <span>{language === 'mr' ? faq.qMr : faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {language === 'mr' ? faq.aMr : faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Take Control of Your Business Finances?
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base">
            Join thousands of small business owners in Maharashtra building sustainable, profitable enterprises with BachatBiz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="saffron"
              onClick={() => onNavigate('/register')}
              className="font-bold"
            >
              {t('navGetStarted')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                loginAsDemo();
                onNavigate('/dashboard');
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-emerald-600"
            >
              {t('navDemo')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
