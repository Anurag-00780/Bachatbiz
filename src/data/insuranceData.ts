export interface InsuranceTopic {
  id: string;
  title: string;
  titleMr: string;
  category: 'business' | 'agriculture' | 'personal_health';
  summary: string;
  summaryMr: string;
  coverageDetails: string;
  coverageDetailsMr: string;
  premiumRange: string;
  exclusions: string[];
  exclusionsMr: string[];
  claimProcess: string[];
  claimProcessMr: string[];
  officialLink?: string;
}

export const insuranceTopics: InsuranceTopic[] = [
  {
    id: 'shopkeepers-policy',
    title: 'Standard Shopkeeper & Micro-Enterprise Package Insurance',
    titleMr: 'दुकानदार व सूक्ष्म व्यवसाय पॅकेज विमा',
    category: 'business',
    summary: 'Comprehensive package protection covering building, inventory stock, glass breakage, money in transit, and fire/flood damage.',
    summaryMr: 'दुकान इमारत, साठा, वीज शॉर्टसर्किट, पूर, चोरी आणि गल्ल्यातील रोख रकमेचे सर्वसमावेशक विमा संरक्षण.',
    coverageDetails: 'Covers inventory loss against fire, lightning, earthquake, storm, riot, burglary, and transit theft up to chosen Sum Insured.',
    coverageDetailsMr: 'आग, वीज पडणे, भूकंप, चक्रीवादळ, दंगल आणि चोरी यांपासून निवडलेल्या विमा रकमेपर्यंत नुकसान भरपाई मिळते.',
    premiumRange: 'Approx. ₹800 to ₹2,500 per year for ₹5 Lakh to ₹15 Lakh stock coverage depending on building construction type.',
    exclusions: [
      'Loss due to intentional misconduct, fraud, or negligence',
      'Wear and tear, gradual deterioration, or pest/termite damage to grain',
      'Shortage discovered during routine stock-taking without evidence of burglary',
      'Unattended shop left unlocked overnight',
    ],
    exclusionsMr: [
      'जाणूनबुजून केलेले नुकसान किंवा फसवणूक',
      'नैसर्गिक झीज, धान्याला कीड लागणे किंवा उंदरांनी केलेले नुकसान',
      'चोरीचा कोणताही पुरावा नसताना अचानक हिशोबात माल कमी आढळणे',
      'दुकान रात्री उघडे ठेवल्यामुळे झालेली चोरी',
    ],
    claimProcess: [
      'Notify the insurer within 24-48 hours of incident.',
      'File an FIR at local police station immediately in case of burglary, riot, or suspicious fire.',
      'Take clear, timestamped photos and video of all damaged goods before cleaning up.',
      'Preserve purchase bills, purchase register, and stock audit records for surveyor inspection.',
      'Submit formal claim form with surveyor loss report.',
    ],
    claimProcessMr: [
      'घटनेनंतर २४ ते ४८ तासांच्या आत विमा कंपनीला कळवा.',
      'चोरी किंवा आगीच्या घटनेत स्थानिक पोलीस ठाण्यात तातडीने एफआयआर (FIR) नोंदवा.',
      'स्वच्छता करण्यापूर्वी नुकसान झालेल्या सर्व मालाचे स्पष्ट फोटो व व्हिडिओ काढून ठेवा.',
      'सर्व्हेअरच्या तपासणीसाठी मालाची खरेदी बिले व स्टॉक रजिस्टर तयार ठेवा.',
      'दावा अर्ज व पंचनाम्याची प्रत विमा कंपनीकडे सादर करा.',
    ],
    officialLink: 'https://www.gicouncil.in/',
  },
  {
    id: 'pm-fasal-bima',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) - Crop Insurance',
    titleMr: 'प्रधानमंत्री पीक विमा योजना (PMFBY) - १ रुपयात पीक विमा',
    category: 'agriculture',
    summary: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest across Maharashtra.',
    summaryMr: 'पेरणीपासून काढणीपश्चात टप्प्यापर्यंत दुष्काळ, अतिवृष्टी, गारपीट आणि कीडरोगापासून शेतकऱ्यांना मिळणारे पीक संरक्षण.',
    coverageDetails: 'Provides localized risk compensation, mid-season adversity relief, and yield shortfall compensation based on crop-cutting experiments.',
    coverageDetailsMr: 'स्थानिक नैसर्गिक आपत्ती, हंगामातील प्रतिकूल परिस्थिती आणि सरासरी उत्पादनातील तूट यावर शासकीय भरपाई.',
    premiumRange: 'Farmers in Maharashtra pay a nominal token fee of just ₹1 per application, with remaining premium borne jointly by state and central governments.',
    exclusions: [
      'Losses arising out of war and nuclear risks',
      'Malicious damage by domestic or wild animals (covered under separate forest relief schemes)',
      'Harvested crop left in open fields exceeding 14 days without safe storage',
    ],
    exclusionsMr: [
      'युद्ध किंवा अण्वस्त्र आपत्ती',
      'रानटी जनावरांनी केलेले नुकसान (यासाठी वनविभागाची स्वतंत्र योजना असते)',
      'काढणी केलेला शेतमाल १४ दिवसांपेक्षा जास्त काळ शेतात उघड्यावर ठेवल्यास होणारे नुकसान',
    ],
    claimProcess: [
      'Enroll before designated cut-off date through Aaple Sarkar / CSC portal with 7/12 extract and sowing declaration.',
      'In case of localized storm/inundation, inform insurance company via Crop Insurance App within 72 hours of loss.',
      'Joint survey conducted by revenue officer, agriculture officer, and insurance representative.',
      'Direct Benefit Transfer (DBT) credited directly into Aadhaar-linked bank account.',
    ],
    claimProcessMr: [
      'अंतिम मुदतीपूर्वी ७/१२ उतारा व पीक पेरा नोंदणीसह आपले सरकार / सीएससी पोर्टलवरून नोंदणी करा.',
      'अतिवृष्टी किंवा गारपीट झाल्यास ७२ तासांच्या आत "Crop Insurance" अ‍ॅपवर नुकसानीची नोंद करा.',
      'कृषी अधिकारी, तलाठी आणि कंपनी प्रतिनिधी यांच्याकडून संयुक्त पंचनामा होतो.',
      'मंजूर नुकसान भरपाई थेट आधार लिंक बँक खात्यात डीबीटी द्वारे जमा होते.',
    ],
    officialLink: 'https://pmfby.gov.in/',
  },
  {
    id: 'social-security-combo',
    title: 'PM Jeevan Jyoti & Suraksha Bima Yojana (Life & Accident Protection)',
    titleMr: 'प्रधानमंत्री जीवन ज्योती व सुरक्षा विमा (जीवन व अपघात संरक्षण)',
    category: 'personal_health',
    summary: 'The most affordable foundational insurance duo in India: ₹2 Lakh life cover + ₹2 Lakh accidental cover.',
    summaryMr: 'भारतातील सर्वात स्वस्त पायाभूत सुरक्षा: २ लाख रुपयांचे जीवन संरक्षण + २ लाख रुपयांचे अपघात संरक्षण.',
    coverageDetails: 'PMJJBY pays ₹2,00,000 on death due to any cause. PMSBY pays ₹2,00,000 on accidental death or permanent total disability, and ₹1,00,000 on permanent partial disability.',
    coverageDetailsMr: 'PMJJBY अंतर्गत कोणत्याही कारणाने मृत्यू झाल्यास २ लाख रुपये मिळतात. PMSBY अंतर्गत अपघाती मृत्यू किंवा कायमचे अपंगत्व आल्यास २ लाख रुपये वारसाला मिळतात.',
    premiumRange: 'Combined total of ₹456 per year (₹436 for PMJJBY + ₹20 for PMSBY) auto-debited annually from savings account.',
    exclusions: [
      'Suicide within initial policy period (PMJJBY)',
      'Self-inflicted intentional injuries or intoxication (PMSBY)',
      'Account closing or insufficient balance leading to auto-debit failure',
    ],
    exclusionsMr: [
      'सुरुवातीच्या कालावधीत आत्महत्या',
      'स्वतःला जाणूनबुजून इजा करून घेणे किंवा नशेत झालेला अपघात',
      'बँक खात्यात शिल्लक नसल्यामुळे हप्ता कापला न जाणे',
    ],
    claimProcess: [
      'Nominee approaches the bank branch where the auto-debit facility was activated.',
      'Submit death certificate, claimant KYC (Aadhaar & PAN), and canceled cheque.',
      'For accidental death, enclose copy of Police FIR, Panchnama, and Post-Mortem report.',
      'Claim is processed and settled within 30 days into nominee bank account.',
    ],
    claimProcessMr: [
      'वारसदाराने ज्या बँकेतून हप्ता कापला जात होता त्या शाखेत जावे.',
      'मृत्यू दाखला, वारसदाराचे आधार कार्ड व पासबुक प्रत सादर करावी.',
      'अपघाती मृत्यू असल्यास पोलीस एफआयआर, पंचनामा व शवविच्छेदन अहवाल जोडावा.',
      'कागदपत्रे तपासल्यानंतर ३० दिवसांत रक्कम वारसाच्या खात्यात जमा होते.',
    ],
    officialLink: 'https://financialservices.gov.in/',
  },
  {
    id: 'health-protection-maharashtra',
    title: 'Ayushman Bharat & Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    titleMr: 'आयुष्मान भारत व महात्मा जोतिराव फुले जन आरोग्य योजना (MJPJAY)',
    category: 'personal_health',
    summary: 'Cashless hospital treatment up to ₹5 Lakh per family per year across empaneled hospitals in Maharashtra.',
    summaryMr: 'महाराष्ट्रातील अंगीकृत रुग्णालयांमध्ये प्रति कुटुंब प्रति वर्ष ५ लाख रुपयांपर्यंत मोफत कॅशलेस उपचार.',
    coverageDetails: 'Covers over 1,350 medical and surgical procedures including cardiac surgeries, cancer therapy, kidney dialysis, and trauma care.',
    coverageDetailsMr: 'हृदयरोग शस्त्रक्रिया, कर्करोग उपचार, डायलिसिस व अपघाती उपचारांसह १,३५० हून अधिक आजारांवर मोफत उपचार.',
    premiumRange: '100% free for eligible ration card holders and Ayushman card holders; 100% state subsidized.',
    exclusions: [
      'Out-patient (OPD) visits that do not require hospital admission',
      'Cosmetic and plastic surgery unless required for post-burn reconstruction',
      'Treatment taken in non-empaneled private nursing homes without referral',
    ],
    exclusionsMr: [
      'दाखल न होता केलेला बाह्यरुग्ण (OPD) तपासणी खर्च',
      'केवळ सौंदर्यासाठी केलेल्या शस्त्रक्रिया',
      'योजनेशी संलग्न नसलेल्या खाजगी दवाखान्यातील खर्च',
    ],
    claimProcess: [
      'Carry Ration Card (Yellow/Orange) and Aadhaar Card to any empaneled hospital.',
      'Meet the hospital Arogyamitra at the dedicated helpdesk.',
      'Arogyamitra issues pre-authorization online with zero upfront cash deposit required.',
      'Hospital discharges patient with complete medications without out-of-pocket payment.',
    ],
    claimProcessMr: [
      'रेशन कार्ड (पिवळे/केशरी) आणि आधार कार्ड घेऊन योजनेशी जोडलेल्या रुग्णालयात जा.',
      'रुग्णालयातील "आरोग्यमित्र" कक्षात भेट द्या.',
      'आरोग्यमित्र ऑनलाइन पूर्व-मंजुरी मिळवतो; एकही रुपया आगाऊ भरण्याची गरज नसते.',
      'उपचार पूर्ण झाल्यावर रुग्णाला मोफत औषधांसह डिस्चार्ज दिला जातो.',
    ],
    officialLink: 'https://www.jeevandayee.gov.in/',
  },
];

