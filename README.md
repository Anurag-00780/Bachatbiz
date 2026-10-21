# BachatBiz (बचतबिझ)
> **Tagline:** Save Smart. Grow Your Business. (हुशारीने बचत करा. व्यवसाय वाढवा.)

BachatBiz is a digital financial assistance, business management, and financial literacy platform tailored for rural entrepreneurs, shopkeepers, farmers, artisans, and micro-business owners across Maharashtra.

---

## 1. Problem Statement

Micro and small business owners in semi-urban and rural Maharashtra (such as Kirana store operators, dairy farmers, artisans, and tailors) frequently struggle with:
1. **Commingled Finances:** Using cash directly from shop drawers to pay household expenses, leading to unobserved cash leakages and working capital shortages.
2. **Predatory Lending Traps:** Falling for deceptive "Flat Rate" interest pitches from unregulated lenders (where a 10% flat rate actually costs ~18% in true reducing balance interest).
3. **Information Asymmetry in Government Support:** Missing out on central and Maharashtra state credit-linked subsidies (CMEGP, PMEGP, Mudra, Annasaheb Patil IRSY) due to lack of document awareness or being exploited by unauthorized middleman agents demanding cash commissions.
4. **Digital Financial Vulnerabilities:** Falling prey to fake utility bill threats, spoofed UPI payment screenshots, and dubious lending app scams.

---

## 2. Solution Overview

BachatBiz provides an integrated, bilingual (English & Marathi), privacy-conscious financial workspace:
- **Digital Cash & Udhaar Ledger:** Intuitive daily income and expense tracking with zero complex accounting jargon.
- **Reducing-Balance EMI Calculator:** Exact reducing-balance calculations, side-by-side loan scenario comparison, and a business surplus affordability index.
- **Authoritative Government Scheme Finder:** Curated directory of verified Maharashtra & Central subsidies with direct links to official government portals.
- **Financial Planning & Budget Caps:** Category expense caps with alert thresholds, cash flow forecasts, and savings goal pace calculators.
- **Financial Literacy Academy:** 10 bite-sized modules with practical Maharashtra business scenarios, fraud prevention advice, and interactive quizzes.
- **BachatBiz Financial Assistant:** Instant rule-based bilingual assistant answering questions on loans, bookkeeping, and schemes without requiring a paid API.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript (strict mode), Vite 8
- **Styling & Design System:** Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & Noto Sans Devanagari typography
- **Charts:** Zero-bloat, accessible responsive SVGs (Income vs Expense Bar Chart, Profit Trend Line, Expense Donut, EMI Principal/Interest Donut, Budget Progress Bars)
- **Data Persistence:** Isolated multi-user client storage engine with pre-seeded demo dataset and JSON backup export/import
- **Testing:** Vitest automated test suite
- **Internationalization:** Complete bilingual English and Marathi (`en` / `mr`) translations

---

## 4. Complete Route Map

### Public Experience
- `/` — Homepage with Hero, Live Dashboard Preview, Feature Highlights, 4-step workflow, FAQ, and National Cyber Helpline 1930 banner.
- `/features` — Detailed breakdown of all 6 platform capabilities.
- `/about` — Platform mission, operating principles, and focus on Maharashtra micro-enterprises.
- `/privacy` — Strict privacy guarantees, local storage isolation, and zero third-party data monetization.
- `/terms` — Responsible financial disclosures, non-advisory disclaimer, and loan terms policy.

### Authentication & Onboarding
- `/login` — Secure email/password login with 1-click Demo Account access.
- `/register` — Account registration with language preference and password validation.
- `/forgot-password` & `/reset-password` — Local recovery workflow.
- `/onboarding` — 4-step wizard: Personal Preferences, Business Details, Financial Objectives, and Review.

### Authenticated Application (13 Sidebar Routes)
1. `/dashboard` — Financial overview, KPI cards, income/expense comparisons, recent ledger records, saved schemes, and daily tip.
2. `/profile` — Business profile editor, category, district, and financial estimates.
3. `/transactions` — Full income/expense ledger, keyword search, type and category filters, sorting, details modal, and formula-safe CSV export.
4. `/financial-planner` — Monthly category budget limits, budget vs actual variance, cash flow projection, and savings goal pace tracker.
5. `/calculator` — Loan EMI calculator, reducing balance schedule, 2-scenario comparison, and affordability evaluation.
6. `/schemes` & `/schemes/:id` — Directory of verified government schemes with eligibility, document checklist, application steps, and bookmarking.
7. `/insurance` — Shopkeeper insurance, PMFBY crop insurance, PMJJBY/PMSBY, terminology glossary, and claim checklist.
8. `/learn` & `/learn/:id` — 10 interactive modules in English and Marathi with business cases, instant-scoring quizzes, and explanations.
9. `/chatbot` — Bilingual BachatBiz Financial Assistant with suggested prompts and rule-based answering.
10. `/reports` — P&L statement, category breakdowns, period filtering, print view, and CSV export.
11. `/settings` & `/settings/security` — Account info, password change, JSON data backup download, demo reset, and account deletion.
12. `/help` — Searchable FAQ, emergency cyber helpline 1930, and demo support ticket form.
13. `Logout` — Invalidates the current session.

---

## 5. Demo Account Credentials (For Evaluation & Presentations)

You can access the platform instantly using the 1-click demo button on the login screen, or with the following credentials:
- **Email:** `demo@bachatbiz.in`
- **Password:** `demo123`
- **Pre-seeded Business:** *Shree Ganesh Kirana & General Store*, Nashik, Maharashtra
- **Seeded Data:** 3 months of realistic daily counter sales, APMC inventory purchases, shop rent, electricity bills, active deep freezer and solar savings goals, and completed academy quizzes.

---

## 6. Installation & Development Commands

### Prerequisites
- Node.js (v18+)
- npm or bun

### Setup
```bash
# Install dependencies
npm install

# Run automated Vitest test suite
npm test

# Build application for production
npm run build

# Start development server
npm run dev
```

---

## 7. Verified Schemes Curated in BachatBiz

1. **CMEGP Maharashtra:** Chief Minister Employment Generation Programme (up to ₹50L manufacturing, ₹10L service with 15–35% state subsidy).
2. **PMEGP:** Prime Minister's Employment Generation Programme (central MSME credit-linked subsidy).
3. **PM Mudra Yojana:** Shishu (₹50k), Kishore (₹50k–₹5L), Tarun (₹5L–₹10L) collateral-free micro-credit.
4. **Annasaheb Patil IRSY (Maharashtra):** 100% interest reimbursement up to 12% on bank loans up to ₹15 Lakh.
5. **PM SVANidhi:** Street vendor micro-credit with 7% interest subsidy and UPI cashback incentives.
6. **Stand-Up India:** Greenfield loans from ₹10 Lakh to ₹1 Crore for women and SC/ST entrepreneurs.
7. **Agri-Infrastructure Fund (AIF):** Post-harvest storage and cold chain loans with 3% interest subvention.
8. **Mahila Samridhi Yojana:** Concessional 4% interest microfinance for women artisans.

---

## 8. Responsible Financial Design & Security Principles

- **No Harvesting of Critical Secrets:** BachatBiz never collects OTPs, UPI PINs, banking passwords, or Aadhaar numbers.
- **Formula Injection Defense:** All CSV exports prepend `'` to formula triggers (`=`, `+`, `-`, `@`) to prevent spreadsheet exploitation.
- **National Helpline 1930:** Emergency cyber financial fraud reporting details are embedded across public and authenticated screens.
- **Explicit Disclaimers:** Cautious guidance explaining that BachatBiz is an educational management tool, not an authorized lender or bank.
