import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ChatMessage } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  BotMessageSquare,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ChatbotViewProps {
  onNavigate: (path: string) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { transactions } = useData();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-0',
    sender: 'assistant',
    text:
      language === 'mr'
        ? `नमस्कार ${profile?.displayName || 'उद्योजक मित्र'}! मी बचतबिझ वित्तीय सहाय्यक आहे. मी तुम्हाला व्यवसाय कर्ज, हिशोब वही, शासकीय योजना (CMEGP, मुद्रा, PMEGP), ईएमआय गणना किंवा सायबर सुरक्षेबद्दल कशी मदत करू?`
        : `Namaste ${profile?.displayName || 'Entrepreneur'}! I am your BachatBiz Financial Assistant. How can I assist you with business loans, daily bookkeeping, government schemes (CMEGP, Mudra, PMEGP), or digital payment safety today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestedQuestions = [
    {
      en: 'How do I calculate EMI for a ₹2 Lakh loan at 10.5%?',
      mr: '२ लाख रुपयांच्या कर्जासाठी १०.५% व्याजाने ईएमआय कसा मोजायचा?',
    },
    {
      en: 'Which government scheme is best for starting a shop in Maharashtra?',
      mr: 'महाराष्ट्रात नवीन दुकान सुरू करण्यासाठी कोणती शासकीय योजना उत्तम आहे?',
    },
    {
      en: 'What documents are required for PM Mudra Kishore loan?',
      mr: 'मुद्रा किशोर कर्जासाठी कोणती कागदपत्रे लागतात?',
    },
    {
      en: 'How do I prevent fake payment screenshot scams in my store?',
      mr: 'दुकानात खोट्या स्क्रीनशॉट फसवणुकीपासून कसे सावध राहावे?',
    },
    {
      en: 'What is the Annasaheb Patil Interest Reimbursement scheme?',
      mr: 'अण्णासाहेब पाटील महामंडळाची व्याज परतावा योजना काय आहे?',
    },
  ];

  // Rule-based factual answering engine
  const getRuleBasedResponse = (query: string): string => {
    const q = query.toLowerCase();

    // EMI & loan calculation query
    if (q.includes('emi') || q.includes('हप्ता') || q.includes('calculate') || q.includes('गणक') || q.includes('२ लाख') || q.includes('2 lakh')) {
      if (language === 'mr') {
        return '२,००,००० रुपयांच्या कर्जासाठी १०.५% वार्षिक व्याजाने ३ वर्षांसाठी (३६ महिने) मासिक ईएमआय साधारण ₹६,५०० येतो. एकूण व्याज सुमारे ₹३४,००० होईल. आमच्या "कर्ज ईएमआय गणक" टॅबमध्ये जाऊन तुम्ही स्वतः वेगवेगळ्या रकमा आणि मुदतीसाठी अचूक हप्ता मोजू शकता!';
      }
      return 'For a ₹2,00,000 business loan at 10.5% reducing balance interest over 3 years (36 months), your monthly EMI is approximately ₹6,500. Total interest paid over 3 years is about ₹34,000. You can test custom loan amounts, tenures, and interest rates in our "Loan Calculator" tool!';
    }

    // Scheme query - CMEGP / PMEGP
    if (q.includes('scheme') || q.includes('योजना') || q.includes('cmegp') || q.includes('pmegp') || q.includes('अनुदान') || q.includes('subsidy')) {
      if (language === 'mr') {
        return 'महाराष्ट्रात दोन मुख्य अनुदान योजना आहेत: \n1) CMEGP (मुख्यमंत्री रोजगार निर्मिती कार्यक्रम): सेवा व्यवसायासाठी ₹१० लाख व उत्पादनासाठी ₹५० लाखांपर्यंत कर्ज, ज्यावर ग्रामीण भागात १५% ते ३५% भांडवली अनुदान मिळते.\n2) PMEGP: खादी व ग्रामोद्योग अंतर्गत उत्पादन प्रकल्पासाठी ₹५० लाखांपर्यंत कर्ज.\nअधिक माहितीसाठी "शासकीय योजना" टॅब पहा, जिथे अधिकृत सरकारी पोर्टल लिंक उपलब्ध आहेत.';
      }
      return 'For Maharashtra entrepreneurs, the two major credit-linked subsidy schemes are:\n1) CMEGP (Chief Minister Employment Generation Programme): Up to ₹10 Lakh for service/retail and ₹50 Lakh for manufacturing, offering 15% to 35% capital subsidy.\n2) PMEGP: Central MSME/KVIC scheme offering up to ₹50 Lakh with rural subsidy up to 35%.\nVisit the "Government Schemes" section for complete eligibility rules and official MahaOnline/KVIC portal links.';
    }

    // Mudra loan query
    if (q.includes('mudra') || q.includes('मुद्रा') || q.includes('shishu') || q.includes('kishore') || q.includes('tarun')) {
      if (language === 'mr') {
        return 'प्रधानमंत्री मुद्रा योजनेमध्ये ३ टप्पे आहेत:\n• शिशु: ₹५०,००० पर्यंत विनातारण\n• किशोर: ₹५०,००१ ते ₹५ लाख (दुकान माल साठ्यासाठी)\n• तरुण: ₹५ लाख ते ₹१० लाख\nमुद्रा कर्जासाठी आधार कार्ड, पॅन कार्ड, ६ महिन्यांचे बँक स्टेटमेंट, दुकानाचा गुमास्ता/शॉप अ‍ॅक्ट परवाना आणि खरेदी साहित्याचे कोटेशन लागते. सावध राहा: मुद्रा कर्जासाठी कोणत्याही एजंटला रोख कमिशन देऊ नका!';
      }
      return 'PM Mudra Yojana offers 3 tiers:\n• Shishu: Up to ₹50,000 (collateral-free for micro-vendors)\n• Kishore: ₹50,001 to ₹5 Lakh (ideal for shop stock and equipment)\n• Tarun: ₹5 Lakh to ₹10 Lakh\nRequired documents: Aadhaar, PAN, 6 months bank statement, Shop Act/Udyam registration, and vendor quotation. Never pay cash commissions to unauthorized brokers for Mudra approval!';
    }

    // Fraud, UPI, Soundbox
    if (q.includes('scam') || q.includes('fraud') || q.includes('फसवणूक') || q.includes('soundbox') || q.includes('screenshot') || q.includes('स्क्रीनशॉट') || q.includes('upi')) {
      if (language === 'mr') {
        return 'डिजिटल पेमेंट सुरक्षेचे ३ सुवर्णनियम:\n१) ग्राहकाच्या मोबाईलवरील "Payment Successful" स्क्रीनशॉटवर कधीही विश्वास ठेवू नका. नेहमी स्वतःचा मर्चंट साउंडबॉक्स किंवा बँकेच्या एसएमएसची वाट पहा.\n२) पैसे स्वीकारण्यासाठी (Receive) कधीही युपीआय पिन टाकावा लागत नाही.\n३) कोणतीही आर्थिक सायबर फसवणूक झाल्यास त्वरित १९३० या राष्ट्रीय हेल्पलाईनवर कॉल करा.';
      }
      return 'Three golden rules for store security:\n1) Never trust a "Payment Successful" screenshot shown on a customer’s phone. Only hand over goods when your own merchant Soundbox speaks or you receive a bank credit SMS.\n2) You NEVER need to enter your UPI PIN to receive money from a buyer.\n3) Immediately report cyber fraud by calling the national toll-free helpline 1930.';
    }

    // Annasaheb Patil Scheme
    if (q.includes('annasaheb') || q.includes('अण्णासाहेब') || q.includes('irsy') || q.includes('व्याज परतावा')) {
      if (language === 'mr') {
        return 'अण्णासाहेब पाटील आर्थिक विकास महामंडळाच्या व्याज परतावा योजनेमध्ये (IRSY), १५ लाख रुपयांपर्यंतच्या व्यवसाय कर्जावर १२% पर्यंतचे व्याज महामंडळ थेट तुमच्या बँक खात्यात जमा करते. यासाठी तुम्ही महाराष्ट्राचे रहिवासी असणे आणि दरमहा बँकेचा हप्ता वेळेवर भरणे बंधनकारक आहे.';
      }
      return 'Under the Annasaheb Patil Corporation Interest Reimbursement Scheme (IRSY), interest up to 12% per annum on business bank loans up to ₹15 Lakh is reimbursed directly to the entrepreneur’s account each quarter, provided you pay EMIs regularly on time.';
    }

    // Bookkeeping, Profit & Udhaar
    if (q.includes('bookkeeping') || q.includes('हिशोब') || q.includes('उधारी') || q.includes('profit') || q.includes('नफा') || q.includes('udhaar')) {
      if (language === 'mr') {
        return 'नफा मोजण्याचे सोपे सूत्र:\nनिव्वळ नफा = एकूण जमा विक्री वजा (दुकान माल साठा खरेदी + दुकान भाडे + वीज बिल + मजुरी + इतर खर्च).\nउधारी नियंत्रणासाठी नियम: ग्राहकांकडे अडकलेली एकूण उधारी तुमच्या दुकानातील चालू मालाच्या १५% पेक्षा जास्त असू नये. दर आठवड्याला नम्रपणे डिजिटल मेसेज पाठवून वसुली करा.';
      }
      return 'Simple formula for profit:\nNet Profit = Total Income - (Inventory Purchases + Shop Rent + Utilities + Wages + Other Expenses).\nUdhaar control rule: Keep total customer credit under 15% of your monthly inventory turnover. Send gentle weekend WhatsApp or SMS reminders to collect on time!';
    }

    // Default polite response
    if (language === 'mr') {
      return `मी तुमच्या प्रश्नाचे उत्तर शोधू शकलो. तुम्ही व्यवसाय कर्ज, शासकीय योजना (CMEGP, मुद्रा, PMEGP), ईएमआय गणना, हिशोब वही, किंवा सायबर सुरक्षेबद्दल विचारू शकता. वर दिलेल्या सुचवलेल्या प्रश्नांवर क्लिक करूनही तुम्ही त्वरित माहिती मिळवू शकता!`;
    }
    return `I am here to guide you on small business financial planning. You can ask about business loans, reducing-balance EMI, government schemes (CMEGP, Mudra, PMEGP), daily bookkeeping, or digital payment scam protection. Feel free to click any of the suggested questions above!`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate natural thinking settlement (300-600ms)
    setTimeout(() => {
      const replyText = getRuleBasedResponse(query);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 400);
  };

  const handleClear = () => {
    setMessages([initialGreeting]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BotMessageSquare className="w-6 h-6 text-emerald-700" />
            <span>{t('chatTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('chatSubtitle')}</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleClear}
          className="text-xs"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('chatClear')}</span>
        </Button>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          {t('chatSuggested')}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'mr' ? sq.mr : sq.en)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 text-xs text-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
            >
              {language === 'mr' ? sq.mr : sq.en}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Panel */}
      <Card className="p-4 border-slate-200 h-[480px] flex flex-col justify-between overflow-hidden bg-slate-50/40">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-800 text-white shadow-2xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400 font-mono'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="pt-3 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t('chatPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 py-2 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || loading}
              className="shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('chatSend')}</span>
            </Button>
          </form>
        </div>
      </Card>

      {/* Disclaimers Box */}
      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <strong>Important Advisory:</strong> {t('chatDisclaimer')}
      </div>
    </div>
  );
};