export interface TermDefinition {
  term: string;
  termMr: string;
  definition: string;
  definitionMr: string;
}

export const insuranceGlossary: TermDefinition[] = [
  {
    term: 'Sum Insured',
    termMr: 'विमा संरक्षित रक्कम (Sum Insured)',
    definition: 'The maximum total financial payout an insurance company will reimburse in the event of an approved claim during the policy year.',
    definitionMr: 'विमा कंपनीकडून संकट आल्यास एका वर्षात जास्तीत जास्त किती भरपाई मिळू शकते ती अंतिम मर्यादा.',
  },
  {
    term: 'Premium',
    termMr: 'विमा हप्ता (Premium)',
    definition: 'The periodic fee (monthly or annually) you pay to the insurance provider to keep your policy active and operational.',
    definitionMr: 'विमा संरक्षण चालू ठेवण्यासाठी कंपनीला दरमहा किंवा दरवर्षी द्यावी लागणारी रक्कम.',
  },
  {
    term: 'Deductible',
    termMr: 'वजावट रक्कम (Deductible / Excess)',
    definition: 'A small pre-agreed amount of loss that the business owner pays from their own pocket before the insurer covers the remaining loss.',
    definitionMr: 'विमा कंपनीने भरपाई देण्यापूर्वी नुकसान रकमेतील स्वतः भरावा लागणारा सुरुवातीचा छोटा वाटा.',
  },
  {
    term: 'Nominee',
    termMr: 'वारसदार (Nominee)',
    definition: 'The legally appointed family member who officially receives claim proceeds in the unfortunate event of the policyholder’s demise.',
    definitionMr: 'विमाधारकाचा मृत्यू झाल्यास विम्याचे पैसे कायदेशीररित्या ज्या व्यक्तीला मिळतात तो वारसदार.',
  },
];
