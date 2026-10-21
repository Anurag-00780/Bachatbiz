import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  HelpCircle,
  Search,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  Send,
  CheckCircle2,
  PhoneCall,
  FileQuestion,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const { t, language } = useLanguage();

  const [faqSearch, setFaqSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Support form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const helpFaqs = [
    {
      category: 'Accounting & Ledger',
      q: 'How do I separate household grocery expenses from shop income?',
      qMr: 'घराचा खर्च आणि दुकानाचा गल्ला वेगळा कसा ठेवावा?',
      a: 'The best financial practice for rural shopkeepers is paying yourself a fixed monthly salary. Record all sales into your shop account. At the beginning of each month, record one "Owner Wage" expense withdrawal into your personal bank account. Never take cash directly from the shop drawer for family groceries.',
      aMr: 'सर्वोत्तम पद्धत म्हणजे स्वतःसाठी निश्चित मासिक पगार ठरवणे. दुकानातील सर्व पैसे दुकानाच्या खात्यात जमा करा आणि महिन्याच्या सुरुवातीला ठराविक रक्कम घरखर्चासाठी काढून घ्या. दैनंदिन घरखर्चासाठी गल्ल्यातून रोख पैसे काढू नका.',
    },
    {
      category: 'Loan Calculations',
      q: 'Why does a 12% reducing interest loan cost less than a 10% flat interest loan?',
      qMr: '१२% रिड्यूसिंग व्याजाचे कर्ज हे १०% फ्लॅट व्याजाच्या कर्जापेक्षा स्वस्त का पडते?',
      a: 'In a flat rate loan, the lender continues charging interest on the full starting loan amount for the entire tenure, even when you have already repaid 80% of the principal. In a reducing balance loan (used by all RBI banks), interest is charged only on the balance amount that remains unpaid. A 10% flat rate is equivalent to almost 18% reducing rate!',
      aMr: 'फ्लॅट पद्धतीत तुम्ही निम्म्याहून अधिक मुद्दल फेडल्यानंतरही सुरुवातीच्या पूर्ण रकमेवरच व्याज आकारले जाते. याउलट रिड्यूसिंग पद्धतीत दरमहा कमी होणाऱ्या मुद्दलावरच व्याज लागते. १०% फ्लॅट दर हा प्रत्यक्षात १८% रिड्यूसिंग व्याजासारखा महाग असतो.',
    },
    {
      category: 'Government Schemes',
      q: 'Do I need to pay any commission to loan agents for Mudra or CMEGP loans?',
      qMr: 'मुद्रा किंवा CMEGP कर्जासाठी कोणत्याही दलालाला कमिशन द्यावे लागते का?',
      a: 'STRICTLY NO. Demanding cash commissions for approving government loans is illegal. Official schemes like CMEGP, PMEGP, and Mudra allow direct online applications on free government portals (MahaOnline, KVIC, Udyami Mitra) without any broker or middleman.',
      aMr: 'मुळीच नाही! कर्ज मंजुरीसाठी रोख कमिशन मागणे पूर्णपणे बेकायदेशीर आहे. CMEGP, PMEGP किंवा मुद्रा योजनेसाठी महाऑनलाइन किंवा शासकीय पोर्टलवरून स्वतः विनामूल्य अर्ज करता येतो.',
    },
    {
      category: 'Digital Security',
      q: 'What should I do if a caller threatens to disconnect my shop electricity unless I pay via an app link?',
      qMr: 'वीज बिल न भरल्यास वीज कापू अशी धमकी देणारा फोन किंवा मेसेज आल्यास काय करावे?',
      a: 'Cut the call immediately. MSEDCL (Mahavitaran) will never call asking you to install third-party screen-sharing apps (like AnyDesk or QuickSupport). Always check your bill status directly on the official Mahavitaran mobile app or website, and report the scammer number to the Cyber Helpline 1930.',
      aMr: 'फोन त्वरित कट करा. महावितरण कधीही अनोळखी अ‍ॅप डाऊनलोड करायला सांगत नाही. थेट महावितरणच्या अधिकृत अ‍ॅपमध्ये किंवा बिलावर वीज बिल तपासा आणि १९३० वर तक्रार नोंदवा.',
    },
  ];

  const filteredFaqs = helpFaqs.filter((f) => {
    if (!faqSearch.trim()) return true;
    const q = faqSearch.toLowerCase();
    return (
      f.q.toLowerCase().includes(q) ||
      f.qMr.includes(q) ||
      f.a.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && message.trim()) {
      setTicketSubmitted(true);
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <span>{t('helpTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('helpSubtitle')}</p>
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="p-4 rounded-xl bg-emerald-950 text-white border border-emerald-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {t('helpEmergencyTitle')}
            </h3>
            <p className="text-sm font-extrabold text-white">
              Toll-Free National Helpline: 1930
            </p>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              Report financial fraud, unauthorized UPI transfers, or scam calls immediately within the golden hour.
            </p>
          </div>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Search FAQ */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search help topics (e.g. loan, udhaar, soundbox, scheme, cibil)..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2 pt-2">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-800 hover:text-emerald-900 transition-colors"
              >
                <span>{language === 'mr' ? faq.qMr : faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                    openIndex === idx ? 'rotate-180 text-emerald-700' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase block mb-1">
                    Category: {faq.category}
                  </span>
                  <p>{language === 'mr' ? faq.aMr : faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Support Inquiry Form */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('helpContactTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit a question or report an issue regarding the BachatBiz platform
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">
              Inquiry Logged (Demonstration Mode)
            </h4>
            <p className="text-emerald-800 leading-relaxed max-w-md mx-auto">
              Your inquiry has been simulated in this offline evaluation environment. No live external email was dispatched.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTicketSubmitted(false)}
              className="mt-2"
            >
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <Input
              label="Inquiry Subject"
              placeholder="e.g. Question about CMEGP documents or export CSV formatting"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe your issue or feedback in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 leading-relaxed border border-slate-200">
              <strong>Notice:</strong> {t('helpTicketNotice')}
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="sm">
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>{t('helpSendTicket')}</span>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
